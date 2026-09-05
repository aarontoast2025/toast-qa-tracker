/**
 * Personal.gs - Backend Business Logic for Personal QA Console
 *
 * Handles:
 * 1. Supabase REST API communication (Assignments & Evaluations)
 * 2. Team Google Sheet reading via SpreadsheetApp.openById()
 * 3. Bidirectional synchronization:
 *    - Ingest team assignments into Supabase
 *    - Sync completed personal evaluations into the team's Evaluations sheet
 */

// ==========================================
// CONFIGURATION
// ==========================================
const SPREADSHEET_ID = '15KNHO7P5aafxWbY-t1QZzjKEIPvLDQSEslu9npQbgP4';
const SUPABASE_URL = 'https://juevdlfhpgiedfjghrkk.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1ZXZkbGZocGdpZWRmamdocmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MTE2NDksImV4cCI6MjEwNDE4NzY0OX0.tXJWIDyaGJemitFLq_BoDsBM8fHwN7DD0OyDjYSOBe0';

/**
 * Web App Entry Point - Serves Index.html
 */
function doGet(e) {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const template = HtmlService.createTemplateFromFile('Index');
    template.userEmail = userEmail || 'aaron.arela@toasttab.com';
    
    return template.evaluate()
      .setTitle('Personal QA Tracker & Sync Console')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    return HtmlService.createHtmlOutput('<h3>Error loading application: ' + err.message + '</h3>');
  }
}

/**
 * Helper to include partial HTML files into templates.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Executes a request against the Supabase REST API (PostgREST).
 */
function supabaseRequest(endpoint, method, payload, prefer) {
  var baseUrl = SUPABASE_URL.replace(/\/+$/, '');
  if (!baseUrl.endsWith('/rest/v1')) {
    baseUrl += '/rest/v1';
  }
  var url = baseUrl + '/' + endpoint.replace(/^\/+/, '');
  var headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': prefer || 'return=representation'
  };

  var options = {
    method: method || 'GET',
    headers: headers,
    muteHttpExceptions: true
  };

  if (payload && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.payload = JSON.stringify(payload);
  }

  var response = UrlFetchApp.fetch(url, options);
  var code = response.getResponseCode();
  var content = response.getContentText();

  if (code >= 200 && code < 300) {
    try {
      return { success: true, data: content ? JSON.parse(content) : null };
    } catch (e) {
      return { success: true, data: content };
    }
  }

  return { success: false, error: 'Supabase Error (' + code + '): ' + content };
}

/**
 * Fetches all assignments and evaluations from Supabase for the active user.
 */
