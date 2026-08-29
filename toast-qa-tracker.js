(function() {
    if (document.getElementById('qa-modal-overlay')) return;
    console.log("Toast QA Tracker: Initializing...");

    // Default configuration
    var DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbyI2cDSGLZokRPesN_f-LmdSp2YLXzY3aXYpyrq2_Kzh9_vYCQOsyQtw0L-7wwHQ3lFEQ/exec';
    var DEFAULT_API_TOKEN = 'toast_qa_bookmarklet_2026';
    var DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

    // LocalStorage helper
    var storage = {
        get: function(k, def) {
            try { var v = localStorage.getItem('toast_qa_' + k); return v !== null ? v : def; }
            catch(e) { return def; }
        },
        set: function(k, v) {
            try { localStorage.setItem('toast_qa_' + k, v); }
            catch(e) {}
        }
    };

    var API_BASE_URL = storage.get('api_url', DEFAULT_API_URL);
    var API_TOKEN = storage.get('api_token', DEFAULT_API_TOKEN);
    var GEMINI_API_KEY = storage.get('gemini_key', '');
    var GEMINI_MODEL = storage.get('gemini_model', DEFAULT_GEMINI_MODEL);
    var QA_EMAIL = storage.get('qa_email', '');

    var state = {};
    var globalStructure = [];
    var globalFeedbackGeneral = [];
    var globalFeedbackTags = [];
    var globalUsers = [];
    var existingRecordId = null;

    // --- Styles ---
    var sOverlay = "position:fixed;top:0;left:0;right:0;bottom:0;background:transparent;display:flex;align-items:flex-start;justify-content:center;z-index:99999;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding-top:20px;overflow-y:auto;pointer-events:none";
    var sModal = "background:white;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.25);width:90%;max-width:560px;height:82vh;max-height:820px;overflow:hidden;display:flex;flex-direction:column;cursor:grab;user-select:none;margin-bottom:20px;pointer-events:auto;position:relative";
    var sHeader = "padding:14px 20px;border-bottom:1px solid #e2e8f0;background:#ffffff;font-size:17px;font-weight:600;color:#1e293b;cursor:grab;display:flex;justify-content:space-between;align-items:center";
    var sContent = "padding:18px 20px;flex:1;color:#475569;font-size:13px;line-height:1.5;overflow-y:auto";
    var sGroupHeader = "margin:18px 0 10px;font-size:15px;font-weight:700;color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:4px";
    var sItemContainer = "margin-bottom:8px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;background:#ffffff";
    var sItemHeader = "width:100%;padding:10px 14px;background:#f8fafc;border:none;text-align:left;cursor:pointer;font-weight:500;color:#1e293b;display:flex;justify-content:space-between;align-items:center;transition:background 0.2s";
    var sItemBody = "display:none;padding:12px 14px;border-top:1px solid #e2e8f0;background:#ffffff";
    var sBtnGroup = "margin-bottom:8px;display:flex;gap:6px;flex-wrap:wrap";
    var sBtnBase = "flex:1;min-width:60px;padding:7px 10px;border:1px solid;border-radius:5px;cursor:pointer;font-weight:500;font-size:12px;transition:all 0.15s;text-align:center";
    var sSelect = "width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:5px;margin-bottom:8px;font-size:13px;background:white";
    var sTextarea = "width:100%;border:1px solid #cbd5e1;border-radius:5px;padding:8px;font-family:inherit;resize:vertical;height:55px;font-size:13px;box-sizing:border-box";
    var sInput = "width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:5px;font-size:13px;box-sizing:border-box";
    var sLabel = "display:block;margin-bottom:4px;font-weight:600;font-size:12px;color:#334155";
    var sFooter = "padding:14px 20px;border-top:1px solid #e2e8f0;background:#ffffff;display:flex;gap:10px;justify-content:flex-end;align-items:center";
    var sBtnCancel = "padding:8px 16px;border:1px solid #cbd5e1;background:white;border-radius:5px;cursor:pointer;font-size:13px;color:#475569;font-weight:500";
    var sBtnGenerate = "padding:8px 16px;border:none;background:#2563eb;color:white;border-radius:5px;cursor:pointer;font-size:13px;font-weight:600;transition:opacity 0.2s";
    var sTagContainer = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px";
    var sLoading = "position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.85);display:flex;justify-content:center;align-items:center;z-index:10;font-size:14px;color:#475569;font-weight:500;flex-direction:column;gap:10px";

    var createElement = function(tag, css) {
        var el = document.createElement(tag);
        if(css) el.style.cssText = css;
        return el;
    };

    var addListener = function(el, event, handler) {
        el.addEventListener(event, handler);
    };

    var getColors = function(theme) {
        theme = (theme || 'gray').toLowerCase();
        var palettes = {
            green: { bg: "#d1fae5", border: "#10b981", txt: "#064e3b", header: "#ecfdf5" },
            red: { bg: "#fee2e2", border: "#ef4444", txt: "#7f1d1d", header: "#fef2f2" },
            yellow: { bg: "#fef3c7", border: "#f59e0b", txt: "#78350f", header: "#fffbeb" },
            gray: { bg: "#f1f5f9", border: "#94a3b8", txt: "#1e293b", header: "#f8fafc" },
            blue: { bg: "#dbeafe", border: "#3b82f6", txt: "#1e3a8a", header: "#eff6ff" }
        };
        if(theme === 'success') theme = 'green';
        if(theme === 'destructive') theme = 'red';
        if(theme === 'warning') theme = 'yellow';
        if(theme === 'neutral') theme = 'gray';
        return palettes[theme] || palettes.gray;
    };

    var getTheme = function(item, sel) {
        if (!item || !item.options) return 'gray';
        var opt = item.options.find(function(o){ return o.id === sel; });
        if(!opt || !opt.color) return 'gray';
        return opt.color.toLowerCase();
    };

    var showToast = function(msg, isError) {
        isError = isError === true;
        var toast = createElement("div");
        toast.textContent = msg;
        toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:" + (isError ? '#ef4444' : '#10b981') + ";color:white;padding:12px 18px;border-radius:6px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.15);z-index:100005;font-size:13px;font-weight:600;opacity:0;transition:opacity 0.25s ease-in-out;pointer-events:none;";
        document.body.appendChild(toast);
        requestAnimationFrame(function(){ toast.style.opacity = "1"; });
        setTimeout(function(){
            toast.style.opacity = "0";
            setTimeout(function(){ toast.remove(); }, 300);
        }, 3200);
    };

    // --- IndexedDB Hybrid Cache ---
    var idb = {
        dbName: 'Toast_QA_Tracker_Cache',
        dbVersion: 1,
        storeName: 'app_cache',
        open: function() {
            var self = this;
            return new Promise(function(resolve, reject) {
                try {
                    var req = indexedDB.open(self.dbName, self.dbVersion);
                    req.onupgradeneeded = function(e) {
                        var db = e.target.result;
                        if (!db.objectStoreNames.contains(self.storeName)) {
                            db.createObjectStore(self.storeName, { keyPath: 'key' });
                        }
                    };
                    req.onsuccess = function(e) { resolve(e.target.result); };
                    req.onerror = function(e) { reject(e.target.error); };
                } catch(err) { reject(err); }
            });
        },
        get: function(key) {
            var self = this;
            return this.open().then(function(db) {
                return new Promise(function(resolve) {
                    try {
                        var tx = db.transaction(self.storeName, 'readonly');
                        var req = tx.objectStore(self.storeName).get(key);
                        req.onsuccess = function() {
                            resolve(req.result ? req.result.value : null);
                        };
                        req.onerror = function() { resolve(null); };
                    } catch(e) { resolve(null); }
                });
            }).catch(function() { return null; });
        },
        set: function(key, value) {
            var self = this;
            return this.open().then(function(db) {
                return new Promise(function(resolve) {
                    try {
                        var tx = db.transaction(self.storeName, 'readwrite');
                        tx.objectStore(self.storeName).put({ key: key, value: value });
                        tx.oncomplete = function() { resolve(true); };
                        tx.onerror = function() { resolve(false); };
                    } catch(e) { resolve(false); }
                });
            }).catch(function() { return false; });
        }
    };

    // --- Direct Gemini API Client ---
    var callGemini = function(prompt, systemInstruction) {
        if (!GEMINI_API_KEY) {
            showToast("Gemini API Key missing! Set it in ⚙️ Settings", true);
            showSettingsModal();
            return Promise.reject(new Error("Missing Gemini API Key"));
        }

        var url = "https://generativelanguage.googleapis.com/v1beta/models/" + (GEMINI_MODEL || DEFAULT_GEMINI_MODEL) + ":generateContent?key=" + GEMINI_API_KEY;
        var contents = [{ role: "user", parts: [{ text: prompt }] }];
        var payload = { contents: contents };

        if (systemInstruction) {
            payload.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(function(res) {
            if (!res.ok) {
                return res.json().then(function(err) {
                    throw new Error((err.error && err.error.message) || ("Gemini API error (" + res.status + ")"));
                });
            }
            return res.json();
        })
        .then(function(data) {
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                return data.candidates[0].content.parts.map(function(p){ return p.text; }).join("").trim();
            }
            throw new Error("No response from Gemini");
        });
    };

    // --- Stella Connect DOM Extractors ---
    var extractText = function(selector) {
        var el = document.querySelector(selector);
        return el ? el.textContent.trim() : "";
    };

    var extractTranscript = function() {
        var els = document.querySelectorAll('.spec-transcript-content');
        if (els.length > 0) {
            return Array.from(els).map(function(el){ return el.innerText.trim(); }).join("\n");
        }
        // Fallback selectors if Stella changes markup
        var alt = document.querySelector('.transcript-container, [data-testid="transcript"], .conversation-body');
        return alt ? alt.innerText.trim() : "";
    };

    var getInteractionId = function() {
        var h4s = Array.from(document.querySelectorAll('h4'));
        var h4 = h4s.find(function(el){ return el.textContent.trim() === 'Interaction ID'; });
        return h4 && h4.nextElementSibling ? h4.nextElementSibling.textContent.trim() : "";
    };

    var getAdvocateName = function() {
        return extractText('.review-info h2');
    };

    var getAniDnisOptions = function() {
        var h4s = Array.from(document.querySelectorAll('h4'));
        var opts = [];
        var dnisH4 = h4s.find(function(el){ return el.textContent.trim() === 'DNIS'; });
        if(dnisH4 && dnisH4.nextElementSibling) opts.push(dnisH4.nextElementSibling.textContent.trim());
        var aniH4 = h4s.find(function(el){ return el.textContent.trim() === 'ANI'; });
        if(aniH4 && aniH4.nextElementSibling) opts.push(aniH4.nextElementSibling.textContent.trim());
        return opts;
    };

    var getCallDuration = function() {
        var h4s = Array.from(document.querySelectorAll('h4'));
        var h4 = h4s.find(function(el){ return el.textContent.includes('Call Duration'); });
        if(h4 && h4.nextElementSibling) {
            var val = parseFloat(h4.nextElementSibling.textContent.trim());
            return isNaN(val) ? "" : Math.round(val);
        }
        return "";
    };

    // --- UI Construction ---
    var overlay = createElement("div", sOverlay);
    overlay.id = "qa-modal-overlay";
    var modal = createElement("div", sModal);

    var loader = createElement("div", sLoading);
    loader.innerHTML = "<div>Loading Toast QA Tool...</div>";
    loader.style.display = "none";
    modal.appendChild(loader);

    var showLoading = function(msg) {
        if(msg) loader.innerHTML = "<div>" + msg + "</div>";
        loader.style.display = "flex";
    };
    var hideLoading = function() {
        loader.style.display = "none";
    };

    // Header & Dragging
    var isDragging = false, startX = 0, startY = 0, initialX = 0, initialY = 0;
    var header = createElement("div", sHeader);
    var headerTitle = createElement("span");
    headerTitle.innerHTML = "🍞 <strong>Toast QA Tracker</strong>";
    header.appendChild(headerTitle);

    var toolsContainer = createElement("div");
    toolsContainer.style.cssText = "position:relative;display:flex;align-items:center;gap:8px";

    var createMenuItem = function(text, onClick, parentMenu) {
        var item = createElement("div");
        item.textContent = text;
        item.style.cssText = "padding:10px 14px;cursor:pointer;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;transition:background 0.15s";
        addListener(item, "mouseenter", function(){ item.style.background = "#f8fafc"; });
        addListener(item, "mouseleave", function(){ item.style.background = "transparent"; });
        addListener(item, "click", function(e){
            e.stopPropagation();
            if(parentMenu) parentMenu.style.display = "none";
            onClick();
        });
        return item;
    };

    // AI Tools Button (🛠️)
    var btnAiTools = createElement("span");
    btnAiTools.textContent = "🛠️";
    btnAiTools.title = "AI Tools";
    btnAiTools.style.cssText = "cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:background 0.2s";
    addListener(btnAiTools, "mouseenter", function(){ btnAiTools.style.background = "rgba(0,0,0,0.06)"; });
    addListener(btnAiTools, "mouseleave", function(){ btnAiTools.style.background = "transparent"; });

    var aiToolsMenu = createElement("div");
    aiToolsMenu.style.cssText = "position:absolute;top:100%;right:32px;background:white;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:none;flex-direction:column;min-width:180px;z-index:100001;margin-top:6px;overflow:hidden";

    // Settings Button (⚙️)
    var btnTools = createElement("span");
    btnTools.textContent = "⚙️";
    btnTools.title = "Settings";
    btnTools.style.cssText = "cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:background 0.2s";
    addListener(btnTools, "mouseenter", function(){ btnTools.style.background = "rgba(0,0,0,0.06)"; });
    addListener(btnTools, "mouseleave", function(){ btnTools.style.background = "transparent"; });

    var toolsMenu = createElement("div");
    toolsMenu.style.cssText = "position:absolute;top:100%;right:0;background:white;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:none;flex-direction:column;min-width:200px;z-index:100001;margin-top:6px;overflow:hidden";

    addListener(btnAiTools, "click", function(e){
        e.stopPropagation();
        var isVisible = aiToolsMenu.style.display === "flex";
        aiToolsMenu.style.display = isVisible ? "none" : "flex";
        toolsMenu.style.display = "none";
    });

    addListener(btnTools, "click", function(e){
        e.stopPropagation();
        var isVisible = toolsMenu.style.display === "flex";
        toolsMenu.style.display = isVisible ? "none" : "flex";
        aiToolsMenu.style.display = "none";
    });

    addListener(document, "click", function(){
        toolsMenu.style.display = "none";
        aiToolsMenu.style.display = "none";
    });

    toolsContainer.appendChild(btnAiTools);
    toolsContainer.appendChild(aiToolsMenu);
    toolsContainer.appendChild(btnTools);
    toolsContainer.appendChild(toolsMenu);
    header.appendChild(toolsContainer);

    // Modal drag logic
    addListener(header, "mousedown", function(e){
        if(e.target === header || e.target.parentNode === header || e.target === headerTitle || e.target.tagName === 'STRONG') {
            isDragging = true;
            startX = e.clientX - initialX;
            startY = e.clientY - initialY;
            header.style.cursor = "grabbing";
        }
    });
    addListener(document, "mousemove", function(e){
        if(isDragging) {
            initialX = e.clientX - startX;
            initialY = e.clientY - startY;
            modal.style.transform = "translate(" + initialX + "px, " + initialY + "px)";
        }
    });
    addListener(document, "mouseup", function(){
        isDragging = false;
        header.style.cursor = "grab";
    });

    var contentContainer = createElement("div", sContent);

    // --- Header Fields ---
    var headerFieldsContainer = createElement("div");
    headerFieldsContainer.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #e2e8f0";

    var createCompactField = function(placeholder, icon, type, fullWidth, useLabel, initialValue, options) {
        type = type || "text";
        var wrapper = createElement("div");
        if(fullWidth) wrapper.style.gridColumn = "1 / -1";

        if(useLabel) {
            var lbl = createElement("label", sLabel);
            lbl.textContent = placeholder;
            var input = createElement("input", sInput);
            input.type = type;
            if(initialValue) input.value = initialValue;
            wrapper.appendChild(lbl);
            wrapper.appendChild(input);
            return { div: wrapper, input: input };
        } else {
            var container = createElement("div");
            container.style.cssText = "display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:5px;padding:6px 10px;background:white;transition:border-color 0.2s";
            var ico = createElement("span");
            ico.textContent = icon;
            ico.style.cssText = "margin-right:8px;font-size:14px;opacity:0.7;user-select:none;min-width:18px;text-align:center";

            var input;
            if(options && options.length > 0) {
                input = createElement("select");
                input.style.cssText = "width:100%;border:none;outline:none;font-family:inherit;font-size:13px;background:transparent;cursor:pointer";
                options.forEach(function(opt){
                    var o = createElement("option");
                    o.value = opt;
                    o.textContent = opt;
                    input.appendChild(o);
                });
            } else if(type === "textarea") {
                input = createElement("textarea");
                input.style.cssText = "width:100%;border:none;outline:none;font-family:inherit;font-size:13px;resize:vertical;height:60px;padding:0";
                input.placeholder = placeholder;
                container.style.alignItems = "flex-start";
                ico.style.marginTop = "3px";
                if(initialValue) input.value = initialValue;
            } else {
                input = createElement("input");
                input.type = type;
                input.style.cssText = "width:100%;border:none;outline:none;font-family:inherit;font-size:13px;background:transparent";
                input.placeholder = placeholder;
                if(initialValue) input.value = initialValue;
            }

            addListener(input, "focus", function(){ container.style.borderColor = "#2563eb"; });
            addListener(input, "blur", function(){ container.style.borderColor = "#cbd5e1"; });

            container.appendChild(ico);
            container.appendChild(input);
            wrapper.appendChild(container);
            return { div: wrapper, input: input };
        }
    };

    var fInteractionId = createCompactField("Interaction ID", "🆔", "text", false, false, getInteractionId());
    var fAdvocateName = createCompactField("Advocate Name", "👤", "text", false, false, getAdvocateName());

    var aniOpts = getAniDnisOptions();
    var defaultAni = (aniOpts.length > 1) ? aniOpts[1] : (aniOpts[0] || "");
    var fCallAni = createCompactField("Call ANI/DNIS", "📞", "text", false, false, defaultAni, aniOpts);
    if(fCallAni.input.tagName === 'SELECT' && defaultAni) fCallAni.input.value = defaultAni;

    headerFieldsContainer.appendChild(fInteractionId.div);
    headerFieldsContainer.appendChild(fAdvocateName.div);
    headerFieldsContainer.appendChild(fCallAni.div);

    var caseDurationRow = createElement("div", "grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;");
    var fCaseNumber = createCompactField("Case #", "🔢");
    var fCallDuration = createCompactField("Call Duration", "⏱️", "text", false, false, getCallDuration());
    caseDurationRow.appendChild(fCaseNumber.div);
    caseDurationRow.appendChild(fCallDuration.div);
    headerFieldsContainer.appendChild(caseDurationRow);

    var dateRow = createElement("div", "grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;");
    var fDateInteraction = createCompactField("Date of Interaction", "", "date", false, true);
    var fDateEvaluation = createCompactField("Date of Evaluation", "", "date", false, true);
    fDateEvaluation.input.valueAsDate = new Date();
    dateRow.appendChild(fDateInteraction.div);
    dateRow.appendChild(fDateEvaluation.div);
    headerFieldsContainer.appendChild(dateRow);

    var fCaseCategory = createCompactField("Case Category", "🗂️", "text", true);
    addListener(fCaseCategory.input, "keydown", function(e){
        if(e.key === "Enter" && fCaseCategory.input.value.trim() === "") {
            e.preventDefault();
            fCaseCategory.input.value = "Payroll > ";
        }
    });
    headerFieldsContainer.appendChild(fCaseCategory.div);

    var fIssueConcern = createCompactField("Issue/Concern", "✍️", "textarea", true);

    // AI Summary Button (✨)
    var btnSummary = createElement("span");
    btnSummary.textContent = "✨";
    btnSummary.title = "Generate Summary from Transcript using Gemini AI";
    btnSummary.style.cssText = "position:absolute;right:8px;top:8px;cursor:pointer;font-size:16px;opacity:0.7;user-select:none;z-index:5";

    var issueContainer = fIssueConcern.div.firstChild;
    if(issueContainer) {
        issueContainer.style.position = "relative";
        issueContainer.appendChild(btnSummary);
        addListener(btnSummary, "mouseenter", function(){ btnSummary.style.opacity = "1"; });
        addListener(btnSummary, "mouseleave", function(){ btnSummary.style.opacity = "0.7"; });
        addListener(btnSummary, "click", function(e){
            e.stopPropagation();
            var transcript = extractTranscript();
            if(!transcript) return showToast("No transcript found on page.", true);

            var origIcon = btnSummary.textContent;
            btnSummary.textContent = "⏳";
            btnSummary.style.cursor = "wait";

            var prompt = "Summarize the customer's main issue, question, or concern in 1-2 concise sentences based on this interaction transcript:\n\n" + transcript;
            callGemini(prompt, "You are a concise QA evaluator. Output ONLY the summary sentence(s), no extra conversational text.")
                .then(function(summary){
                    fIssueConcern.input.value = summary;
                    fIssueConcern.input.dispatchEvent(new Event('input'));
                    showToast("Summary generated with Gemini!", false);
                })
                .catch(function(err){
                    showToast("Summary failed: " + err.message, true);
                })
                .finally(function(){
                    btnSummary.textContent = origIcon;
                    btnSummary.style.cursor = "pointer";
                });
        });
    }
    headerFieldsContainer.appendChild(fIssueConcern.div);
    contentContainer.appendChild(headerFieldsContainer);

    // --- Feedback Text Updating ---
    var updateText = function(key) {
        var s = state[key];
        if(!s || !s.domTextarea) return;

        var txt = "";
        var cleanText = function(t) {
            return (t || "").replace(/\s*Source:[\s\S]*$/i, "").trim();
        };

        if(s.selectedTags && s.selectedTags.length > 0) {
            txt = s.selectedTags.map(function(t){ return cleanText(t.feedbackText || t.feedback_text); }).join(" ");
        } else {
            var genFeedback = globalFeedbackGeneral.find(function(f){
                return f.optionIndex === s.selIndex || f.option_id === s.sel;
            });
            if (genFeedback) {
                txt = cleanText(genFeedback.feedbackText || genFeedback.feedback_text);
            }
        }

        s.text = txt;
        s.domTextarea.value = txt;
        s.domTextarea.dispatchEvent(new Event('input'));
    };

    var refreshAllUI = function() {
        Object.keys(state).forEach(function(key){
            if(state[key].refreshUI) state[key].refreshUI();
            if(state[key].domTextarea) state[key].domTextarea.value = state[key].text;
        });
    };

    // --- Settings Modal ---
    var showSettingsModal = function() {
        var pOverlay = createElement("div", sOverlay + "; z-index:100002; background:rgba(0,0,0,0.4); pointer-events:auto; align-items:center");
        var pModal = createElement("div", sModal + "; height:auto; max-height:85vh; width:520px; cursor:default; user-select:auto");
        var pHeader = createElement("div", sHeader + "; cursor:move");
        pHeader.innerHTML = "<span>⚙️ Settings & Configuration</span>";
        var pClose = createElement("span", "cursor:pointer;font-size:18px;color:#94a3b8");
        pClose.textContent = "×";
        addListener(pClose, "click", function(){ pOverlay.remove(); });
        pHeader.appendChild(pClose);

        var pBody = createElement("div", "padding:20px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:14px");

        // Apps Script API URL
        var grpApi = createElement("div");
        var lblApi = createElement("label", sLabel);
        lblApi.textContent = "Apps Script API Web App URL";
        var inpApi = createElement("input", sInput);
        inpApi.placeholder = "https://script.google.com/macros/s/.../exec";
        inpApi.value = API_BASE_URL;
        grpApi.appendChild(lblApi);
        grpApi.appendChild(inpApi);
        pBody.appendChild(grpApi);

        // QA User Email
        var grpEmail = createElement("div");
        var lblEmail = createElement("label", sLabel);
        lblEmail.textContent = "Your Toast QA Email";
        var inpEmail = createElement("input", sInput);
        inpEmail.placeholder = "your.name@toasttab.com";
        inpEmail.value = QA_EMAIL;
        grpEmail.appendChild(lblEmail);
        grpEmail.appendChild(inpEmail);
        pBody.appendChild(grpEmail);

        // Gemini API Key
        var grpKey = createElement("div");
        var lblKey = createElement("label", sLabel);
        lblKey.textContent = "Your Gemini API Key (from Google AI Studio)";
        var inpKey = createElement("input", sInput);
        inpKey.type = "password";
        inpKey.placeholder = "AIzaSy...";
        inpKey.value = GEMINI_API_KEY;
        grpKey.appendChild(lblKey);
        grpKey.appendChild(inpKey);
        pBody.appendChild(grpKey);

        // Gemini Model
        var grpModel = createElement("div");
        var lblModel = createElement("label", sLabel);
        lblModel.textContent = "Gemini Model";
        var inpModel = createElement("input", sInput);
        inpModel.value = GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
        grpModel.appendChild(lblModel);
        grpModel.appendChild(inpModel);
        pBody.appendChild(grpModel);

        var pFooter = createElement("div", sFooter);
        var pBtnSave = createElement("button", sBtnGenerate);
        pBtnSave.textContent = "Save Settings";
        addListener(pBtnSave, "click", function(){
            API_BASE_URL = inpApi.value.trim();
            QA_EMAIL = inpEmail.value.trim();
            GEMINI_API_KEY = inpKey.value.trim();
            GEMINI_MODEL = inpModel.value.trim() || DEFAULT_GEMINI_MODEL;

            storage.set('api_url', API_BASE_URL);
            storage.set('qa_email', QA_EMAIL);
            storage.set('gemini_key', GEMINI_API_KEY);
            storage.set('gemini_model', GEMINI_MODEL);

            showToast("Settings saved successfully!", false);
            pOverlay.remove();
            // Re-sync if URL provided
            if (API_BASE_URL) checkAndSyncData(true);
        });
        pFooter.appendChild(pBtnSave);

        pModal.appendChild(pHeader);
        pModal.appendChild(pBody);
        pModal.appendChild(pFooter);
        pOverlay.appendChild(pModal);
        document.body.appendChild(pOverlay);
    };

    toolsMenu.appendChild(createMenuItem("⚙️ Configure API & Gemini Key", showSettingsModal, toolsMenu));
    toolsMenu.appendChild(createMenuItem("🔄 Force Refresh Database", function(){
        checkAndSyncData(true);
    }, toolsMenu));

    // --- Case Notes Checker Modal ---
    var showCaseNotesCheckerModal = function() {
        var pOverlay = createElement("div", sOverlay + "; z-index:100002; background:rgba(0,0,0,0.4); pointer-events:auto; align-items:center");
        var pModal = createElement("div", sModal + "; height:85vh; max-height:850px; width:640px; cursor:default; user-select:auto");
        var pHeader = createElement("div", sHeader + "; cursor:move");
        pHeader.innerHTML = "<span>📋 Case Notes Checker</span>";
        var pClose = createElement("span", "cursor:pointer;font-size:18px;color:#94a3b8");
        pClose.textContent = "×";
        addListener(pClose, "click", function(){ pOverlay.remove(); });
        pHeader.appendChild(pClose);

        var pBody = createElement("div", "padding:18px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;user-select:text");

        var grpSubject = createElement("div");
        grpSubject.appendChild(createElement("label", sLabel)).textContent = "Subject Line";
        var inpSubject = createElement("input", sInput);
        inpSubject.placeholder = "Enter Subject Line...";
        grpSubject.appendChild(inpSubject);
        pBody.appendChild(grpSubject);

        var grpNotes = createElement("div");
        grpNotes.appendChild(createElement("label", sLabel)).textContent = "Case Notes";
        var txtNotes = createElement("textarea", sTextarea + "; height:140px");
        txtNotes.placeholder = "Paste Case Notes here...";
        grpNotes.appendChild(txtNotes);
        pBody.appendChild(grpNotes);

        var resBox = createElement("div", "padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;line-height:1.6;white-space:pre-wrap;min-height:100px;user-select:text");
        resBox.textContent = "Analysis results will appear here...";
        pBody.appendChild(resBox);

        var pFooter = createElement("div", sFooter);
        var pBtnGen = createElement("button", sBtnGenerate);
        pBtnGen.textContent = "Analyze with Gemini";

        addListener(pBtnGen, "click", function(){
            var transcript = extractTranscript();
            var subject = inpSubject.value.trim();
            var notes = txtNotes.value.trim();

            if (!transcript) return showToast("No transcript found on page", true);
            if (!subject) return showToast("Subject Line is required", true);
            if (!notes) return showToast("Case Notes are required", true);

            pBtnGen.disabled = true;
            pBtnGen.textContent = "Analyzing... ⏳";
            resBox.textContent = "🚀 AI is analyzing case notes against transcript...";

            var prompt = "You are an expert QA Evaluator analyzing customer service case notes against the actual interaction transcript.\n\n" +
                         "TRANSCRIPT:\n" + transcript + "\n\n" +
                         "SUBJECT LINE:\n" + subject + "\n\n" +
                         "CASE NOTES:\n" + notes + "\n\n" +
                         "Please evaluate:\n" +
                         "1. Accuracy of notes compared to what was discussed.\n" +
                         "2. Missing critical details (actions taken, troubleshooting steps, customer issue).\n" +
                         "3. Proper formatting, professionalism, and clarity.\n" +
                         "4. Provide a 1-sentence SUMMARY of the issue.\n\n" +
                         "Format your output clearly with headings.";

            callGemini(prompt, "You are an objective QA evaluator. Provide actionable, professional feedback.")
                .then(function(result){
                    resBox.textContent = result;
                    showToast("Analysis complete!", false);

                    // Auto-fill Issue/Concern if SUMMARY found
                    var match = result.match(/SUMMARY:?\s*([\s\S]*?)(?:\n\n|$)/i);
                    if (match && match[1] && fIssueConcern.input) {
                        fIssueConcern.input.value = match[1].trim();
                        fIssueConcern.input.dispatchEvent(new Event('input'));
                    }
                })
                .catch(function(err){
                    resBox.textContent = "❌ Error: " + err.message;
                    showToast(err.message, true);
                })
                .finally(function(){
                    pBtnGen.disabled = false;
                    pBtnGen.textContent = "Analyze with Gemini";
                });
        });

        pFooter.appendChild(pBtnGen);
        pModal.appendChild(pHeader);
        pModal.appendChild(pBody);
        pModal.appendChild(pFooter);
        pOverlay.appendChild(pModal);
        document.body.appendChild(pOverlay);
    };

    // --- Chat Checker Modal ---
    var showChatCheckerModal = function() {
        var pOverlay = createElement("div", sOverlay + "; z-index:100002; background:rgba(0,0,0,0.4); pointer-events:auto; align-items:center");
        var pModal = createElement("div", sModal + "; height:85vh; max-height:850px; width:640px; cursor:default; user-select:auto");
        var pHeader = createElement("div", sHeader + "; cursor:move");
        pHeader.innerHTML = "<span>💬 Chat Checker</span>";
        var pClose = createElement("span", "cursor:pointer;font-size:18px;color:#94a3b8");
        pClose.textContent = "×";
        addListener(pClose, "click", function(){ pOverlay.remove(); });
        pHeader.appendChild(pClose);

        var pBody = createElement("div", "padding:18px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;user-select:text");

        var grpTranscript = createElement("div");
        grpTranscript.appendChild(createElement("label", sLabel)).textContent = "Chat Transcript (Pasted or Uploaded .txt)";
        var txtTranscript = createElement("textarea", sTextarea + "; height:120px");
        txtTranscript.placeholder = "Paste chat transcript text here...";
        var inpFile = createElement("input");
        inpFile.type = "file";
        inpFile.accept = ".txt";
        inpFile.style.cssText = "margin-top:4px;font-size:12px";
        addListener(inpFile, "change", function(e){
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(ev) { txtTranscript.value = ev.target.result; showToast("File loaded!", false); };
                reader.readAsText(file);
            }
        });
        grpTranscript.appendChild(txtTranscript);
        grpTranscript.appendChild(inpFile);
        pBody.appendChild(grpTranscript);

        var grpSubject = createElement("div");
        grpSubject.appendChild(createElement("label", sLabel)).textContent = "Subject Line";
        var inpSubject = createElement("input", sInput);
        inpSubject.placeholder = "Enter Subject Line...";
        grpSubject.appendChild(inpSubject);
        pBody.appendChild(grpSubject);

        var grpNotes = createElement("div");
        grpNotes.appendChild(createElement("label", sLabel)).textContent = "Case Notes";
        var txtNotes = createElement("textarea", sTextarea + "; height:120px");
        txtNotes.placeholder = "Paste Case Notes here...";
        grpNotes.appendChild(txtNotes);
        pBody.appendChild(grpNotes);

        var resBox = createElement("div", "padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;line-height:1.6;white-space:pre-wrap;min-height:100px;user-select:text");
        resBox.textContent = "Chat analysis results will appear here...";
        pBody.appendChild(resBox);

        var pFooter = createElement("div", sFooter);
        var pBtnGen = createElement("button", sBtnGenerate);
        pBtnGen.textContent = "Analyze Chat with Gemini";

        addListener(pBtnGen, "click", function(){
            var ts = txtTranscript.value.trim() || extractTranscript();
            var subject = inpSubject.value.trim();
            var notes = txtNotes.value.trim();

            if (!ts) return showToast("Transcript is required", true);
            if (!subject) return showToast("Subject is required", true);
            if (!notes) return showToast("Notes are required", true);

            pBtnGen.disabled = true;
            pBtnGen.textContent = "Analyzing... ⏳";
            resBox.textContent = "🚀 AI is analyzing chat transcript and notes...";

            var prompt = "Analyze this Chat support interaction against case notes:\n\n" +
                         "CHAT TRANSCRIPT:\n" + ts + "\n\n" +
                         "SUBJECT:\n" + subject + "\n\n" +
                         "CASE NOTES:\n" + notes + "\n\n" +
                         "Provide concise evaluation on:\n" +
                         "1. Customer issue resolution\n" +
                         "2. Advocate tone, responsiveness, and accuracy\n" +
                         "3. Completeness of documentation\n" +
                         "4. SUMMARY of the issue (1 sentence).";

            callGemini(prompt, "You are a professional QA evaluator.")
                .then(function(res){
                    resBox.textContent = res;
                    showToast("Chat analysis complete!", false);
                })
                .catch(function(err){
                    resBox.textContent = "❌ Error: " + err.message;
                    showToast(err.message, true);
                })
                .finally(function(){
                    pBtnGen.disabled = false;
                    pBtnGen.textContent = "Analyze Chat with Gemini";
                });
        });

        pFooter.appendChild(pBtnGen);
        pModal.appendChild(pHeader);
        pModal.appendChild(pBody);
        pModal.appendChild(pFooter);
        pOverlay.appendChild(pModal);
        document.body.appendChild(pOverlay);
    };

    aiToolsMenu.appendChild(createMenuItem("📋 Case Notes Checker", showCaseNotesCheckerModal, aiToolsMenu));
    aiToolsMenu.appendChild(createMenuItem("💬 Chat Checker", showChatCheckerModal, aiToolsMenu));

    // --- Save to Google Sheets API ---
    var saveRecord = function() {
        if (!API_BASE_URL) {
            showToast("API URL not configured! Open ⚙️ Settings", true);
            showSettingsModal();
            return Promise.reject(new Error("API URL not configured"));
        }

        var items = Object.keys(state).map(function(key){
            var s = state[key];
            var selectedOption = s.options.find(function(o){ return o.id === s.sel; });
            return {
                itemId: s.id,
                answerId: s.sel,
                answerText: selectedOption ? selectedOption.label : (s.sel ? 'Yes' : 'No'),
                feedbackText: s.text,
                selectedTags: (s.selectedTags || []).map(function(t){ return t.tagLabel || t.tag_label || t.buttonLabel; })
            };
        });

        // Compute total score based on rubric point values
        var totalPoints = 0;
        var earnedPoints = 0;
        Object.keys(state).forEach(function(key){
            var s = state[key];
            var opt = s.options.find(function(o){ return o.id === s.sel; });
            if (opt) {
                var pts = Number(opt.points || 0);
                earnedPoints += pts;
            }
        });

        var payload = {
            action: 'submit_evaluation',
            token: API_TOKEN,
            qaEmail: QA_EMAIL,
            evaluationData: {
                interactionId: fInteractionId.input.value.trim(),
                agentName: fAdvocateName.input.value.trim(),
                qaName: QA_EMAIL,
                callAniDnis: fCallAni.input.value.trim(),
                caseNo: fCaseNumber.input.value.trim(),
                callDuration: fCallDuration.input.value.trim(),
                dateOfInteraction: fDateInteraction.input.value,
                evaluationDate: fDateEvaluation.input.value,
                caseCategory: fCaseCategory.input.value.trim(),
                issueConcern: fIssueConcern.input.value.trim(),
                rubricId: (globalStructure && globalStructure.id) || '',
                score: earnedPoints,
                details: items,
                pageUrl: window.location.href
            }
        };

        // Note: We use Content-Type: text/plain to avoid CORS preflight blocking in Apps Script
        return fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        })
        .then(function(res){ return res.json(); })
        .then(function(data){
            if(data.success) {
                existingRecordId = data.evaluationId || data.submission_id;
                return true;
            }
            throw new Error(data.message || data.error || "Save failed");
        });
    };

    // Check for previous evaluation by Interaction ID
    var checkExistingRecord = function() {
        var iId = fInteractionId.input.value.trim();
        if(!iId || !API_BASE_URL) return;

        var url = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                  'api=1&action=check_existing&token=' + encodeURIComponent(API_TOKEN) +
                  '&interaction_id=' + encodeURIComponent(iId);

        fetch(url)
            .then(function(res){ return res.json(); })
            .then(function(result){
                if(result.success && result.data) {
                    var record = result.data;
                    existingRecordId = record.id;
                    if(record.agentName) fAdvocateName.input.value = record.agentName;
                    if(record.callAniDnis) fCallAni.input.value = record.callAniDnis;
                    if(record.caseNo) fCaseNumber.input.value = record.caseNo;
                    if(record.callDuration) fCallDuration.input.value = record.callDuration;
                    if(record.dateOfInteraction) fDateInteraction.input.value = record.dateOfInteraction.split('T')[0];
                    if(record.caseCategory) fCaseCategory.input.value = record.caseCategory;
                    if(record.issueConcern) fIssueConcern.input.value = record.issueConcern;

                    if (record.evaluationDetails) {
                        try {
                            var details = typeof record.evaluationDetails === 'string' ? JSON.parse(record.evaluationDetails) : record.evaluationDetails;
                            if (Array.isArray(details)) {
                                details.forEach(function(rItem){
                                    var key = Object.keys(state).find(function(k){ return state[k].id === rItem.itemId; });
                                    if(key && state[key]) {
                                        state[key].sel = rItem.answerId;
                                        state[key].text = rItem.feedbackText || "";
                                    }
                                });
                                refreshAllUI();
                            }
                        } catch(e) {}
                    }
                    showToast("Previous evaluation loaded from Sheets!", false);
                }
            })
            .catch(function(){});
    };

    addListener(fInteractionId.input, 'blur', checkExistingRecord);

    // --- DOM Interaction & Generation ---
    var findGroupContainer = function(name) {
        var h2s = Array.from(document.querySelectorAll('h2'));
        var h2 = h2s.find(function(el){ return el.textContent.trim().includes(name); });
        return h2 ? h2.closest('.padding-xlarge') : null;
    };

    var handleGeneration = function(saveToDb) {
        var activeBtn = saveToDb ? btnGenerate : btnGenerateOnly;
        var originalText = activeBtn.textContent;
        activeBtn.textContent = "Generating... ⏳";

        [btnGenerate, btnGenerateOnly, btnSaveOnly, btnCancel, btnGenToggle].forEach(function(b){
            b.disabled = true;
            b.style.opacity = "0.7";
            b.style.cursor = "not-allowed";
        });

        var allKeys = Object.keys(state);
        var checkedKeys = allKeys.filter(function(k){ return state[k].checked; });
        var targetKeys = checkedKeys.length > 0 ? checkedKeys : allKeys;

        var index = 0;
        var processNext = function() {
            if(index >= targetKeys.length) {
                if(saveToDb) {
                    saveRecord().then(function(){
                        activeBtn.textContent = originalText;
                        [btnGenerate, btnGenerateOnly, btnSaveOnly, btnCancel, btnGenToggle].forEach(function(b){
                            b.disabled = false;
                            b.style.opacity = "1";
                            b.style.cursor = "pointer";
                        });
                        showToast("Generated and Saved to Google Sheets!", false);
                        setTimeout(function(){ overlay.remove(); }, 1500);
                    }).catch(function(e){
                        showToast("Generated, but save failed: " + e.message, true);
                        activeBtn.textContent = originalText;
                        [btnGenerate, btnGenerateOnly, btnSaveOnly, btnCancel, btnGenToggle].forEach(function(b){
                            b.disabled = false;
                            b.style.opacity = "1";
                            b.style.cursor = "pointer";
                        });
                    });
                } else {
                    activeBtn.textContent = originalText;
                    [btnGenerate, btnGenerateOnly, btnSaveOnly, btnCancel, btnGenToggle].forEach(function(b){
                        b.disabled = false;
                        b.style.opacity = "1";
                        b.style.cursor = "pointer";
                    });
                    showToast("Generated successfully in Stella Connect!", false);
                    genMenu.style.display = "none";
                }
                return;
            }

            var key = targetKeys[index];
            var s = state[key];
            var container = findGroupContainer(s.groupName);

            if(container) {
                var question = container.querySelector('[data-idx="' + s.itemId + '"]');
                if(question) {
                    var control = question.querySelector('[data-testid="SegmentedControl"]');
                    if(control) {
                        var buttons = Array.from(control.querySelectorAll('button'));
                        if(buttons[s.selIndex]) buttons[s.selIndex].click();
                    }

                    setTimeout(function(){
                        container = findGroupContainer(s.groupName);
                        var freshQuestion = container ? container.querySelector('[data-idx="' + s.itemId + '"]') : null;
                        if(freshQuestion) {
                            var finalText = (s.text || "").trim();
                            if(finalText) {
                                var txtArea = freshQuestion.querySelector('textarea');
                                if(txtArea) {
                                    var proto = Object.getPrototypeOf(txtArea);
                                    var setter = Object.getOwnPropertyDescriptor(proto, "value").set;
                                    if(setter) setter.call(txtArea, finalText);
                                    else txtArea.value = finalText;
                                    txtArea.dispatchEvent(new Event("input", { bubbles: true }));
                                    txtArea.dispatchEvent(new Event("change", { bubbles: true }));
                                }
                            }
                        }
                        setTimeout(function(){
                            index++;
                            processNext();
                        }, 450);
                    }, 1200);
                    return;
                }
            }
            index++;
            processNext();
        };
        processNext();
    };

    // --- Footer Controls ---
    var footer = createElement("div", sFooter);
    var btnCancel = createElement("button", sBtnCancel);
    btnCancel.textContent = "Cancel";
    addListener(btnCancel, "click", function(){ overlay.remove(); });

    var btnSaveOnly = createElement("button", sBtnGenerate);
    btnSaveOnly.textContent = "Save to Sheets";
    btnSaveOnly.style.backgroundColor = "#059669";
    addListener(btnSaveOnly, "click", function(){
        btnSaveOnly.disabled = true;
        btnSaveOnly.textContent = "Saving...";
        saveRecord().then(function(){
            showToast("Saved Successfully to Sheets!", false);
        }).catch(function(e){
            showToast(e.message, true);
        }).finally(function(){
            btnSaveOnly.disabled = false;
            btnSaveOnly.textContent = "Save to Sheets";
        });
    });

    var genDropdownContainer = createElement("div", "position:relative;display:flex;align-items:stretch");
    var btnGenerate = createElement("button", sBtnGenerate);
    btnGenerate.textContent = "Generate & Save";
    btnGenerate.style.borderRadius = "5px 0 0 5px";
    btnGenerate.style.margin = "0";

    var btnGenToggle = createElement("button", sBtnGenerate);
    btnGenToggle.innerHTML = "&#9662;";
    btnGenToggle.style.padding = "8px 10px";
    btnGenToggle.style.borderRadius = "0 5px 5px 0";
    btnGenToggle.style.borderLeft = "1px solid rgba(255,255,255,0.2)";
    btnGenToggle.style.margin = "0";

    var genMenu = createElement("div");
    genMenu.style.cssText = "position:absolute;bottom:100%;right:0;background:white;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 -4px 14px rgba(0,0,0,0.12);display:none;flex-direction:column;min-width:160px;z-index:100001;margin-bottom:6px;overflow:hidden";

    var btnGenerateOnly = createElement("button");
    btnGenerateOnly.textContent = "Generate (DOM only)";
    btnGenerateOnly.style.cssText = "width:100%;text-align:left;padding:10px 14px;border:none;background:white;cursor:pointer;font-size:13px;color:#334155;transition:background 0.15s;font-family:inherit;font-weight:500";
    addListener(btnGenerateOnly, "mouseenter", function(){ btnGenerateOnly.style.background = "#f8fafc"; });
    addListener(btnGenerateOnly, "mouseleave", function(){ btnGenerateOnly.style.background = "white"; });

    genMenu.appendChild(btnGenerateOnly);
    genDropdownContainer.appendChild(btnGenerate);
    genDropdownContainer.appendChild(btnGenToggle);
    genDropdownContainer.appendChild(genMenu);

    addListener(btnGenToggle, "click", function(e){
        e.stopPropagation();
        var isVisible = genMenu.style.display === "flex";
        genMenu.style.display = isVisible ? "none" : "flex";
    });
    addListener(document, "click", function(){ genMenu.style.display = "none"; });

    addListener(btnGenerate, "click", function(){ handleGeneration(true); });
    addListener(btnGenerateOnly, "click", function(){ handleGeneration(false); });

    footer.appendChild(btnCancel);
    footer.appendChild(btnSaveOnly);
    footer.appendChild(genDropdownContainer);

    modal.appendChild(header);
    modal.appendChild(contentContainer);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // --- Form Rendering ---
    var renderRubric = function(rubricData, feedbackChips, feedbackGeneral) {
        contentContainer.querySelectorAll('.rubric-section').forEach(function(el){ el.remove(); });
        state = {};

        var sections = [];
        try {
            sections = (typeof rubricData.structure === 'string') ? JSON.parse(rubricData.structure) : (rubricData.structure || []);
        } catch(e) {
            sections = [];
        }

        globalFeedbackTags = feedbackChips || [];
        globalFeedbackGeneral = feedbackGeneral || [];

        sections.forEach(function(section, secIdx){
            var groupTitle = createElement("div", sGroupHeader + ";rubric-section");
            groupTitle.className = "rubric-section";
            groupTitle.textContent = section.title || section.name || ("Section " + (secIdx + 1));
            contentContainer.appendChild(groupTitle);

            var items = section.items || [];
            items.forEach(function(item, itemIdx){
                var key = secIdx + ":" + itemIdx;
                var itemContainer = createElement("div", sItemContainer);
                itemContainer.className = "rubric-section";
                var itemHeader = createElement("div", sItemHeader);
                var leftGroup = createElement("div", "display:flex;align-items:center;gap:10px");

                var checkbox = createElement("input");
                checkbox.type = "checkbox";
                checkbox.style.cursor = "pointer";
                addListener(checkbox, "click", function(e){
                    e.stopPropagation();
                    state[key].checked = e.target.checked;
                });

                var label = createElement("span");
                var cleanText = (item.shortName || item.short_name || item.text || item.question || ("Item " + (itemIdx + 1))).replace(/^\d+\.\s*/, "");
                label.textContent = (itemIdx + 1) + ". " + cleanText;
                leftGroup.appendChild(checkbox);
                leftGroup.appendChild(label);

                var arrow = createElement("span", "font-size:10px;color:#94a3b8");
                arrow.textContent = "▼";
                itemHeader.appendChild(leftGroup);
                itemHeader.appendChild(arrow);

                var itemBody = createElement("div", sItemBody);
                var tagContainer = createElement("div", sTagContainer);

                var rawOptions = item.options || [
                    { id: 'yes', label: 'Yes', points: 10, color: 'green' },
                    { id: 'no', label: 'No', points: 0, color: 'red' }
                ];
                var options = rawOptions.map(function(opt, idx){
                    return {
                        id: opt.id || String(idx),
                        label: opt.label || opt.text || 'Option',
                        points: opt.points !== undefined ? opt.points : 0,
                        color: opt.color || (idx === 0 ? 'green' : 'red')
                    };
                });

                state[key] = {
                    id: item.id || (secIdx + "_" + itemIdx),
                    sel: options[0].id,
                    selIndex: 0,
                    text: "",
                    checked: false,
                    groupName: section.title || section.name,
                    itemId: itemIdx + 1,
                    options: options,
                    selectedTags: [],
                    domTextarea: null,
                    refreshUI: null
                };

                var updateHeaderBg = function() {
                    var theme = getTheme({ options: options }, state[key].sel);
                    var cols = getColors(theme);
                    itemHeader.style.background = cols.header;
                };

                var renderTags = function() {
                    tagContainer.innerHTML = "";
                    var currentOptIdx = state[key].selIndex;
                    var relevantTags = globalFeedbackTags.filter(function(t){
                        return (t.sectionIndex === secIdx || t.section_index === secIdx) &&
                               (t.itemIndex === itemIdx || t.item_index === itemIdx) &&
                               (t.optionIndex === currentOptIdx || t.option_index === currentOptIdx);
                    });

                    relevantTags.forEach(function(tagData){
                        var tagBtn = createElement("div");
                        var labelText = tagData.buttonLabel || tagData.button_label || tagData.tag_label || "Feedback";
                        var isActive = state[key].selectedTags.some(function(t){
                            return (t.id && t.id === tagData.id) || (t.buttonLabel === labelText);
                        });

                        var theme = getTheme({ options: options }, state[key].sel);
                        var cols = getColors(theme);

                        if(isActive) {
                            tagBtn.style.cssText = "padding:4px 9px;border:1px solid " + cols.border + ";border-radius:12px;font-size:11px;cursor:pointer;background:" + cols.bg + ";color:" + cols.txt + ";font-weight:600;transition:all 0.15s";
                        } else {
                            tagBtn.style.cssText = "padding:4px 9px;border:1px solid #cbd5e1;border-radius:12px;font-size:11px;cursor:pointer;background:#f8fafc;color:#334155;transition:all 0.15s";
                        }
                        tagBtn.textContent = labelText;

                        addListener(tagBtn, "click", function(){
                            if(isActive) {
                                state[key].selectedTags = state[key].selectedTags.filter(function(t){
                                    return (t.id && t.id !== tagData.id) && (t.buttonLabel !== labelText);
                                });
                            } else {
                                state[key].selectedTags.push(tagData);
                            }
                            renderTags();
                            updateHeaderBg();
                            updateText(key);
                        });
                        tagContainer.appendChild(tagBtn);
                    });
                };

                // Button options group
                var btnGroup = createElement("div", sBtnGroup);
                var optionButtons = [];

                options.forEach(function(opt, optIdx){
                    var btn = createElement("button");
                    btn.textContent = opt.label;
                    btn.style.cssText = sBtnBase;

                    addListener(btn, "click", function(){
                        state[key].sel = opt.id;
                        state[key].selIndex = optIdx;
                        state[key].selectedTags = [];
                        updateBtnStyles();
                        renderTags();
                        updateHeaderBg();
                        updateText(key);
                    });

                    btnGroup.appendChild(btn);
                    optionButtons.push({ dom: btn, id: opt.id, idx: optIdx });
                });

                var updateBtnStyles = function() {
                    var val = state[key].sel;
                    var theme = getTheme({ options: options }, val);
                    var cols = getColors(theme);
                    var activeStyle = sBtnBase + ";background:" + cols.bg + ";color:" + cols.txt + ";border-color:" + cols.border;
                    var inactiveStyle = sBtnBase + ";background:white;color:#475569;border-color:#cbd5e1";

                    optionButtons.forEach(function(b){
                        b.dom.style.cssText = (b.id === val) ? activeStyle : inactiveStyle;
                    });
                };

                state[key].refreshUI = function() {
                    updateBtnStyles();
                    checkbox.checked = state[key].checked;
                    renderTags();
                    updateHeaderBg();
                };

                updateBtnStyles();
                itemBody.appendChild(btnGroup);
                itemBody.appendChild(tagContainer);

                var textarea = createElement("textarea", sTextarea);
                state[key].domTextarea = textarea;
                textarea.placeholder = "Comments...";
                addListener(textarea, "input", function(e){
                    state[key].text = e.target.value;
                    updateHeaderBg();
                });
                itemBody.appendChild(textarea);

                addListener(itemHeader, "click", function(){
                    var isExpanded = itemBody.style.display === "block";
                    itemBody.style.display = isExpanded ? "none" : "block";
                    arrow.textContent = isExpanded ? "▼" : "▲";
                    updateHeaderBg();
                    if(!isExpanded) renderTags();
                });

                itemContainer.appendChild(itemHeader);
                itemContainer.appendChild(itemBody);
                contentContainer.appendChild(itemContainer);

                updateHeaderBg();
                updateText(key);
            });
        });

        // After render, check if interaction already exists
        if(fInteractionId.input.value) checkExistingRecord();
    };

    // --- Sync & Initialization Logic ---
    var checkAndSyncData = function(forceRefresh) {
        showLoading("Syncing with Google Sheets...");

        // 1. Try to load from IndexedDB cache first for instant display
        idb.get('cached_payload').then(function(cached){
            if (cached && !forceRefresh) {
                globalStructure = cached.rubrics[0] || {};
                renderRubric(globalStructure, cached.feedbackChips, cached.feedbackGeneral);
                hideLoading();
            }

            // 2. If API URL not set, prompt user
            if (!API_BASE_URL) {
                hideLoading();
                showToast("Welcome! Please enter your Google Apps Script API URL in ⚙️ Settings", false);
                showSettingsModal();
                return;
            }

            // 3. Check timestamps on server
            var syncUrl = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                          'api=1&action=check_sync&token=' + encodeURIComponent(API_TOKEN);

            fetch(syncUrl)
                .then(function(res){ return res.json(); })
                .then(function(syncData){
                    if(!syncData.success) throw new Error(syncData.error || "Sync check failed");

                    var lastTs = storage.get('last_sync_ts', '');
                    var currentTs = syncData.rubricsTimestamp + "_" + syncData.feedbackTimestamp;

                    // If timestamps match and we have cache, no need to fetch full payload!
                    if (!forceRefresh && cached && lastTs === currentTs) {
                        console.log("Toast QA Tool: Cache is up to date (0 sheet reads!).");
                        return;
                    }

                    // Otherwise, fetch fresh payload
                    showLoading("Updating rubrics & templates...");
                    var initUrl = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                                  'api=1&action=get_init_data&token=' + encodeURIComponent(API_TOKEN) +
                                  '&qa_email=' + encodeURIComponent(QA_EMAIL);

                    fetch(initUrl)
                        .then(function(res){ return res.json(); })
                        .then(function(data){
                            if(!data.success) throw new Error(data.error || "Failed to fetch data");

                            // Cache in IndexedDB
                            idb.set('cached_payload', data);
                            storage.set('last_sync_ts', currentTs);

                            globalStructure = data.rubrics[0] || {};
                            renderRubric(globalStructure, data.feedbackChips, data.feedbackGeneral);
                            showToast("Updated with latest Google Sheets data!", false);
                        })
                        .catch(function(err){
                            console.error(err);
                            showToast("Could not fetch latest sheets data: " + err.message, true);
                        })
                        .finally(function(){ hideLoading(); });
                })
                .catch(function(err){
                    console.error(err);
                    hideLoading();
                    if (!cached) showToast("Error connecting to Apps Script API: " + err.message, true);
                });
        });
    };

    checkAndSyncData(false);
})();