function getInitialData(qaEmail) {
  try {
    var email = (qaEmail || Session.getActiveUser().getEmail() || '').trim().toLowerCase();
    if (!email) {
      return { success: false, error: 'No user email detected' };
    }

    // 1. Fetch personal assignments
    var asgRes = supabaseRequest('personal_assignments?qa_email=eq.' + encodeURIComponent(email) + '&order=date.desc', 'GET');
    var assignments = (asgRes.success && Array.isArray(asgRes.data)) ? asgRes.data : [];

    // 2. Fetch personal evaluations
    var evalRes = supabaseRequest('personal_evaluations?qa_email=eq.' + encodeURIComponent(email) + '&order=submitted_at.desc', 'GET');
    var evaluations = (evalRes.success && Array.isArray(evalRes.data)) ? evalRes.data : [];

    return {
      success: true,
      email: email,
      assignments: assignments,
      evaluations: evaluations,
      timestamp: Date.now()
    };
  } catch (err) {
    console.error('[getInitialData] ' + err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Reads assignments assigned to qaEmail from the team Google Sheet
 * and pushes/upserts them into Supabase table `personal_assignments`.
 */
function fetchTeamAssignments(qaEmail) {
  try {
    var email = (qaEmail || Session.getActiveUser().getEmail() || '').trim().toLowerCase();
    if (!email) throw new Error('Missing QA Email');

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var asgSheet = ss.getSheetByName('Assignments');
    if (!asgSheet || asgSheet.getLastRow() < 2) {
      return { success: true, message: 'No assignments found in team sheet', count: 0, assignments: [] };
    }

    var asgData = asgSheet.getDataRange().getValues();
    var asgHeaders = asgData[0].map(function(h) { return String(h || '').trim(); });

    var idIdx = asgHeaders.indexOf('ID');
    var dateIdx = asgHeaders.indexOf('Date');
    var qaIdx = asgHeaders.indexOf('QA Email');
    var agentIdx = asgHeaders.indexOf('Agent Email');
    var rubricIdx = asgHeaders.indexOf('Rubric ID');
    var typeIdx = asgHeaders.indexOf('Evaluation Type');
    var statusIdx = asgHeaders.indexOf('Status');
    var snapIdx = asgHeaders.indexOf('Agent Snapshot');

    // Also get Agent names from Agents sheet if snapshot is not present
    var agentNamesMap = {};
    try {
      var agentSheet = ss.getSheetByName('Agents');
      if (agentSheet && agentSheet.getLastRow() >= 2) {
        var aData = agentSheet.getDataRange().getValues();
        var aHeaders = aData[0].map(function(h) { return String(h || '').trim().toLowerCase(); });
        var emailCol = aHeaders.indexOf('toasttab email');
        var nameCol = aHeaders.indexOf('full name');
        if (emailCol !== -1 && nameCol !== -1) {
          for (var r = 1; r < aData.length; r++) {
            var em = String(aData[r][emailCol] || '').trim().toLowerCase();
            var nm = String(aData[r][nameCol] || '').trim();
            if (em && nm) agentNamesMap[em] = nm;
          }
        }
      }
    } catch(e) {
      console.warn('Could not read Agents sheet: ' + e.message);
    }

    var toUpsert = [];
    for (var i = 1; i < asgData.length; i++) {
      var row = asgData[i];
      var rowQaEmail = String(row[qaIdx] || '').trim().toLowerCase();
      if (rowQaEmail === email) {
        var asgId = String(row[idIdx] || '').trim();
        var rawDate = row[dateIdx];
        var asgDate = '';
        if (rawDate instanceof Date) {
          asgDate = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } else if (rawDate) {
          var dObj = new Date(rawDate);
          if (!isNaN(dObj.getTime())) {
            asgDate = Utilities.formatDate(dObj, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          } else {
            asgDate = String(rawDate).trim();
          }
        }
        var agentEmail = String(row[agentIdx] || '').trim().toLowerCase();
        var rubricId = rubricIdx !== -1 ? String(row[rubricIdx] || '').trim() : '';
        var evalType = typeIdx !== -1 ? String(row[typeIdx] || 'Standard').trim() : 'Standard';
        var status = statusIdx !== -1 ? String(row[statusIdx] || 'Pending').trim() : 'Pending';
        
        var snap = null;
        if (snapIdx !== -1 && row[snapIdx]) {
          try {
            snap = typeof row[snapIdx] === 'object' ? row[snapIdx] : JSON.parse(row[snapIdx]);
          } catch(e) {
            snap = null;
          }
        }

        var agentName = (snap && (snap.displayName || snap.fullName)) || agentNamesMap[agentEmail] || agentEmail;

        if (asgId) {
          toUpsert.push({
            id: asgId,
            date: asgDate,
            qa_email: email,
            agent_email: agentEmail,
            agent_name: agentName,
            rubric_id: rubricId,
            evaluation_type: evalType,
            status: status,
            agent_snapshot: snap,
            updated_at: new Date().toISOString()
          });
        }
      }
    }

    if (toUpsert.length === 0) {
      return { success: true, message: 'No assignments assigned to ' + email, count: 0, assignments: [] };
    }

    // Upsert into Supabase (resolution=merge-duplicates)
    var upsertRes = supabaseRequest('personal_assignments', 'POST', toUpsert, 'resolution=merge-duplicates');
    if (!upsertRes.success) {
      throw new Error(upsertRes.error);
    }

    return {
      success: true,
      message: 'Successfully fetched ' + toUpsert.length + ' assignments from team sheet',
      count: toUpsert.length,
      assignments: toUpsert
    };
  } catch (err) {
    console.error('[fetchTeamAssignments] ' + err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Synchronizes a single evaluation from Supabase into the team's official Evaluations sheet.
 */
function syncEvaluationToTeamSheet(evaluationId) {
  try {
    if (!evaluationId) throw new Error('Missing evaluationId');

    // 1. Fetch evaluation details from Supabase
    var evalRes = supabaseRequest('personal_evaluations?id=eq.' + encodeURIComponent(evaluationId), 'GET');
    if (!evalRes.success || !Array.isArray(evalRes.data) || evalRes.data.length === 0) {
      throw new Error('Evaluation not found in Supabase: ' + evaluationId);
    }
    var ev = evalRes.data[0];

    // 2. Open Team Spreadsheet
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var evalSheet = ss.getSheetByName('Evaluations');
    if (!evalSheet) throw new Error('Evaluations sheet not found in team spreadsheet');

    var evalHeaders = evalSheet.getRange(1, 1, 1, evalSheet.getLastColumn()).getValues()[0].map(function(h) {
      return String(h || '').trim();
    });

    var asgId = String(ev.assignment_id || '');
    var interactionId = String(ev.interaction_id || '');

    // Check if row already exists in sheet
    var evalDataAll = evalSheet.getDataRange().getValues();
    var asgIdColIdx = evalHeaders.indexOf('Assignment ID');
    var intIdColIdx = evalHeaders.indexOf('Interaction ID');
    var idColIdx = evalHeaders.indexOf('ID');

    var existingRow = -1;
    if (evalDataAll.length > 1) {
      for (var r = 1; r < evalDataAll.length; r++) {
        var rowAsgId = asgIdColIdx !== -1 ? String(evalDataAll[r][asgIdColIdx] || '').trim() : '';
        var rowIntId = intIdColIdx !== -1 ? String(evalDataAll[r][intIdColIdx] || '').trim() : '';
        
        if (asgId && rowAsgId === asgId) {
          existingRow = r + 1;
          break;
        }
        if (interactionId && rowIntId === interactionId) {
          existingRow = r + 1;
          break;
        }
      }
    }

    var sheetRowId = existingRow !== -1 
      ? String(evalDataAll[existingRow - 1][idColIdx] || ('EVL-' + Date.now()))
      : ('EVL-' + Date.now() + '-' + Math.floor(Math.random() * 1000));

    var submittedAtUtc = ev.submitted_at || new Date().toISOString();
    var detailsStr = ev.evaluation_details ? (typeof ev.evaluation_details === 'object' ? JSON.stringify(ev.evaluation_details) : String(ev.evaluation_details)) : '{}';
    var snapStr = ev.agent_snapshot ? (typeof ev.agent_snapshot === 'object' ? JSON.stringify(ev.agent_snapshot) : String(ev.agent_snapshot)) : '';

    var newRow = new Array(evalHeaders.length).fill('');
    evalHeaders.forEach(function(h, idx) {
      if (h === 'ID') newRow[idx] = sheetRowId;
      else if (h === 'Submitted At' || h === 'Date') newRow[idx] = submittedAtUtc;
      else if (h === 'Agent Name') newRow[idx] = ev.agent_name || '';
      else if (h === 'QA Name') newRow[idx] = ev.qa_name || '';
      else if (h === 'Score') newRow[idx] = Number(ev.score || 0);
      else if (h === 'Rubric ID') newRow[idx] = ev.rubric_id || '';
      else if (h === 'Evaluation Details') newRow[idx] = detailsStr;
      else if (h === 'Assignment ID') newRow[idx] = asgId;
      else if (h === 'Interaction ID') newRow[idx] = interactionId;
      else if (h === 'Date of Interaction') newRow[idx] = ev.date_of_interaction || '';
      else if (h === 'Call ANI/DNIS') newRow[idx] = ev.call_ani_dnis || '';
      else if (h === 'Case No.') newRow[idx] = ev.case_no || '';
      else if (h === 'Call Duration') newRow[idx] = ev.call_duration || '';
      else if (h === 'Case Category') newRow[idx] = ev.case_category || '';
      else if (h === 'Case Sub-Category') newRow[idx] = ev.case_sub_category || '';
      else if (h === 'Issue/Concern') newRow[idx] = ev.issue_concern || '';
      else if (h === 'Evaluation Type') newRow[idx] = ev.evaluation_type || 'Standard';
      else if (h === 'Agent Snapshot') newRow[idx] = snapStr;
    });

    if (existingRow !== -1) {
      evalSheet.getRange(existingRow, 1, 1, newRow.length).setValues([newRow]);
    } else {
      evalSheet.appendRow(newRow);
    }

    // 3. Update Assignment status in team sheet to 'Completed'
    if (asgId) {
      try {
        var asgSheet = ss.getSheetByName('Assignments');
        if (asgSheet && asgSheet.getLastRow() >= 2) {
          var asgRows = asgSheet.getDataRange().getValues();
          var aHeaders = asgRows[0].map(function(h) { return String(h || '').trim(); });
          var aIdCol = aHeaders.indexOf('ID');
          var aStatusCol = aHeaders.indexOf('Status');
          if (aIdCol !== -1 && aStatusCol !== -1) {
            for (var ar = 1; ar < asgRows.length; ar++) {
              if (String(asgRows[ar][aIdCol] || '').trim() === asgId) {
                asgSheet.getRange(ar + 1, aStatusCol + 1).setValue('Completed');
                break;
              }
            }
          }
        }
      } catch(e) {
        console.warn('Could not update status in team Assignments sheet: ' + e.message);
      }
    }

    // 4. Update Supabase record marking synced_to_sheet = true
    var updatePayload = {
      synced_to_sheet: true,
      synced_at: new Date().toISOString(),
      sheet_row_id: sheetRowId
    };
    supabaseRequest('personal_evaluations?id=eq.' + encodeURIComponent(evaluationId), 'PATCH', updatePayload);

    // Also update assignment status in Supabase
    if (asgId) {
      supabaseRequest('personal_assignments?id=eq.' + encodeURIComponent(asgId), 'PATCH', { status: 'Completed', updated_at: new Date().toISOString() });
    }

    return {
      success: true,
      evaluationId: evaluationId,
      sheetRowId: sheetRowId,
      message: 'Successfully synced to team Google Sheet'
    };
  } catch (err) {
    console.error('[syncEvaluationToTeamSheet] ' + err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Synchronizes all pending (unsynced) evaluations from Supabase into the team sheet.
 */
function syncAllPendingEvaluations(qaEmail) {
  try {
    var email = (qaEmail || Session.getActiveUser().getEmail() || '').trim().toLowerCase();
    if (!email) throw new Error('Missing QA Email');

    // Fetch all evaluations where synced_to_sheet = false
    var res = supabaseRequest('personal_evaluations?qa_email=eq.' + encodeURIComponent(email) + '&synced_to_sheet=eq.false', 'GET');
    if (!res.success || !Array.isArray(res.data)) {
      return { success: true, count: 0, message: 'No unsynced evaluations found' };
    }

    var pending = res.data;
    var syncedCount = 0;
    var errors = [];

    for (var i = 0; i < pending.length; i++) {
      var syncRes = syncEvaluationToTeamSheet(pending[i].id);
      if (syncRes.success) {
        syncedCount++;
      } else {
        errors.push(syncRes.error);
      }
    }

    return {
      success: true,
      syncedCount: syncedCount,
      totalPending: pending.length,
      errors: errors,
      message: 'Synced ' + syncedCount + ' of ' + pending.length + ' evaluations.'
    };
  } catch (err) {
    console.error('[syncAllPendingEvaluations] ' + err.message);
    return { success: false, error: err.message };
  }
}
