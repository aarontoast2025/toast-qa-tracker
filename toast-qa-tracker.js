(function() {
    if (document.getElementById('qa-modal-overlay')) return;
    console.log("Toast QA Tracker: Initializing...");

    // Default configuration
    var DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbyI2cDSGLZokRPesN_f-LmdSp2YLXzY3aXYpyrq2_Kzh9_vYCQOsyQtw0L-7wwHQ3lFEQ/exec';
    var DEFAULT_API_TOKEN = 'toast_qa_bookmarklet_2026';
    var DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

    var DEFAULT_FALLBACK_RUBRIC = {
        id: 'toast-standard-qa',
        name: 'Toast QA Standard Rubric',
        structure: "[{\"name\":\"Knowledgeable & effective problem-solving\",\"items\":[{\"question\":\"Investigation ownership & Resource optimization\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard excelled\",\"points\":12,\"isCorrect\":true,\"isDefault\":false},{\"label\":\"Quality standard met\",\"points\":8,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Customer training opportunity taken\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":4,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":4,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Confirmed resolution & next steps\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":8,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":10,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Escalation/transfer due diligence\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard excelled\",\"points\":12,\"isCorrect\":true,\"isDefault\":false},{\"label\":\"Quality standard met\",\"points\":8,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Internal case notes\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":5,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":5,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Major Process Failure: Interaction documentation\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Case data management\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":3,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":3,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Major Process Failure: Survey avoidance/ manipulation\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]}]},{\"name\":\"Empathy & rapport\",\"items\":[{\"question\":\"Major Process: De-escalation\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Customer Sentiment Acknowledgement\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":8,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":8,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Effective listening & information acknowledgement\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":7,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":7,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Internal collaboration\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard excelled\",\"points\":4,\"isCorrect\":true,\"isDefault\":false},{\"label\":\"Quality standard met\",\"points\":3,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":3,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Tone of response\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard excelled\",\"points\":7,\"isCorrect\":true,\"isDefault\":false},{\"label\":\"Quality standard met\",\"points\":6,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":6,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Intentional Customer Mistreat\",\"uiType\":\"dropdown\",\"options\":[{\"label\":\"Rude or unprofessional behavior\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Hanging up on a customer or manually closing a chat\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Repeated toggling of ready state to place self in the back of the call queue\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Excessive long silence or hold times without acknowledging the customer that result in the customer disconnecting the interaction\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Conducting personal business while on a call with a customer (i.e. having personal conversations)\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Denied tranfers\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true}]}]},{\"name\":\"Responsive & consistent interactions\",\"items\":[{\"question\":\"Interaction customer communication\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":7,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":7,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Major Process Failure: Excessive response time (over 8 minutes)\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Case customer communication\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":7,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":7,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Major Process Failure: Waiting on agent action\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":25,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Negligent Customer Mistreat\",\"uiType\":\"dropdown\",\"options\":[{\"label\":\"Poor case management/hygiene\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Case closed before resolution reached\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Call drops and agent does not call the customer back\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Failure to appropriately document customer interaction\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Failing to probe the customer's need and unnecessary transferring of the call\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"Not adhering to required customer authentication procedures or other essential security processes\",\"points\":100,\"isCorrect\":false,\"isDefault\":false},{\"label\":\"N/A\",\"points\":0,\"isCorrect\":true,\"isDefault\":true}]}]},{\"name\":\"Personalization\",\"items\":[{\"question\":\"Customer background information\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":4,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":4,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Contact preferences\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":5,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":5,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Account & previous case review\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":5,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":5,\"isCorrect\":false,\"isDefault\":false}]},{\"question\":\"Toast greeting & closing\",\"uiType\":\"buttons\",\"options\":[{\"label\":\"Quality standard met\",\"points\":2,\"isCorrect\":true,\"isDefault\":true},{\"label\":\"Quality standard missed\",\"points\":2,\"isCorrect\":false,\"isDefault\":false}]}]}]"
    };

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

    var API_BASE_URL = DEFAULT_API_URL;
    var API_TOKEN = storage.get('api_token', DEFAULT_API_TOKEN);
    var GEMINI_API_KEY = storage.get('gemini_key', '');
    var GEMINI_MODEL = storage.get('gemini_model', DEFAULT_GEMINI_MODEL);
    var QA_EMAIL = storage.get('qa_email', '');

    var state = {};
    var allRubrics = [DEFAULT_FALLBACK_RUBRIC];
    var currentRubric = DEFAULT_FALLBACK_RUBRIC;
    var globalFeedbackGeneral = [];
    var globalFeedbackTags = [];
    var globalUsers = [];
    var globalAssignments = [];
    var selectedAssignmentId = "";
    var globalEvalTypes = [];
    var globalGeminiModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    var currentQaDisplayName = "";
    var qaFirstName = "";
    var existingRecordId = null;

    // --- Styles ---
    var sOverlay = "position:fixed;top:0;left:0;right:0;bottom:0;background:transparent;display:flex;align-items:flex-start;justify-content:center;z-index:99999;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding-top:20px;overflow-y:auto;pointer-events:none";
    var sModal = "background:white;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.25);width:90%;max-width:580px;height:82vh;max-height:820px;overflow:hidden;display:flex;flex-direction:column;cursor:grab;user-select:none;margin-bottom:20px;pointer-events:auto;position:relative";
    var sHeader = "padding:14px 20px;border-bottom:1px solid #e2e8f0;background:#ffffff;font-size:17px;font-weight:600;color:#1e293b;cursor:grab;display:flex;justify-content:space-between;align-items:center";
    var sContent = "padding:18px 20px;flex:1;color:#475569;font-size:13px;line-height:1.5;overflow-y:auto";
    var sGroupHeader = "margin:18px 0 10px;font-size:15px;font-weight:700;color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:4px";
    var sItemContainer = "margin-bottom:8px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;background:#ffffff";
    var sItemHeader = "width:100%;padding:10px 14px;background:#f8fafc;border:none;text-align:left;cursor:pointer;font-weight:500;color:#1e293b;display:flex;justify-content:space-between;align-items:center;transition:background 0.2s";
    var sItemBody = "display:none;padding:12px 14px;border-top:1px solid #e2e8f0;background:#ffffff";
    var sBtnGroup = "margin-bottom:8px;display:flex;gap:6px;flex-wrap:wrap";
    var sBtnBase = "flex:1;min-width:60px;padding:7px 10px;border:1px solid;border-radius:5px;cursor:pointer;font-weight:500;font-size:12px;transition:all 0.15s;text-align:center";
    var sSelect = "width:100%;padding:6px 10px;border:1px solid #cbd5e1;border-radius:5px;font-size:13px;background:white;cursor:pointer;box-sizing:border-box;margin:0;";
    var sTextarea = "width:100%;border:1px solid #cbd5e1;border-radius:5px;padding:8px;font-family:inherit;resize:vertical;height:55px;font-size:13px;box-sizing:border-box;margin:0;";
    var sInput = "width:100%;padding:6px 10px;border:1px solid #cbd5e1;border-radius:5px;font-size:13px;box-sizing:border-box;margin:0;";
    var sLabel = "display:block;margin-bottom:4px;font-weight:600;font-size:12px;color:#334155";
    var sFooter = "padding:14px 20px;border-top:1px solid #e2e8f0;background:#ffffff;display:flex;gap:10px;justify-content:flex-end;align-items:center";
    var sBtnCancel = "padding:8px 16px;border:1px solid #cbd5e1;background:white;border-radius:5px;cursor:pointer;font-size:13px;color:#475569;font-weight:500";
    var sBtnGenerate = "padding:8px 16px;border:none;background:#2563eb;color:white;border-radius:5px;cursor:pointer;font-size:13px;font-weight:600;transition:opacity 0.2s";
    var sTagContainer = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px";
    var sLoading = "position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.88);display:flex;justify-content:center;align-items:center;z-index:10;font-size:14px;color:#475569;font-weight:500;flex-direction:column;gap:10px";

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
        dbVersion: 2,
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
                        req.onsuccess = function() { resolve(req.result ? req.result.value : null); };
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
        if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };

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

    // --- General Utility Helpers ---
    var normalizeDateStr = function(dStr) {
        if (!dStr) return "";
        var str = String(dStr).split('T')[0].trim();
        if (str.includes('/')) {
            var p = str.split('/');
            if (p.length === 3) {
                var m = p[0].padStart(2, '0');
                var d = p[1].padStart(2, '0');
                var y = p[2].length === 2 ? ('20' + p[2]) : p[2];
                return y + '-' + m + '-' + d;
            }
        }
        var p2 = str.split('-');
        if (p2.length === 3) {
            return p2[0] + '-' + p2[1].padStart(2, '0') + '-' + p2[2].padStart(2, '0');
        }
        return str;
    };

    var formatEmailToName = function(email) {
        if (!email) return "";
        var namePart = String(email).split('@')[0];
        return namePart.split('.').map(function(part){
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join(' ');
    };

    var formatToDisplayName = function(fullName) {
        if (!fullName) return "";
        var str = String(fullName).trim();
        if (str.includes(',')) {
            var parts = str.split(',');
            var lastPart = parts[0].trim();
            var firstPart = parts[1].trim();
            var firstName = firstPart.split(' ')[0];
            var lastName = lastPart;
            var lastSpaceIdx = lastPart.lastIndexOf(' ');
            if (lastSpaceIdx !== -1) {
                lastName = lastPart.substring(0, lastSpaceIdx);
            }
            return (firstName + ' ' + lastName).trim();
        }
        return str;
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
        var alt = document.querySelector('.transcript-container, [data-testid="transcript"], .conversation-body');
        return alt ? alt.innerText.trim() : "";
    };

    var getInteractionId = function() {
        var h4s = Array.from(document.querySelectorAll('h4'));
        var h4 = h4s.find(function(el){ return el.textContent.trim() === 'Interaction ID'; });
        return h4 && h4.nextElementSibling ? h4.nextElementSibling.textContent.trim() : "";
    };

    var getInteractionDateFromPage = function() {
        var h4s = Array.from(document.querySelectorAll('h4'));
        var h4 = h4s.find(function(el){
            var txt = el.textContent.trim().toLowerCase();
            return txt.includes('interaction date') || txt.includes('date of interaction') || txt.includes('call date');
        });
        if (h4 && h4.nextElementSibling) {
            var val = h4.nextElementSibling.textContent.trim();
            return normalizeDateStr(val);
        }
        return "";
    };

    var getAdvocateNameFromPage = function() {
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

    // --- UI Creation ---
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

    // --- Draggable Modal Helper ---
    var makeDraggable = function(modalEl, headerEl) {
        var isDragging = false, startX = 0, startY = 0, currentX = 0, currentY = 0;
        addListener(headerEl, "mousedown", function(e){
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.textContent === '×' || (toolsContainer && (e.target === toolsContainer || toolsContainer.contains(e.target)))) return;
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            headerEl.style.cursor = "grabbing";
        });
        addListener(document, "mousemove", function(e){
            if(isDragging) {
                currentX = e.clientX - startX;
                currentY = e.clientY - startY;
                modalEl.style.transform = "translate(" + currentX + "px, " + currentY + "px)";
            }
        });
        addListener(document, "mouseup", function(){
            if(isDragging) {
                isDragging = false;
                headerEl.style.cursor = "grab";
            }
        });
    };

    var header = createElement("div", sHeader);
    var headerTitle = createElement("span");
    var updateHeaderTitle = function() {
        var namePart = qaFirstName || (currentQaDisplayName ? currentQaDisplayName.split(' ')[0] : (QA_EMAIL ? formatEmailToName(QA_EMAIL).split(' ')[0] : ''));
        headerTitle.innerHTML = "🍞 <strong>QA Tracker</strong>" + (namePart ? " - " + namePart : "");
    };
    updateHeaderTitle();
    header.appendChild(headerTitle);

    var toolsContainer = createElement("div", "position:relative;display:flex;align-items:center;gap:6px");

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

    var btnRefresh = createElement("span");
    btnRefresh.textContent = "🔄";
    btnRefresh.title = "Force Refresh Database";
    btnRefresh.style.cssText = "cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:background 0.2s;user-select:none";
    addListener(btnRefresh, "mouseenter", function(){ btnRefresh.style.background = "rgba(0,0,0,0.06)"; });
    addListener(btnRefresh, "mouseleave", function(){ btnRefresh.style.background = "transparent"; });
    addListener(btnRefresh, "click", function(e){
        e.stopPropagation();
        storage.set('last_sync_ts', '');
        idb.delete('cached_payload').then(function(){
            checkAndSyncData(true);
        }).catch(function(){
            checkAndSyncData(true);
        });
    });

    var btnAiTools = createElement("span");
    btnAiTools.textContent = "🛠️";
    btnAiTools.title = "AI Tools";
    btnAiTools.style.cssText = "cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:background 0.2s;user-select:none";
    addListener(btnAiTools, "mouseenter", function(){ btnAiTools.style.background = "rgba(0,0,0,0.06)"; });
    addListener(btnAiTools, "mouseleave", function(){ btnAiTools.style.background = "transparent"; });

    var aiToolsMenu = createElement("div");
    aiToolsMenu.style.cssText = "position:absolute;top:100%;right:32px;background:white;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:none;flex-direction:column;min-width:180px;z-index:100001;margin-top:6px;overflow:hidden";

    var btnTools = createElement("span");
    btnTools.textContent = "⚙️";
    btnTools.title = "Settings";
    btnTools.style.cssText = "cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:background 0.2s;user-select:none";
    addListener(btnTools, "mouseenter", function(){ btnTools.style.background = "rgba(0,0,0,0.06)"; });
    addListener(btnTools, "mouseleave", function(){ btnTools.style.background = "transparent"; });

    var toolsMenu = createElement("div");
    toolsMenu.style.cssText = "position:absolute;top:100%;right:0;background:white;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:none;flex-direction:column;min-width:160px;z-index:100001;margin-top:6px;overflow:hidden";

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

    // --- AI Modal Helpers ---
    var createAccordion = function(title, contentNodes, isOpen) {
        var container = createElement("div");
        container.style.cssText = "border:1px solid #e2e8f0;border-radius:6px;margin-bottom:12px;overflow:hidden";
        var aHeader = createElement("div");
        aHeader.style.cssText = "padding:10px 14px;background:#f8fafc;cursor:pointer;font-weight:600;font-size:13px;color:#1e293b;display:flex;justify-content:space-between;align-items:center;user-select:none";
        aHeader.innerHTML = "<span>" + title + "</span><span style='font-size:11px;color:#94a3b8'>" + (isOpen ? "▲" : "▼") + "</span>";
        var aBody = createElement("div");
        aBody.style.cssText = "padding:14px;border-top:1px solid #e2e8f0;background:#ffffff;display:" + (isOpen ? "block" : "none");
        if(Array.isArray(contentNodes)) {
            contentNodes.forEach(function(n){ aBody.appendChild(n); });
        } else {
            aBody.appendChild(contentNodes);
        }
        addListener(aHeader, "click", function(){
            var isHidden = aBody.style.display === "none";
            aBody.style.display = isHidden ? "block" : "none";
            aHeader.lastChild.textContent = isHidden ? "▲" : "▼";
        });
        container.appendChild(aHeader);
        container.appendChild(aBody);
        return { container: container, body: aBody };
    };

    // --- Case Notes Checker Modal ---
    var showCaseNotesCheckerModal = function() {
        var pOverlay = createElement("div", sOverlay + "; z-index:100002; background:rgba(0,0,0,0.4); pointer-events:auto; align-items:center");
        var pModal = createElement("div", sModal + "; height:auto; max-height:85vh; width:580px; cursor:default; user-select:auto");
        var pHeader = createElement("div", sHeader + "; cursor:move");
        pHeader.innerHTML = "<span>📝 Case Notes Checker (Gemini AI)</span>";
        var pClose = createElement("span", "cursor:pointer;font-size:18px;color:#94a3b8");
        pClose.textContent = "×";
        addListener(pClose, "click", function(){ pOverlay.remove(); });
        pHeader.appendChild(pClose);

        var pBody = createElement("div", "padding:18px 20px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;user-select:text");

        // Input Accordion
        var divInputs = createElement("div", "display:flex;flex-direction:column;gap:12px");
        var grpSubject = createElement("div");
        grpSubject.appendChild(createElement("label", sLabel)).textContent = "Subject Line";
        var inpSubject = createElement("input", sInput);
        inpSubject.placeholder = "Enter case subject...";
        grpSubject.appendChild(inpSubject);
        divInputs.appendChild(grpSubject);

        var grpNotes = createElement("div");
        grpNotes.appendChild(createElement("label", sLabel)).textContent = "Advocate Case Notes";
        var txtNotes = createElement("textarea", sTextarea + "; height:140px");
        txtNotes.placeholder = "Paste advocate case notes here...";
        grpNotes.appendChild(txtNotes);
        divInputs.appendChild(grpNotes);

        var inputAccordion = createAccordion("Input Data (Subject & Notes)", divInputs, true);
        pBody.appendChild(inputAccordion.container);

        // Results Accordion
        var divOutput = createElement("div", "font-size:13px;line-height:1.6;color:#1e293b;user-select:text");
        var resPlaceholder = createElement("div");
        resPlaceholder.innerHTML = "<div style='color:#94a3b8;font-style:italic;padding:18px;text-align:center;background:#f8fafc;border-radius:6px;border:1px dashed #cbd5e1'>Analysis results will appear here after clicking Generate...</div>";
        divOutput.appendChild(resPlaceholder);
        var outputAccordion = createAccordion("Analysis Results", divOutput, true);
        pBody.appendChild(outputAccordion.container);

        var pFooter = createElement("div", sFooter);
        var pBtnCancel = createElement("button", sBtnCancel);
        pBtnCancel.textContent = "Close";
        addListener(pBtnCancel, "click", function(){ pOverlay.remove(); });
        pFooter.appendChild(pBtnCancel);

        var pBtnGen = createElement("button", sBtnGenerate);
        pBtnGen.textContent = "Generate Analysis";
        addListener(pBtnGen, "click", function(){
            var transcript = extractTranscript();
            var subject = inpSubject.value.trim();
            var notes = txtNotes.value.trim();

            if(!notes) return showToast("Please paste the Case Notes first.", true);

            pBtnGen.disabled = true;
            pBtnGen.textContent = "Analyzing... ⏳";
            resPlaceholder.innerHTML = "<div style='padding:20px;text-align:center;color:#2563eb;font-weight:600'>🚀 Gemini is auditing case notes against transcript...</div>";

            var prompt = "You are a QA specialist auditing support case notes against the interaction transcript.\n\n" +
                         "=== TRANSCRIPT ===\n" + (transcript || "No transcript available on page.") + "\n\n" +
                         "=== SUBJECT LINE ===\n" + (subject || "N/A") + "\n\n" +
                         "=== CASE NOTES ===\n" + notes + "\n\n" +
                         "Audit the case notes for:\n" +
                         "1. ACCURACY: Did the agent correctly capture the issue and resolution?\n" +
                         "2. COMPLETENESS: Are troubleshooting steps, internal checks, and customer responses thoroughly documented?\n" +
                         "3. FORMATTING: Are notes clear and easy to follow?\n\n" +
                         "Format your output clearly with:\n" +
                         "SUMMARY: [1-2 concise sentences summarizing the issue]\n" +
                         "STRENGTHS: [Key positive points]\n" +
                         "COACHING / OPPORTUNITIES: [Specific gaps or improvements]\n" +
                         "RECOMMENDED REVISED NOTES: [Polished version of the notes]";

            callGemini(prompt, "You are an expert QA evaluator for customer support.")
                .then(function(resText){
                    resPlaceholder.innerHTML = "<div style='white-space:pre-wrap;padding:6px;user-select:text;cursor:text'>" + resText + "</div>";
                    var sumMatch = resText.match(/SUMMARY:?\s*([\s\S]*?)(?:\n\n|STRENGTHS|$)/i);
                    if (sumMatch && sumMatch[1] && txtIssue) {
                        txtIssue.value = sumMatch[1].trim();
                        txtIssue.dispatchEvent(new Event('input'));
                    }
                    showToast("Case notes analysis complete!", false);
                    inputAccordion.body.style.display = "none";
                    inputAccordion.container.firstChild.lastChild.textContent = "▼";
                })
                .catch(function(err){
                    resPlaceholder.innerHTML = "<div style='color:#ef4444;padding:15px;text-align:center'>❌ " + err.message + "</div>";
                    showToast(err.message, true);
                })
                .finally(function(){
                    pBtnGen.disabled = false;
                    pBtnGen.textContent = "Generate Analysis";
                });
        });
        pFooter.appendChild(pBtnGen);

        pModal.appendChild(pHeader);
        pModal.appendChild(pBody);
        pModal.appendChild(pFooter);
        pOverlay.appendChild(pModal);
        document.body.appendChild(pOverlay);
        makeDraggable(pModal, pHeader);
    };

    // --- Chat Checker Modal ---
    var showChatCheckerModal = function() {
        var pOverlay = createElement("div", sOverlay + "; z-index:100002; background:rgba(0,0,0,0.4); pointer-events:auto; align-items:center");
        var pModal = createElement("div", sModal + "; height:auto; max-height:85vh; width:580px; cursor:default; user-select:auto");
        var pHeader = createElement("div", sHeader + "; cursor:move");
        pHeader.innerHTML = "<span>💬 Chat Checker (Gemini AI)</span>";
        var pClose = createElement("span", "cursor:pointer;font-size:18px;color:#94a3b8");
        pClose.textContent = "×";
        addListener(pClose, "click", function(){ pOverlay.remove(); });
        pHeader.appendChild(pClose);

        var pBody = createElement("div", "padding:18px 20px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;user-select:text");

        var divInputs = createElement("div", "display:flex;flex-direction:column;gap:12px");
        var grpTranscript = createElement("div");
        grpTranscript.appendChild(createElement("label", sLabel)).textContent = "Chat Transcript";
        var txtChat = createElement("textarea", sTextarea + "; height:140px");
        txtChat.value = extractTranscript();
        txtChat.placeholder = "Paste or inspect chat transcript...";
        grpTranscript.appendChild(txtChat);
        divInputs.appendChild(grpTranscript);

        var inputAccordion = createAccordion("Chat Transcript", divInputs, true);
        pBody.appendChild(inputAccordion.container);

        var divOutput = createElement("div", "font-size:13px;line-height:1.6;color:#1e293b;user-select:text");
        var resPlaceholder = createElement("div");
        resPlaceholder.innerHTML = "<div style='color:#94a3b8;font-style:italic;padding:18px;text-align:center;background:#f8fafc;border-radius:6px;border:1px dashed #cbd5e1'>Chat evaluation will appear here...</div>";
        divOutput.appendChild(resPlaceholder);
        var outputAccordion = createAccordion("Analysis Results", divOutput, true);
        pBody.appendChild(outputAccordion.container);

        var pFooter = createElement("div", sFooter);
        var pBtnCancel = createElement("button", sBtnCancel);
        pBtnCancel.textContent = "Close";
        addListener(pBtnCancel, "click", function(){ pOverlay.remove(); });
        pFooter.appendChild(pBtnCancel);

        var pBtnGen = createElement("button", sBtnGenerate);
        pBtnGen.textContent = "Evaluate Chat";
        addListener(pBtnGen, "click", function(){
            var chatText = txtChat.value.trim();
            if(!chatText) return showToast("Chat transcript is empty.", true);

            pBtnGen.disabled = true;
            pBtnGen.textContent = "Evaluating... ⏳";
            resPlaceholder.innerHTML = "<div style='padding:20px;text-align:center;color:#2563eb;font-weight:600'>🚀 Gemini is evaluating the chat interaction...</div>";

            var prompt = "Evaluate this customer support chat transcript against QA standards:\n\n" +
                         "=== CHAT TRANSCRIPT ===\n" + chatText + "\n\n" +
                         "Audit each category:\n" +
                         "1. GREETING & CLOSING: Professional opening, proper verification, polite sign-off.\n" +
                         "2. EMPATHY & TONE: Professionalism, de-escalation, emotional intelligence.\n" +
                         "3. RESOLUTION & PROBING: Effective problem-solving, root cause identification.\n" +
                         "4. GRAMMAR & CLARITY: Punctuation, spelling, concise communication.\n\n" +
                         "Format with:\n" +
                         "- OVERALL EVALUATION (Pass / Needs Coaching)\n" +
                         "- HIGHLIGHTS\n" +
                         "- AREAS FOR IMPROVEMENT\n" +
                         "- RECOMMENDED RESPONSES";

            callGemini(prompt, "You are a senior QA chat evaluation specialist.")
                .then(function(resText){
                    resPlaceholder.innerHTML = "<div style='white-space:pre-wrap;padding:6px;user-select:text;cursor:text'>" + resText + "</div>";
                    showToast("Chat audit complete!", false);
                    inputAccordion.body.style.display = "none";
                    inputAccordion.container.firstChild.lastChild.textContent = "▼";
                })
                .catch(function(err){
                    resPlaceholder.innerHTML = "<div style='color:#ef4444;padding:15px;text-align:center'>❌ " + err.message + "</div>";
                    showToast(err.message, true);
                })
                .finally(function(){
                    pBtnGen.disabled = false;
                    pBtnGen.textContent = "Evaluate Chat";
                });
        });
        pFooter.appendChild(pBtnGen);

        pModal.appendChild(pHeader);
        pModal.appendChild(pBody);
        pModal.appendChild(pFooter);
        pOverlay.appendChild(pModal);
        document.body.appendChild(pOverlay);
        makeDraggable(pModal, pHeader);
    };

    // Hook options to aiToolsMenu
    aiToolsMenu.appendChild(createMenuItem("📝 Case Notes Checker", showCaseNotesCheckerModal, aiToolsMenu));
    aiToolsMenu.appendChild(createMenuItem("💬 Chat Checker", showChatCheckerModal, aiToolsMenu));
    toolsMenu.appendChild(createMenuItem("⚙️ Configure", function(){ showSettingsModal(false); }, toolsMenu));

    toolsContainer.appendChild(btnRefresh);
    toolsContainer.appendChild(btnAiTools);
    toolsContainer.appendChild(aiToolsMenu);
    toolsContainer.appendChild(btnTools);
    toolsContainer.appendChild(toolsMenu);
    header.appendChild(toolsContainer);

    makeDraggable(modal, header);

    var contentContainer = createElement("div", sContent);

    // --- Header Fields (Compact Layout: In-Field Icons & Ghosttext Placeholders, No Labels) ---
    var headerFieldsContainer = createElement("div");
    headerFieldsContainer.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0";

    // Helper to wrap input/select with an in-field icon (uniform 36px height, margin 0, left padding 36px)
    var createIconFieldWrapper = function(icon, element, fullWidth) {
        var wrap = createElement("div");
        wrap.style.cssText = "position:relative;display:flex;align-items:center;width:100%;margin:0;" + (fullWidth ? "grid-column:1 / -1;" : "");

        var iconEl = createElement("span");
        iconEl.textContent = icon;
        iconEl.style.cssText = "position:absolute;left:11px;pointer-events:none;font-size:13px;z-index:2;user-select:none;display:inline-flex;align-items:center;justify-content:center;";

        element.style.paddingLeft = "36px";
        element.style.boxSizing = "border-box";
        element.style.width = "100%";
        element.style.height = "36px";
        element.style.paddingTop = "0";
        element.style.paddingBottom = "0";
        element.style.margin = "0";

        wrap.appendChild(iconEl);
        wrap.appendChild(element);
        return wrap;
    };

    // 1. Agent's Name Dropdown
    var selAgent = createElement("select", sSelect);
    selAgent.innerHTML = "<option value=''>Agent's Name</option>";
    var wrapAgent = createIconFieldWrapper("👤", selAgent);

    // 2. Interaction ID
    var inpInteractionId = createElement("input", sInput);
    inpInteractionId.placeholder = "Interaction ID";
    inpInteractionId.value = getInteractionId();
    var wrapInteractionId = createIconFieldWrapper("🆔", inpInteractionId);

    // Row 1: Agent's Name and Interaction ID
    var rowAgentInteraction = createElement("div", "display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;width:100%;");
    rowAgentInteraction.appendChild(wrapAgent);
    rowAgentInteraction.appendChild(wrapInteractionId);
    headerFieldsContainer.appendChild(rowAgentInteraction);

    var duplicateWarningBox = createElement("div");
    duplicateWarningBox.style.cssText = "display:none;background:#fef2f2;border:1px solid #ef4444;border-radius:5px;padding:6px 10px;margin-top:-2px;margin-bottom:2px;color:#991b1b;font-size:11px;font-weight:600;line-height:1.4";
    headerFieldsContainer.appendChild(duplicateWarningBox);

    // 3. Evaluation Type Dropdown
    var selEvalType = createElement("select", sSelect);
    var updateEvalTypesDropdown = function(selectedVal) {
        var prevVal = selectedVal || selEvalType.value || "";
        selEvalType.innerHTML = "";
        if (!globalEvalTypes || globalEvalTypes.length === 0) {
            var optPlaceholder = createElement("option");
            optPlaceholder.value = "";
            optPlaceholder.textContent = "Evaluation Type";
            selEvalType.appendChild(optPlaceholder);
            return;
        }
        globalEvalTypes.forEach(function(t){
            var opt = createElement("option");
            opt.value = t;
            opt.textContent = t;
            if (prevVal && t.toLowerCase() === prevVal.toLowerCase()) opt.selected = true;
            selEvalType.appendChild(opt);
        });
        if (!selEvalType.value && globalEvalTypes.length > 0) {
            selEvalType.value = globalEvalTypes[0];
        }
    };
    updateEvalTypesDropdown();
    var wrapEvalType = createIconFieldWrapper("📋", selEvalType);

    // 4. Call ANI / DNIS
    var initAniOpts = getAniDnisOptions();
    var selAni;
    if (initAniOpts.length > 0) {
        selAni = createElement("select", sSelect);
    } else {
        selAni = createElement("input", sInput);
        selAni.placeholder = "Call ANI / DNIS";
    }

    var resetAniDropdown = function() {
        if (!selAni) return;
        var aniOpts = getAniDnisOptions();
        var defaultAni = (aniOpts.length > 1) ? aniOpts[1] : (aniOpts[0] || "");
        if (selAni.tagName === 'SELECT') {
            selAni.innerHTML = "";
            aniOpts.forEach(function(o){
                var opt = createElement("option");
                opt.value = o;
                opt.textContent = o;
                if (o === defaultAni) opt.selected = true;
                selAni.appendChild(opt);
            });
            if (defaultAni) selAni.value = defaultAni;
        } else if (selAni.tagName === 'INPUT') {
            selAni.value = defaultAni;
        }
    };
    resetAniDropdown();
    var wrapAni = createIconFieldWrapper("📞", selAni);

    // Row 2: Evaluation Type and Call ANI/DNIS
    var rowEvalTypeAni = createElement("div", "display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;width:100%;");
    rowEvalTypeAni.appendChild(wrapEvalType);
    rowEvalTypeAni.appendChild(wrapAni);
    headerFieldsContainer.appendChild(rowEvalTypeAni);

    // Row 3: Case # & Call Duration Row
    var caseDurationRow = createElement("div", "display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;width:100%;");
    var inpCaseNo = createElement("input", sInput);
    inpCaseNo.placeholder = "Case #";
    var inpDuration = createElement("input", sInput);
    inpDuration.placeholder = "Call Duration";
    inpDuration.value = getCallDuration();
    caseDurationRow.appendChild(createIconFieldWrapper("🔢", inpCaseNo));
    caseDurationRow.appendChild(createIconFieldWrapper("⏱️", inpDuration));
    headerFieldsContainer.appendChild(caseDurationRow);

    // Row 4: Date of Interaction & Date of Evaluation
    var dateRow = createElement("div", "display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;width:100%;");
    var inpDateInteraction = createElement("input", sInput);
    inpDateInteraction.type = "date";
    inpDateInteraction.title = "Date of Interaction";
    var pageIntDate = getInteractionDateFromPage();
    if (pageIntDate) inpDateInteraction.value = pageIntDate;

    var inpDateEvaluation = createElement("input", sInput);
    inpDateEvaluation.type = "date";
    inpDateEvaluation.title = "Date of Evaluation";
    function getLocalDateString(d) {
        d = d || new Date();
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }
    inpDateEvaluation.value = getLocalDateString();
    dateRow.appendChild(createIconFieldWrapper("📅", inpDateInteraction));
    dateRow.appendChild(createIconFieldWrapper("📅", inpDateEvaluation));
    headerFieldsContainer.appendChild(dateRow);

    // Row 5: Category & Sub-Category Row
    var categoryRow = createElement("div", "display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;width:100%;");
    var inpCategory = createElement("input", sInput);
    inpCategory.placeholder = "Category";
    var inpSubCategory = createElement("input", sInput);
    inpSubCategory.placeholder = "Sub-Category";
    categoryRow.appendChild(createIconFieldWrapper("🗂️", inpCategory));
    categoryRow.appendChild(createIconFieldWrapper("📂", inpSubCategory));
    headerFieldsContainer.appendChild(categoryRow);

    // Row 6: Issue / Concern with ✨ Gemini Summary button and inside 📝 icon
    var wrapIssue = createElement("div", "position:relative;width:100%;grid-column:1 / -1;margin:0;");
    var icoIssue = createElement("span");
    icoIssue.textContent = "📝";
    icoIssue.style.cssText = "position:absolute;left:11px;top:9px;pointer-events:none;font-size:13px;z-index:2;user-select:none;";

    var txtIssue = createElement("textarea", sTextarea);
    txtIssue.placeholder = "Issue / Concern";
    txtIssue.style.cssText = "width:100%;border:1px solid #cbd5e1;border-radius:5px;padding:8px 34px 8px 36px;font-family:inherit;resize:vertical;height:55px;font-size:13px;box-sizing:border-box;margin:0;";

    var btnSummary = createElement("span");
    btnSummary.textContent = "✨";
    btnSummary.title = "Generate Summary from Transcript using Gemini AI";
    btnSummary.style.cssText = "position:absolute;right:10px;top:9px;cursor:pointer;font-size:15px;opacity:0.7;user-select:none;z-index:5;";

    wrapIssue.appendChild(icoIssue);
    wrapIssue.appendChild(txtIssue);
    wrapIssue.appendChild(btnSummary);
    headerFieldsContainer.appendChild(wrapIssue);

    addListener(btnSummary, "mouseenter", function(){ btnSummary.style.opacity = "1"; });
    addListener(btnSummary, "mouseleave", function(){ btnSummary.style.opacity = "0.7"; });
    addListener(btnSummary, "click", function(e){
        e.stopPropagation();
        var transcript = extractTranscript();
        if(!transcript) return showToast("No transcript found on page.", true);

        var origIcon = btnSummary.textContent;
        btnSummary.textContent = "⏳";
        btnSummary.style.cursor = "wait";

        var prompt = "Summarize the customer's main issue or question in 1-2 concise sentences based on this interaction transcript:\n\n" + transcript;
        callGemini(prompt, "You are a concise QA evaluator. Output ONLY the summary sentence(s).")
            .then(function(summary){
                txtIssue.value = summary;
                txtIssue.dispatchEvent(new Event('input'));
                showToast("Summary generated with Gemini!", false);
            })
            .catch(function(err){ showToast("Summary failed: " + err.message, true); })
            .finally(function(){ btnSummary.textContent = origIcon; btnSummary.style.cursor = "pointer"; });
    });

    contentContainer.appendChild(headerFieldsContainer);

    // --- Dynamic Rubric & Feedback Updates ---
    var updateText = function(key) {
        var s = state[key];
        if(!s) return;

        var txt = "";
        var cleanText = function(t) { return (t || "").replace(/\s*Source:[\s\S]*$/i, "").trim(); };

        if(s.selectedTags && s.selectedTags.length > 0) {
            txt = s.selectedTags.map(function(t){ return cleanText(t.feedbackText || t.feedback_text); }).join(" ");
        } else {
            var genFeedback = globalFeedbackGeneral.find(function(f){
                var matchRubric = !f.rubricId || !currentRubric || !currentRubric.id || String(f.rubricId) === String(currentRubric.id);
                var matchSec = (f.sectionIndex === s.secIdx || f.section_index === s.secIdx);
                var matchItem = (f.itemIndex === s.itemIdx || f.item_index === s.itemIdx);
                var matchOpt = (f.optionIndex === s.selIndex || f.option_index === s.selIndex);
                return matchRubric && matchSec && matchItem && matchOpt;
            });
            if (genFeedback) {
                txt = cleanText(genFeedback.feedbackText || genFeedback.feedback_text);
            }
        }

        s.text = txt;
        if(s.domTextarea) {
            s.domTextarea.value = txt;
        }
    };

    var refreshAllUI = function() {
        Object.keys(state).forEach(function(key){
            if(state[key].refreshUI) state[key].refreshUI();
            if(state[key].domTextarea) state[key].domTextarea.value = state[key].text || "";
        });
        updateLiveScore();
    };

    // --- Score Calculation (identical to EvaluationsFormJS.html & EvaluationsJS.html) ---
    var computeRubricScore = function() {
        var rawSections = [];
        if (currentRubric) {
            if (Array.isArray(currentRubric.sections)) {
                rawSections = currentRubric.sections;
            } else if (Array.isArray(currentRubric.structure)) {
                rawSections = currentRubric.structure;
            } else if (typeof currentRubric.structure === 'string') {
                try { rawSections = JSON.parse(currentRubric.structure); } catch(e) {}
            }
        }
        if (rawSections.length === 0 && DEFAULT_FALLBACK_RUBRIC) {
            rawSections = typeof DEFAULT_FALLBACK_RUBRIC.structure === 'string' ? JSON.parse(DEFAULT_FALLBACK_RUBRIC.structure) : (DEFAULT_FALLBACK_RUBRIC.sections || []);
        }

        var cp = 0, mp = 0, totalItems = 0, correctCount = 0, incorrectCount = 0;

        rawSections.forEach(function(s, si) {
            (s.items || []).forEach(function(it, ii) {
                totalItems++;
                var im = 0, ib = 0, hd = false;
                (it.options || []).forEach(function(o) {
                    var pts = parseFloat(o.points) || 0;
                    var isCorr = (o.isCorrect === true || o.isCorrect === 'true');
                    if (isCorr) {
                        if (pts > im) im = pts;
                        if (o.isDefault === true || o.isDefault === 'true') {
                            ib = pts;
                            hd = true;
                        }
                    }
                });
                if (!hd) ib = im;
                mp += im;

                var keyColon = si + ":" + ii;
                var keyUnderscore = si + "_" + ii;
                var sState = state[keyColon] || state[keyUnderscore];

                if (sState && sState.options) {
                    var selOpt = sState.options[sState.selIndex] || sState.options.find(function(o){ return o.id === sState.sel || o.label === sState.sel; }) || sState.options[0];
                    if (selOpt) {
                        var pts = parseFloat(selOpt.points) || 0;
                        var isCorr = (selOpt.isCorrect === true || selOpt.isCorrect === 'true');
                        if (isCorr) {
                            correctCount++;
                            cp += pts;
                        } else {
                            incorrectCount++;
                            cp += (ib - pts);
                        }
                    } else {
                        cp += ib;
                    }
                } else {
                    cp += ib;
                }
            });
        });

        var fp = Math.max(0, cp);
        var pct = mp > 0 ? (fp / mp) * 100 : (fp > 0 ? 100 : 0);
        return {
            score: parseFloat(pct.toFixed(2)),
            scoreStr: pct.toFixed(2),
            earnedPoints: fp,
            maxPoints: mp,
            correctCount: correctCount,
            incorrectCount: incorrectCount,
            totalItems: totalItems
        };
    };

    var scoreBadge = null;
    var updateLiveScore = function() {
        if (!selectedAssignmentId && (!selAgent || !selAgent.value)) {
            if (scoreBadge) {
                scoreBadge.style.background = "#f1f5f9";
                scoreBadge.style.color = "#475569";
                scoreBadge.style.border = "1px solid #cbd5e1";
                scoreBadge.innerHTML = "<span>Score: <strong>--</strong></span>";
            }
            return;
        }
        var res = computeRubricScore();
        if (scoreBadge) {
            var bg = '#dcfce7', txt = '#15803d', border = '#86efac';
            if (res.score < 70) {
                bg = '#fee2e2'; txt = '#991b1b'; border = '#fca5a5';
            } else if (res.score < 85) {
                bg = '#fef9c3'; txt = '#854d0e'; border = '#fde047';
            }
            scoreBadge.style.background = bg;
            scoreBadge.style.color = txt;
            scoreBadge.style.border = '1px solid ' + border;
            scoreBadge.innerHTML = '<span>Score: <strong>' + res.scoreStr + '%</strong></span>';
        }
    };

    // --- Empty State Placeholder (when no agent is selected) ---
    var renderNoAgentSelectedPlaceholder = function() {
        contentContainer.querySelectorAll('.rubric-section').forEach(function(el){ el.remove(); });
        state = {};

        var placeholderBox = createElement("div", "display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44px 20px;text-align:center;background:#f8fafc;border:2px dashed #cbd5e1;border-radius:8px;margin-top:8px;color:#64748b;user-select:none;");
        placeholderBox.className = "rubric-section";

        var iconEl = createElement("div", "font-size:36px;margin-bottom:8px;line-height:1;");
        iconEl.textContent = "👤📋";

        var titleEl = createElement("div", "font-size:15px;font-weight:700;color:#1e293b;margin-bottom:4px;");
        titleEl.textContent = "Select an Agent First";

        var descEl = createElement("div", "font-size:12px;color:#64748b;max-width:320px;line-height:1.4;");
        descEl.textContent = "The evaluation rubric will load automatically once you choose an agent from the dropdown above.";

        placeholderBox.appendChild(iconEl);
        placeholderBox.appendChild(titleEl);
        placeholderBox.appendChild(descEl);
        contentContainer.appendChild(placeholderBox);

        updateLiveScore();
    };

    // --- Form Rendering by Rubric Object ---
    var renderRubric = function(rubricData, feedbackChips, feedbackGeneral) {
        contentContainer.querySelectorAll('.rubric-section').forEach(function(el){ el.remove(); });
        state = {};
        currentRubric = rubricData || DEFAULT_FALLBACK_RUBRIC;

        var sections = [];
        try {
            sections = (typeof currentRubric.structure === 'string') ? JSON.parse(currentRubric.structure) : (currentRubric.structure || []);
        } catch(e) { sections = []; }

        globalFeedbackTags = feedbackChips || [];
        globalFeedbackGeneral = feedbackGeneral || [];

        sections.forEach(function(section, secIdx){
            var groupTitle = createElement("div", sGroupHeader + ";rubric-section");
            groupTitle.className = "rubric-section";
            groupTitle.textContent = section.name || section.title || ("Section " + (secIdx + 1));
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
                var cleanText = (item.question || item.shortName || item.short_name || item.text || ("Item " + (itemIdx + 1))).replace(/^\d+\.\s*/, "");
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
                    { id: 'yes', label: 'Yes', points: 10, color: 'green', isDefault: true },
                    { id: 'no', label: 'No', points: 0, color: 'red', isDefault: false }
                ];
                var options = rawOptions.map(function(opt, idx){
                    var optColor = 'gray';
                    if (opt.isCorrect === true) {
                        optColor = 'green';
                    } else if (opt.isCorrect === false) {
                        optColor = 'red';
                    } else if (opt.color) {
                        optColor = opt.color;
                    } else {
                        optColor = (idx === 0) ? 'green' : 'red';
                    }

                    return {
                        id: opt.id || String(idx),
                        label: opt.label || opt.text || 'Option',
                        points: opt.points !== undefined ? opt.points : 0,
                        color: optColor,
                        isCorrect: opt.isCorrect,
                        isDefault: opt.isDefault === true
                    };
                });

                var defaultIdx = options.findIndex(function(o){ return o.isDefault === true; });
                if (defaultIdx === -1) defaultIdx = 0;

                state[key] = {
                    id: item.id || (secIdx + "_" + itemIdx),
                    secIdx: secIdx,
                    itemIdx: itemIdx,
                    sectionName: (section.name || section.title || ("Section " + (secIdx + 1))).trim(),
                    question: (item.question || item.title || item.shortName || cleanText || ("Item " + (itemIdx + 1))).trim(),
                    cleanQuestion: cleanText.trim().toLowerCase(),
                    sel: options[defaultIdx].id,
                    selIndex: defaultIdx,
                    text: "",
                    checked: false,
                    groupName: section.name || section.title,
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

                // Render based on uiType: 'dropdown' or 'buttons'
                var isDropdown = (item.uiType === 'dropdown');
                var optSelect = null;
                var btnGroup = null;
                var optionButtons = [];

                if (isDropdown) {
                    optSelect = createElement("select", sSelect);
                    options.forEach(function(opt, optIdx){
                        var oEl = createElement("option");
                        oEl.value = opt.id;
                        var ptsLabel = (opt.points !== undefined && opt.points !== 0) ? (" (" + opt.points + " pts)") : "";
                        oEl.textContent = opt.label + ptsLabel;
                        if (optIdx === defaultIdx) oEl.selected = true;
                        optSelect.appendChild(oEl);
                    });

                    var updateSelectStyles = function() {
                        var val = state[key].sel;
                        var theme = getTheme({ options: options }, val);
                        var cols = getColors(theme);
                        optSelect.style.background = cols.bg;
                        optSelect.style.color = cols.txt;
                        optSelect.style.borderColor = cols.border;
                        optSelect.style.fontWeight = "600";
                    };

                    addListener(optSelect, "change", function(e){
                        var selectedVal = e.target.value;
                        var foundIdx = options.findIndex(function(o){ return o.id === selectedVal; });
                        if (foundIdx === -1) foundIdx = 0;
                        state[key].sel = selectedVal;
                        state[key].selIndex = foundIdx;
                        state[key].selectedTags = [];
                        updateSelectStyles();
                        renderTags();
                        updateHeaderBg();
                        updateText(key);
                        updateLiveScore();
                    });

                    updateSelectStyles();
                    itemBody.appendChild(optSelect);
                } else {
                    btnGroup = createElement("div", sBtnGroup);
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
                            updateLiveScore();
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

                    updateBtnStyles();
                    itemBody.appendChild(btnGroup);
                }

                state[key].refreshUI = function() {
                    if (isDropdown && optSelect) {
                        optSelect.value = state[key].sel;
                        updateSelectStyles();
                    } else if (btnGroup) {
                        updateBtnStyles();
                    }
                    checkbox.checked = state[key].checked;
                    if (textarea) textarea.value = state[key].text || "";
                    renderTags();
                    updateHeaderBg();
                };

                itemBody.appendChild(tagContainer);

                var textarea = createElement("textarea", sTextarea);
                state[key].domTextarea = textarea;
                textarea.placeholder = "Comments";
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

        updateLiveScore();
    };

    // --- Switch Rubric when Assignment is Selected ---
    var switchRubricById = function(rubricId) {
        if (!rubricId) {
            renderRubric(allRubrics[0] || DEFAULT_FALLBACK_RUBRIC, globalFeedbackTags, globalFeedbackGeneral);
            return;
        }
        var found = allRubrics.find(function(r){
            return String(r.id) === String(rubricId) || String(r.name).toLowerCase() === String(rubricId).toLowerCase();
        });
        if (found) {
            console.log("Switching to Rubric:", found.name, "(ID: " + rubricId + ")");
            renderRubric(found, globalFeedbackTags, globalFeedbackGeneral);
        } else {
            renderRubric(allRubrics[0] || DEFAULT_FALLBACK_RUBRIC, globalFeedbackTags, globalFeedbackGeneral);
        }
    };

    // --- Score / State Reset Helper ---
    var resetRubricToDefaults = function() {
        Object.keys(state).forEach(function(key){
            var s = state[key];
            if (!s || !s.options) return;
            var defaultIdx = s.options.findIndex(function(o){ return o.isDefault === true; });
            if (defaultIdx === -1) defaultIdx = 0;
            s.sel = s.options[defaultIdx].id;
            s.selIndex = defaultIdx;
            s.checked = false;
            s.selectedTags = [];
            updateText(key);
        });
        refreshAllUI();
        updateLiveScore();
    };

    // --- Name Resolution & Assignment Matching Helpers ---
    var resolveName = function(a) {
        if (!a) return "Agent";
        if (a.agentSnapshot) {
            var snap = typeof a.agentSnapshot === 'string' ? JSON.parse(a.agentSnapshot) : a.agentSnapshot;
            if (snap && snap.displayName) return snap.displayName;
            if (snap && snap.fullName) return formatToDisplayName(snap.fullName);
        }
        if (a.agentName && a.agentName !== a.agentEmail) {
            return formatToDisplayName(a.agentName);
        }
        var matchedUser = globalUsers.find(function(u){
            return (u.email || '').toLowerCase() === (a.agentEmail || '').toLowerCase();
        });
        if (matchedUser && matchedUser.name) return formatToDisplayName(matchedUser.name);
        return formatEmailToName(a.agentEmail) || a.agentEmail || "Agent";
    };

    var findMatchingAssignmentForAdvocate = function(advocateName) {
        if (!advocateName || !globalAssignments || globalAssignments.length === 0) return null;
        var target = advocateName.toLowerCase().trim();

        var matches = globalAssignments.filter(function(a) {
            var agentLabel = resolveName(a).toLowerCase();
            var rawName = String(a.agentName || '').toLowerCase();
            var email = String(a.agentEmail || '').toLowerCase();
            return agentLabel === target || agentLabel.includes(target) || target.includes(agentLabel) ||
                   rawName === target || rawName.includes(target) || target.includes(rawName) ||
                   (email && target.includes(email.split('@')[0]));
        });

        if (matches.length === 0) return null;
        if (matches.length === 1) return matches[0];

        // If multiple matches across dates: prefer Pending / Incomplete assignments
        var pendingMatches = matches.filter(function(a){ return a.status !== 'Completed'; });
        var pool = pendingMatches.length > 0 ? pendingMatches : matches;

        // Sort by date closest to today
        var todayStr = getLocalDateString();
        pool.sort(function(a, b) {
            var da = normalizeDateStr(a.date);
            var db = normalizeDateStr(b.date);
            return Math.abs(new Date(da) - new Date(todayStr)) - Math.abs(new Date(db) - new Date(todayStr));
        });

        return pool[0];
    };

    var autoSelectAssignmentAndDate = function() {
        var pageAdvocateName = getAdvocateNameFromPage();
        if (pageAdvocateName) {
            var matchedAsg = findMatchingAssignmentForAdvocate(pageAdvocateName);
            if (matchedAsg && matchedAsg.date) {
                inpDateEvaluation.value = normalizeDateStr(matchedAsg.date);
                updateAgentDropdown();
                selectedAssignmentId = matchedAsg.id;
                selAgent.value = "asg:" + matchedAsg.id;

                if (matchedAsg.rubricId) {
                    switchRubricById(matchedAsg.rubricId);
                }
                if (matchedAsg.evaluationType && selEvalType) {
                    selEvalType.value = matchedAsg.evaluationType;
                }
                if (matchedAsg.status === 'Completed') {
                    handleAgentSelectionChange(selAgent.selectedOptions[0]);
                }
                return true;
            }
        }
        updateAgentDropdown();
        return false;
    };

    // --- Populate Agent Dropdown based on Date of Evaluation (Date column in Assignments sheet) ---
    var updateAgentDropdown = function() {
        var selectedDate = inpDateEvaluation.value; // YYYY-MM-DD
        selAgent.innerHTML = "";

        var defaultOpt = createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "Agent's Name";
        selAgent.appendChild(defaultOpt);

        var pageAdvocateName = getAdvocateNameFromPage().toLowerCase();
        var normSelectedDate = normalizeDateStr(selectedDate);

        // Filter assignments strictly matching the selected Date of Evaluation
        var dateAssignments = globalAssignments.filter(function(a){
            return normalizeDateStr(a.date) === normSelectedDate;
        });

        if (dateAssignments.length > 0) {
            var matchedOptFound = false;
            dateAssignments.forEach(function(a){
                var opt = createElement("option");
                opt.value = "asg:" + a.id;
                var agentLabel = resolveName(a);
                var isDone = (a.status === 'Completed');
                opt.textContent = isDone ? ("✓ " + agentLabel) : agentLabel;
                opt.dataset.rubricId = a.rubricId || "";
                opt.dataset.agentName = agentLabel;
                opt.dataset.agentEmail = a.agentEmail || "";
                opt.dataset.asgId = a.id;
                opt.dataset.evalType = a.evaluationType || "Standard";
                opt.dataset.status = a.status || "Pending";

                if (selectedAssignmentId && a.id === selectedAssignmentId) {
                    opt.selected = true;
                    matchedOptFound = true;
                } else if (!matchedOptFound && pageAdvocateName && (agentLabel.toLowerCase().includes(pageAdvocateName) || pageAdvocateName.includes(agentLabel.toLowerCase()))) {
                    opt.selected = true;
                    selectedAssignmentId = a.id;
                    matchedOptFound = true;
                }
                selAgent.appendChild(opt);
            });
        }
    };

    // Unified Agent Selection Handler
    var handleAgentSelectionChange = function(selectedOpt) {
        if (!selectedOpt) return;
        var val = selectedOpt.value || "";

        if (val && val.startsWith("asg:")) {
            selectedAssignmentId = selectedOpt.dataset.asgId || "";
            var asg = globalAssignments.find(function(a){ return a.id === selectedAssignmentId; });
            var rubricId = selectedOpt.dataset.rubricId || (asg && asg.rubricId) || "";
            var asgEvalType = selectedOpt.dataset.evalType || (asg && asg.evaluationType) || "Standard";

            if (rubricId) switchRubricById(rubricId);
            if (asgEvalType && selEvalType) selEvalType.value = asgEvalType;

            // Check if this assignment is already completed
            if (asg && asg.status === 'Completed') {
                showLoading("Loading completed evaluation for " + (selectedOpt.dataset.agentName || "agent") + "...");
                var url = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                          'api=1&action=check_existing&token=' + encodeURIComponent(API_TOKEN) +
                          '&assignment_id=' + encodeURIComponent(asg.id);
                fetch(url)
                    .then(function(res){ return res.json(); })
                    .then(function(resData){
                        if (resData.success && resData.data) {
                            populateEvaluationRecord(resData.data, asg);
                        } else if (inpInteractionId.value) {
                            checkExistingRecord();
                        }
                    })
                    .catch(function(err){ console.warn("Load completed asg error:", err); })
                    .finally(function(){ hideLoading(); });
            } else {
                // Fresh/Pending assignment: Reset rubric and scoresheet to clean state with default feedback templates
                duplicateWarningBox.style.display = "none";
                duplicateWarningBox.innerHTML = "";
                existingRecordId = null;
                resetRubricToDefaults();

                // Explicitly clear manual evaluation fields
                inpCaseNo.value = "";
                inpCategory.value = "";
                inpSubCategory.value = "";
                txtIssue.value = "";

                // Reset page fields from active Stella Connect review
                inpInteractionId.value = getInteractionId() || "";
                inpDuration.value = getCallDuration() || "";
                inpDateInteraction.value = getInteractionDateFromPage() || "";
                resetAniDropdown();
            }
        } else {
            selectedAssignmentId = "";
            duplicateWarningBox.style.display = "none";
            duplicateWarningBox.innerHTML = "";
            existingRecordId = null;
            resetRubricToDefaults();

            inpCaseNo.value = "";
            inpCategory.value = "";
            inpSubCategory.value = "";
            txtIssue.value = "";
            inpInteractionId.value = getInteractionId() || "";
            inpDuration.value = getCallDuration() || "";
            inpDateInteraction.value = getInteractionDateFromPage() || "";
            resetAniDropdown();

            renderNoAgentSelectedPlaceholder();
        }
    };

    // When an agent is chosen from the dropdown:
    addListener(selAgent, "change", function(e){
        handleAgentSelectionChange(selAgent.selectedOptions[0]);
    });

    // When Date of Evaluation changes:
    addListener(inpDateEvaluation, "change", function(){
        updateAgentDropdown();

        // Trigger selection handler for newly selected option
        var selectedOpt = selAgent.selectedOptions[0];
        handleAgentSelectionChange(selectedOpt);

        // Check if selected date is outside 2-month window
        var selDate = inpDateEvaluation.value;
        if (!selDate) return;
        var parts = selDate.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // 0-indexed

        var monthKey = year + '-' + month;
        idb.get('month_' + monthKey).then(function(cachedMonth){
            if (!cachedMonth && API_BASE_URL) {
                // Fetch this month on-demand (past or future)
                showLoading("Fetching assignments for " + selDate + "...");
                var url = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                          'api=1&action=get_month_data&token=' + encodeURIComponent(API_TOKEN) +
                          '&year=' + year + '&month=' + (month + 1) +
                          '&qa_email=' + encodeURIComponent(QA_EMAIL);
                fetch(url)
                    .then(function(res){ return res.json(); })
                    .then(function(mRes){
                        if (mRes.success && Array.isArray(mRes.assignments)) {
                            idb.set('month_' + monthKey, mRes.assignments);
                            // Merge into globalAssignments
                            mRes.assignments.forEach(function(ma){
                                if (!globalAssignments.some(function(ga){ return ga.id === ma.id; })) {
                                    globalAssignments.push(ma);
                                }
                            });
                            updateAgentDropdown();
                            handleAgentSelectionChange(selAgent.selectedOptions[0]);
                            showToast("Loaded assignments for " + selDate, false);
                        }
                    })
                    .catch(function(){})
                    .finally(function(){ hideLoading(); });
            }
        });
    });

    // --- Save to Google Sheets API ---
    var saveRecord = function() {
        if (!selectedAssignmentId && (!selAgent || !selAgent.value)) {
            showToast("Please select an Agent first!", true);
            return Promise.reject(new Error("No agent selected"));
        }
        if (!API_BASE_URL) {
            showToast("API URL not configured! Open ⚙️ Settings", true);
            showSettingsModal();
            return Promise.reject(new Error("API URL not configured"));
        }

        // Build Section-based Evaluation Details:
        // Format: { "Section Name": [ { question, selected, points, feedback, feedbackText, feedbackChips } ] }
        var rawSections = [];
        if (currentRubric) {
            if (Array.isArray(currentRubric.sections)) {
                rawSections = currentRubric.sections;
            } else if (Array.isArray(currentRubric.structure)) {
                rawSections = currentRubric.structure;
            } else if (typeof currentRubric.structure === 'string') {
                try { rawSections = JSON.parse(currentRubric.structure); } catch(e) {}
            }
        }
        if (rawSections.length === 0 && DEFAULT_FALLBACK_RUBRIC && Array.isArray(DEFAULT_FALLBACK_RUBRIC.sections)) {
            rawSections = DEFAULT_FALLBACK_RUBRIC.sections;
        }

        var details = {};
        rawSections.forEach(function(sec, secIdx){
            var secName = sec.name || sec.title || ("Section " + (secIdx + 1));
            details[secName] = [];
            (sec.items || []).forEach(function(item, itemIdx){
                var keyColon = secIdx + ":" + itemIdx;
                var keyUnderscore = secIdx + "_" + itemIdx;
                var s = state[keyColon] || state[keyUnderscore];
                if (!s) return;

                var selectedOption = s.options.find(function(o){ return o.id === s.sel; });
                var pts = selectedOption ? Number(selectedOption.points || 0) : 0;
                var selLabel = selectedOption ? (selectedOption.label || selectedOption.text || '') : '';
                var fbText = (s.text || '').trim();

                var entry = {
                    question: item.question || item.title || item.shortName || ('Question ' + (itemIdx + 1)),
                    selected: selLabel,
                    points: pts,
                    feedback: fbText,
                    feedbackText: fbText,
                    checked: !!(s.checked)
                };

                var chipLabels = (s.selectedTags || []).map(function(t){
                    return t.buttonLabel || t.button_label || t.tagLabel || t.tag_label || '';
                }).filter(Boolean);
                if (chipLabels.length > 0) {
                    entry.feedbackChips = chipLabels;
                }
                details[secName].push(entry);
            });
        });

        var scoreResult = computeRubricScore();
        var finalScorePercentage = scoreResult.score;

        // Resolve advocate name & snapshot
        var selectedOpt = selAgent.selectedOptions[0];
        var resolvedAgentName = (selectedOpt && selectedOpt.dataset.agentName) ? selectedOpt.dataset.agentName : getAdvocateNameFromPage();
        var selectedAsg = selectedAssignmentId ? globalAssignments.find(function(a){ return a.id === selectedAssignmentId; }) : null;
        var agentSnap = selectedAsg && selectedAsg.agentSnapshot ? (typeof selectedAsg.agentSnapshot === 'string' ? JSON.parse(selectedAsg.agentSnapshot) : selectedAsg.agentSnapshot) : null;

        var resolvedQaName = currentQaDisplayName || formatEmailToName(QA_EMAIL) || QA_EMAIL;

        var payload = {
            action: 'submit_evaluation',
            token: API_TOKEN,
            qaEmail: QA_EMAIL,
            evaluationData: {
                interactionId: inpInteractionId.value.trim(),
                agentName: resolvedAgentName,
                agentEmail: (selectedAsg && selectedAsg.agentEmail) || '',
                agentSnapshot: agentSnap,
                qaName: resolvedQaName,
                evaluationType: (selEvalType && selEvalType.value) ? selEvalType.value : ((selectedAsg && selectedAsg.evaluationType) || 'Standard'),
                callAniDnis: selAni.value ? selAni.value.trim() : "",
                caseNo: inpCaseNo.value.trim(),
                callDuration: inpDuration.value.trim(),
                dateOfInteraction: inpDateInteraction.value,
                evaluationDate: inpDateEvaluation.value,
                caseCategory: inpCategory.value.trim(),
                caseSubCategory: inpSubCategory.value.trim(),
                issueConcern: txtIssue.value.trim(),
                rubricId: (currentRubric && currentRubric.id) || '',
                assignmentId: selectedAssignmentId || '',
                score: finalScorePercentage,
                details: details,
                pageUrl: window.location.href
            }
        };

        return fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        })
        .then(function(res){ return res.json(); })
        .then(function(data){
            if(data.success) {
                existingRecordId = data.evaluationId || data.submission_id;
                // Mark assignment completed locally
                if (selectedAssignmentId) {
                    var asg = globalAssignments.find(function(a){ return a.id === selectedAssignmentId; });
                    if (asg) asg.status = 'Completed';
                    updateAgentDropdown();
                }
                return true;
            }
            throw new Error(data.message || data.error || "Save failed");
        });
    };

    // --- Unified Evaluation Record Populator ---
    var populateEvaluationRecord = function(record, asg) {
        if (!record) return;
        existingRecordId = record.id;

        if (!asg && record.assignmentId) {
            asg = globalAssignments.find(function(a){ return String(a.id) === String(record.assignmentId); });
        }
        if (!asg && record.agentEmail) {
            asg = globalAssignments.find(function(a){ return (a.agentEmail || '').toLowerCase() === String(record.agentEmail || '').toLowerCase(); });
        }

        var evalDate = "";
        if (asg && asg.date) {
            evalDate = normalizeDateStr(asg.date);
        } else {
            evalDate = normalizeDateStr(record.dateOfEvaluation || record.evaluationDate || record.submittedAt || record.date || "");
        }

        var qaName = record.qaName || record.qaEmail || "another QA";
        var score = (record.score !== undefined && record.score !== null && record.score !== "") ? (" • Score: " + record.score + "%") : "";

        // Display Duplicate Warning Banner
        duplicateWarningBox.style.display = "block";
        duplicateWarningBox.innerHTML = "⚠️ <strong>Existing Completed Evaluation</strong><br>Evaluated on " + (evalDate || "previous date") + " by " + qaName + score + ". All details loaded below.";
        showToast("ℹ️ Loaded existing evaluation data from database", false);

        // 1. Auto-populate Date of Evaluation to match completed entry
        if (evalDate) {
            inpDateEvaluation.value = evalDate;
            if (asg) selectedAssignmentId = asg.id;
            updateAgentDropdown();
        }

        // 2. Automatically select the Agent's Name in dropdown
        var snap = null;
        if (record.agentSnapshot) {
            try {
                snap = typeof record.agentSnapshot === 'string' ? JSON.parse(record.agentSnapshot) : record.agentSnapshot;
            } catch(e) { snap = null; }
        }

        var targetEmail = String(record.agentEmail || (snap && (snap.toasttabEmail || snap.internalIbexEmail)) || (asg && asg.agentEmail) || '').trim().toLowerCase();
        var targetName = formatToDisplayName((snap && (snap.displayName || snap.fullName)) || record.agentName || '').trim().toLowerCase();
        var rawRecordName = String(record.agentName || '').trim().toLowerCase();

        var foundAgentIdx = -1;
        for (var oi = 0; oi < selAgent.options.length; oi++) {
            var opt = selAgent.options[oi];
            var optEmail = String(opt.dataset.agentEmail || '').trim().toLowerCase();
            var optName = String(opt.dataset.agentName || opt.textContent || '').trim().toLowerCase();
            var optAsgId = String(opt.dataset.asgId || '');

            if (asg && optAsgId && optAsgId === asg.id) {
                foundAgentIdx = oi;
                break;
            }
            if (targetEmail && optEmail === targetEmail) {
                foundAgentIdx = oi;
                break;
            }
            if (targetName && (optName === targetName || optName.includes(targetName) || targetName.includes(optName))) {
                foundAgentIdx = oi;
                break;
            }
            if (rawRecordName && (optName === rawRecordName || optName.includes(rawRecordName) || rawRecordName.includes(optName))) {
                foundAgentIdx = oi;
                break;
            }
        }

        if (foundAgentIdx !== -1) {
            selAgent.selectedIndex = foundAgentIdx;
            selectedAssignmentId = selAgent.options[foundAgentIdx].dataset.asgId || (asg && asg.id) || "";
        } else {
            var dispName = (snap && (snap.displayName || formatToDisplayName(snap.fullName))) || formatToDisplayName(record.agentName) || record.agentName || record.agentEmail || "Assigned Agent";
            var existingAgentOpt = Array.from(selAgent.options).find(function(o){
                var oName = String(o.dataset.agentName || o.textContent || '').trim().toLowerCase();
                var oEmail = String(o.dataset.agentEmail || '').trim().toLowerCase();
                return (targetEmail && oEmail === targetEmail) || (dispName && oName === dispName.toLowerCase());
            });
            if (!existingAgentOpt) {
                var newOpt = createElement("option");
                newOpt.value = "db:" + (targetEmail || record.agentName || "agent");
                newOpt.textContent = dispName;
                newOpt.dataset.agentName = dispName;
                newOpt.dataset.agentEmail = targetEmail;
                newOpt.dataset.rubricId = record.rubricId || "";
                newOpt.dataset.evalType = record.evaluationType || "Standard";
                selAgent.appendChild(newOpt);
                existingAgentOpt = newOpt;
            }
            existingAgentOpt.selected = true;
            selAgent.value = existingAgentOpt.value;
        }

        // 3. Auto-populate all header fields
        if(record.interactionId) inpInteractionId.value = record.interactionId;
        if(record.caseNo) inpCaseNo.value = record.caseNo;
        if(record.callDuration !== undefined && record.callDuration !== null && record.callDuration !== '') inpDuration.value = record.callDuration;
        if(record.callAniDnis && selAni) {
            resetAniDropdown();
            var rawAni = String(record.callAniDnis).trim();
            if (selAni.tagName === 'SELECT') {
                var hasAniOpt = Array.from(selAni.options).some(function(o){
                    return o.value.trim().toLowerCase() === rawAni.toLowerCase();
                });
                if (!hasAniOpt) {
                    var aniOpt = createElement("option");
                    aniOpt.value = rawAni;
                    aniOpt.textContent = rawAni;
                    selAni.appendChild(aniOpt);
                }
                var matchedAniOpt = Array.from(selAni.options).find(function(o){
                    return o.value.trim().toLowerCase() === rawAni.toLowerCase();
                });
                if (matchedAniOpt) {
                    selAni.value = matchedAniOpt.value;
                }
            } else {
                selAni.value = rawAni;
            }
        }
        if(record.dateOfInteraction) {
            inpDateInteraction.value = normalizeDateStr(record.dateOfInteraction);
        }
        if(record.caseCategory) inpCategory.value = record.caseCategory;
        if(record.caseSubCategory) inpSubCategory.value = record.caseSubCategory;
        if(record.issueConcern) txtIssue.value = record.issueConcern;
        if(record.evaluationType && selEvalType) {
            var rawEt = String(record.evaluationType).trim();
            var hasEtOpt = Array.from(selEvalType.options).some(function(o){
                return o.value.trim().toLowerCase() === rawEt.toLowerCase();
            });
            if (!hasEtOpt) {
                var etOpt = createElement("option");
                etOpt.value = rawEt;
                etOpt.textContent = rawEt;
                selEvalType.appendChild(etOpt);
            }
            var matchedEtOpt = Array.from(selEvalType.options).find(function(o){
                return o.value.trim().toLowerCase() === rawEt.toLowerCase();
            });
            if (matchedEtOpt) {
                selEvalType.value = matchedEtOpt.value;
            }
        }

        // 4. Switch Rubric if needed
        var targetRubricId = record.rubricId || (asg && asg.rubricId) || (currentRubric && currentRubric.id);
        if (targetRubricId && currentRubric && String(currentRubric.id) !== String(targetRubricId)) {
            switchRubricById(targetRubricId);
        }

        // 5. Restore Rubric answers, selected feedback chips, and feedback text
        if (record.evaluationDetails) {
            try {
                var details = typeof record.evaluationDetails === 'string' ? JSON.parse(record.evaluationDetails) : record.evaluationDetails;
                var normalizeStr = function(str) {
                    return String(str || '')
                        .replace(/^\d+\.\s*/, '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '');
                };

                if (typeof details === 'object' && details !== null && !Array.isArray(details)) {
                    Object.keys(details).forEach(function(secName){
                        var sItems = details[secName];
                        if (!Array.isArray(sItems)) return;
                        var secNorm = normalizeStr(secName);

                        sItems.forEach(function(it, itIdx){
                            var itQNorm = normalizeStr(it.question || it.title || it.shortName || '');
                            if (!itQNorm) return;

                            // Step 1: Find best matching item in state
                            // Priority 1: Match BOTH Section Name AND Question Name
                            var matchedKey = Object.keys(state).find(function(k){
                                var sObj = state[k];
                                if (!sObj) return false;
                                var sSecNorm = normalizeStr(sObj.sectionName || sObj.groupName || '');
                                var sQNorm = normalizeStr(sObj.question || sObj.cleanQuestion || '');
                                return (sSecNorm === secNorm || sSecNorm.includes(secNorm) || secNorm.includes(sSecNorm)) &&
                                       (sQNorm === itQNorm || sQNorm.includes(itQNorm) || itQNorm.includes(sQNorm));
                            });

                            // Priority 2: Match Question Name anywhere across state
                            if (!matchedKey) {
                                matchedKey = Object.keys(state).find(function(k){
                                    var sObj = state[k];
                                    if (!sObj) return false;
                                    var sQNorm = normalizeStr(sObj.question || sObj.cleanQuestion || '');
                                    return sQNorm === itQNorm || (itQNorm.length > 5 && (sQNorm.includes(itQNorm) || itQNorm.includes(sQNorm)));
                                });
                            }

                            // Priority 3: Match by Section Name + Item Index
                            if (!matchedKey) {
                                matchedKey = Object.keys(state).find(function(k){
                                    var sObj = state[k];
                                    if (!sObj) return false;
                                    var sSecNorm = normalizeStr(sObj.sectionName || sObj.groupName || '');
                                    return (sSecNorm === secNorm || sSecNorm.includes(secNorm) || secNorm.includes(sSecNorm)) && sObj.itemIdx === itIdx;
                                });
                            }

                            if (!matchedKey || !state[matchedKey]) return;
                            var sItem = state[matchedKey];

                            // Step 2: Match Option / Answer
                            var itSelRaw = String(it.selected || it.answerId || '').trim();
                            var itSelNorm = normalizeStr(itSelRaw);

                            var matchedOpt = sItem.options.find(function(o){
                                var oLabelNorm = normalizeStr(o.label || o.text || '');
                                var oIdNorm = normalizeStr(o.id || '');
                                return oLabelNorm === itSelNorm || oIdNorm === itSelNorm;
                            });

                            if (!matchedOpt) {
                                matchedOpt = sItem.options.find(function(o){
                                    var oLabelNorm = normalizeStr(o.label || o.text || '');
                                    return (oLabelNorm && itSelNorm && (oLabelNorm.includes(itSelNorm) || itSelNorm.includes(oLabelNorm)));
                                });
                            }

                            if (matchedOpt) {
                                sItem.sel = matchedOpt.id;
                                sItem.selIndex = sItem.options.indexOf(matchedOpt);
                            }

                            // Step 3: Restore Checkbox
                            if (it.checked !== undefined) {
                                sItem.checked = (it.checked === true || it.checked === 'true');
                            }

                            // Step 4: Restore Feedback Text
                            sItem.text = it.feedbackText || it.feedback || "";

                            // Step 5: Restore Feedback Chips
                            if (Array.isArray(it.feedbackChips) && it.feedbackChips.length > 0) {
                                sItem.selectedTags = it.feedbackChips.map(function(chipLabel){
                                    var existing = globalFeedbackTags.find(function(gt){
                                        var gtLabel = gt.buttonLabel || gt.button_label || gt.tagLabel || gt.tag_label || '';
                                        return normalizeStr(gtLabel) === normalizeStr(chipLabel);
                                    });
                                    return existing || {
                                        buttonLabel: chipLabel,
                                        text: chipLabel,
                                        id: 'chip_' + chipLabel,
                                        sectionIndex: sItem.secIdx,
                                        itemIndex: sItem.itemIdx,
                                        optionIndex: sItem.selIndex
                                    };
                                });
                            } else {
                                sItem.selectedTags = [];
                            }
                        });
                    });
                    refreshAllUI();
                    updateLiveScore();
                } else if (Array.isArray(details)) {
                    details.forEach(function(rItem){
                        var itQNorm = normalizeStr(rItem.question || rItem.itemId || '');
                        var matchedKey = Object.keys(state).find(function(k){
                            var sObj = state[k];
                            if (!sObj) return false;
                            return sObj.id === rItem.itemId || normalizeStr(sObj.question) === itQNorm;
                        });

                        if(matchedKey && state[matchedKey]) {
                            var sItem = state[matchedKey];
                            var itSelNorm = normalizeStr(rItem.answerId || rItem.selected || '');
                            var matchedOpt = sItem.options.find(function(o){
                                return normalizeStr(o.label || o.id) === itSelNorm;
                            });
                            if (matchedOpt) {
                                sItem.sel = matchedOpt.id;
                                sItem.selIndex = sItem.options.indexOf(matchedOpt);
                            }
                            sItem.text = rItem.feedbackText || rItem.feedback || "";
                            if (rItem.checked !== undefined) {
                                sItem.checked = (rItem.checked === true || rItem.checked === 'true');
                            }
                            if (Array.isArray(rItem.selectedTags)) {
                                sItem.selectedTags = rItem.selectedTags;
                            }
                        }
                    });
                    refreshAllUI();
                    updateLiveScore();
                }
            } catch(e) {
                console.error("Error restoring evaluation details:", e);
            }
        }
    };

    // Check for previous evaluation by Interaction ID or Assignment ID
    var checkExistingRecord = function(params) {
        params = params || {};
        var iId = params.interactionId || inpInteractionId.value.trim();
        var asgId = params.assignmentId || "";

        if(!iId && !asgId) {
            duplicateWarningBox.style.display = "none";
            return;
        }
        if(!API_BASE_URL) return;

        var url = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                  'api=1&action=check_existing&token=' + encodeURIComponent(API_TOKEN) +
                  (iId ? ('&interaction_id=' + encodeURIComponent(iId)) : '') +
                  (asgId ? ('&assignment_id=' + encodeURIComponent(asgId)) : '');

        fetch(url)
            .then(function(res){ return res.json(); })
            .then(function(result){
                if(result.success && result.data) {
                    populateEvaluationRecord(result.data);
                } else {
                    duplicateWarningBox.style.display = "none";
                    duplicateWarningBox.innerHTML = "";
                }
            })
            .catch(function(err){
                console.warn("checkExistingRecord error:", err);
            });
    };

    addListener(inpInteractionId, 'blur', checkExistingRecord);
    var idDebounceTimer = null;
    addListener(inpInteractionId, 'input', function(){
        clearTimeout(idDebounceTimer);
        idDebounceTimer = setTimeout(checkExistingRecord, 800);
    });

    // --- DOM Interaction & Generation ---
    var findGroupContainer = function(name) {
        var h2s = Array.from(document.querySelectorAll('h2'));
        var h2 = h2s.find(function(el){ return el.textContent.trim().toLowerCase().includes(name.toLowerCase()); });
        return h2 ? h2.closest('.padding-xlarge') : null;
    };

    var handleGeneration = function(saveToDb) {
        if (!selectedAssignmentId && (!selAgent || !selAgent.value)) {
            showToast("Please select an Agent first!", true);
            return;
        }

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

    scoreBadge = createElement("div");
    scoreBadge.style.cssText = "margin-right:auto;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;display:flex;align-items:center;gap:6px;transition:all 0.2s;background:#dcfce7;color:#15803d;border:1px solid #86efac";
    scoreBadge.innerHTML = "<span>Score: <strong>100.00%</strong></span>";
    footer.appendChild(scoreBadge);

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

    // --- Settings Modal ---
    var showSettingsModal = function(isMandatory) {
        if (document.getElementById('qa-settings-modal-overlay')) return;

        var pOverlay = createElement("div", sOverlay + "; z-index:100002; background:rgba(0,0,0,0.45); pointer-events:auto; align-items:center");
        pOverlay.id = "qa-settings-modal-overlay";
        var pModal = createElement("div", sModal + "; height:auto; max-height:85vh; width:500px; cursor:default; user-select:auto; box-shadow:0 20px 40px rgba(0,0,0,0.3); border:1px solid #cbd5e1;");
        var pHeader = createElement("div", sHeader + "; cursor:grab; border-radius:8px 8px 0 0; background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:12px 18px;");
        pHeader.innerHTML = "<span style='font-size:15px;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:6px;'>⚙️ <span>Configure Settings</span></span>";

        var pClose = createElement("span", "cursor:pointer;font-size:20px;color:#94a3b8;line-height:1;font-weight:400;padding:2px 6px;border-radius:4px;transition:all 0.15s");
        pClose.textContent = "×";
        addListener(pClose, "mouseenter", function(){ pClose.style.color = "#ef4444"; pClose.style.background = "#fee2e2"; });
        addListener(pClose, "mouseleave", function(){ pClose.style.color = "#94a3b8"; pClose.style.background = "transparent"; });
        addListener(pClose, "click", function(){
            if (isMandatory && !QA_EMAIL) {
                showToast("Please select your QA Account before continuing.", true);
                return;
            }
            pOverlay.remove();
        });
        pHeader.appendChild(pClose);

        makeDraggable(pModal, pHeader);

        var pBody = createElement("div", "padding:18px 20px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:14px;");

        if (isMandatory && !QA_EMAIL) {
            var noticeBox = createElement("div", "background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 12px;color:#1e40af;font-size:12px;line-height:1.4;display:flex;align-items:flex-start;gap:8px;");
            noticeBox.innerHTML = "<span style='font-size:16px'>👋</span><div><strong>Welcome!</strong> Please select your QA Account below to load your assignments and settings.</div>";
            pBody.appendChild(noticeBox);
        }

        // 1. QA Account Selector (dropdown with all users in globalUsers, with in-field icon 👤)
        var grpEmail = createElement("div");
        var lblEmail = createElement("label", sLabel);
        lblEmail.innerHTML = "<span>QA Account</span> <span style='color:#ef4444'>*</span>";
        grpEmail.appendChild(lblEmail);

        var selEmail = createElement("select", sSelect);
        selEmail.innerHTML = "<option value=''>Select your QA Account...</option>";
        if (globalUsers && globalUsers.length > 0) {
            globalUsers.forEach(function(u){
                var opt = createElement("option");
                opt.value = u.email;
                var uName = u.name || formatEmailToName(u.email);
                opt.textContent = uName + " (" + u.email + ")";
                if (QA_EMAIL && u.email.toLowerCase() === QA_EMAIL.toLowerCase()) {
                    opt.selected = true;
                }
                selEmail.appendChild(opt);
            });
        }
        if (QA_EMAIL && !Array.from(selEmail.options).some(function(o){ return o.value.toLowerCase() === QA_EMAIL.toLowerCase(); })) {
            var optCustom = createElement("option");
            optCustom.value = QA_EMAIL;
            optCustom.textContent = formatEmailToName(QA_EMAIL) + " (" + QA_EMAIL + ")";
            optCustom.selected = true;
            selEmail.appendChild(optCustom);
        }

        var wrapEmail = createIconFieldWrapper("👤", selEmail, true);
        grpEmail.appendChild(wrapEmail);
        pBody.appendChild(grpEmail);

        // 2. Gemini API Key (with 🔑 in-field icon and ✏️ unlock/edit button)
        var grpKey = createElement("div");
        var lblKey = createElement("label", sLabel);
        lblKey.textContent = "Your Gemini API Key (from Google AI Studio)";
        grpKey.appendChild(lblKey);

        var inpKey = createElement("input", sInput);
        inpKey.type = "password";
        inpKey.placeholder = "Paste your AIzaSy... key";
        inpKey.value = GEMINI_API_KEY;

        var wrapKey = createElement("div", "position:relative;display:flex;align-items:center;width:100%;margin:0;");
        var iconKey = createElement("span", "position:absolute;left:11px;pointer-events:none;font-size:13px;z-index:2;user-select:none;display:inline-flex;align-items:center;justify-content:center;");
        iconKey.textContent = "🔑";

        inpKey.style.paddingLeft = "36px";
        inpKey.style.paddingRight = "36px";
        inpKey.style.boxSizing = "border-box";
        inpKey.style.width = "100%";
        inpKey.style.height = "36px";
        inpKey.style.margin = "0";

        var btnEditKey = createElement("span", "position:absolute;right:10px;cursor:pointer;font-size:14px;user-select:none;z-index:3;opacity:0.75;padding:2px;display:none;");
        btnEditKey.textContent = "✏️";
        btnEditKey.title = "Click to edit/update API key";

        addListener(btnEditKey, "mouseenter", function(){ btnEditKey.style.opacity = "1"; });
        addListener(btnEditKey, "mouseleave", function(){ btnEditKey.style.opacity = "0.75"; });
        addListener(btnEditKey, "click", function(){
            inpKey.readOnly = false;
            inpKey.style.background = "#ffffff";
            inpKey.type = "text";
            btnEditKey.textContent = "🔓";
            btnEditKey.title = "Unlocked for editing";
            inpKey.focus();
        });

        if (GEMINI_API_KEY) {
            inpKey.readOnly = true;
            inpKey.style.background = "#f8fafc";
            btnEditKey.style.display = "inline-flex";
        }

        wrapKey.appendChild(iconKey);
        wrapKey.appendChild(inpKey);
        wrapKey.appendChild(btnEditKey);
        grpKey.appendChild(wrapKey);

        var keyHelp = createElement("div", "font-size:11px;color:#94a3b8;margin-top:3px;");
        keyHelp.textContent = "Saved securely in the database under your user profile.";
        grpKey.appendChild(keyHelp);
        pBody.appendChild(grpKey);

        // When QA Account changes in dropdown: update API key if known
        addListener(selEmail, "change", function(){
            var chosenEmail = selEmail.value.trim().toLowerCase();
            if (chosenEmail && globalUsers && globalUsers.length > 0) {
                var chosenUser = globalUsers.find(function(u){ return (u.email || '').toLowerCase() === chosenEmail; });
                if (chosenUser && chosenUser.geminiApiKey) {
                    inpKey.value = chosenUser.geminiApiKey;
                    inpKey.readOnly = true;
                    inpKey.style.background = "#f8fafc";
                    btnEditKey.style.display = "inline-flex";
                    btnEditKey.textContent = "✏️";
                }
            }
        });

        // 3. Gemini Model Selector (dropdown populated from globalGeminiModels, in-field icon 🤖)
        var grpModel = createElement("div");
        grpModel.appendChild(createElement("label", sLabel)).textContent = "Gemini Model";

        var selModel = createElement("select", sSelect);
        var modelsToUse = (globalGeminiModels && globalGeminiModels.length > 0) ? globalGeminiModels : ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
        modelsToUse.forEach(function(m){
            var opt = createElement("option");
            opt.value = m;
            opt.textContent = m;
            if (m === (GEMINI_MODEL || DEFAULT_GEMINI_MODEL)) {
                opt.selected = true;
            }
            selModel.appendChild(opt);
        });

        var wrapModel = createIconFieldWrapper("🤖", selModel, true);
        grpModel.appendChild(wrapModel);
        pBody.appendChild(grpModel);

        // Footer
        var pFooter = createElement("div", sFooter);
        var pBtnSave = createElement("button", sBtnGenerate);
        pBtnSave.textContent = "Save Settings";
        pBtnSave.style.cssText = "padding:8px 18px;border:none;background:#2563eb;color:white;border-radius:5px;cursor:pointer;font-size:13px;font-weight:600;box-shadow:0 1px 3px rgba(37,99,235,0.3);";

        addListener(pBtnSave, "click", function(){
            var newEmail = selEmail.value.trim();
            if (!newEmail) {
                showToast("Please select your QA Account.", true);
                return;
            }

            pBtnSave.disabled = true;
            pBtnSave.textContent = "Saving...";

            QA_EMAIL = newEmail;
            GEMINI_API_KEY = inpKey.value.trim();
            GEMINI_MODEL = selModel.value.trim() || DEFAULT_GEMINI_MODEL;

            storage.set('qa_email', QA_EMAIL);
            storage.set('gemini_key', GEMINI_API_KEY);
            storage.set('gemini_model', GEMINI_MODEL);
            storage.set('last_sync_ts', '');

            updateHeaderTitle();

            // Save to backend database for persistence
            var savePayload = {
                action: 'save_user_gemini_config',
                token: API_TOKEN,
                qaEmail: QA_EMAIL,
                geminiApiKey: GEMINI_API_KEY,
                geminiModel: GEMINI_MODEL
            };

            fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(savePayload)
            }).then(function(res){ return res.json(); }).catch(function(){});

            showToast("Settings saved!", false);
            pOverlay.remove();
            checkAndSyncData(true);
        });

        pFooter.appendChild(pBtnSave);

        pModal.appendChild(pHeader);
        pModal.appendChild(pBody);
        pModal.appendChild(pFooter);
        pOverlay.appendChild(pModal);
        document.body.appendChild(pOverlay);
    };

    // --- Sync & Initialization Logic (Bulk Processing & Local IndexedDB Storage) ---
    var checkAndSyncData = function(forceRefresh) {
        showLoading("Loading Toast QA Data...");

        // 1. Bulk restore from IndexedDB immediately (instant 0ms startup!)
        idb.get('cached_payload').then(function(cached){
            if (cached && !forceRefresh) {
                allRubrics = (cached.rubrics && cached.rubrics.length > 0) ? cached.rubrics : [DEFAULT_FALLBACK_RUBRIC];
                globalAssignments = cached.assignments || [];
                globalFeedbackTags = cached.feedbackChips || [];
                globalFeedbackGeneral = cached.feedbackGeneral || [];
                globalUsers = cached.users || [];
                if (cached.evalTypes && Array.isArray(cached.evalTypes) && cached.evalTypes.length > 0) {
                    globalEvalTypes = cached.evalTypes;
                    updateEvalTypesDropdown();
                }
                if (cached.geminiModels && Array.isArray(cached.geminiModels) && cached.geminiModels.length > 0) {
                    globalGeminiModels = cached.geminiModels;
                }
                if (cached.userGeminiApiKey && !GEMINI_API_KEY) {
                    GEMINI_API_KEY = cached.userGeminiApiKey;
                    storage.set('gemini_key', GEMINI_API_KEY);
                }
                if (cached.userGeminiModel) {
                    GEMINI_MODEL = cached.userGeminiModel;
                    storage.set('gemini_model', GEMINI_MODEL);
                }
                if (cached.qaName) currentQaDisplayName = cached.qaName;
                if (cached.qaFirstName) qaFirstName = cached.qaFirstName;
                updateHeaderTitle();

                var matchedAuto = autoSelectAssignmentAndDate();
                if (!matchedAuto || !selAgent.value) {
                    renderNoAgentSelectedPlaceholder();
                }
                updateLiveScore();
                hideLoading();
            }

            if (!API_BASE_URL) {
                hideLoading();
                if (!cached) {
                    renderNoAgentSelectedPlaceholder();
                }
                showToast("API URL error", true);
                return;
            }

            // 2. Timestamp check comparing rubrics, feedback, assignments, and SETTINGS
            var syncUrl = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                          'api=1&action=check_sync&token=' + encodeURIComponent(API_TOKEN);

            fetch(syncUrl)
                .then(function(res){ return res.json(); })
                .then(function(syncData){
                    if(!syncData.success) throw new Error(syncData.error || "Sync check failed");

                    var lastTs = storage.get('last_sync_ts', '');
                    var currentTs = syncData.rubricsTimestamp + "_" +
                                    syncData.feedbackTimestamp + "_" +
                                    syncData.assignmentsTimestamp + "_" +
                                    (syncData.settingsTimestamp || '');

                    // If timestamps match and we have cache, STOP HERE! Zero sheet reads!
                    if (!forceRefresh && cached && lastTs === currentTs) {
                        console.log("Toast QA Tool: Cache is up-to-date (0 sheet reads!).");
                        hideLoading();
                        if (!QA_EMAIL) {
                            showSettingsModal(true);
                        }
                        return;
                    }

                    // 3. Bulk fetch ALL data at once from backend
                    showLoading("Bulk syncing Toast QA data with Google Sheets...");
                    var initUrl = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                                  'api=1&action=get_init_data&token=' + encodeURIComponent(API_TOKEN) +
                                  '&qa_email=' + encodeURIComponent(QA_EMAIL);

                    fetch(initUrl)
                        .then(function(res){ return res.json(); })
                        .then(function(data){
                            if(!data.success) throw new Error(data.error || "Failed to fetch data");

                            // Store ALL data bulk payload in IndexedDB for persistent local storage
                            idb.set('cached_payload', data);
                            storage.set('last_sync_ts', currentTs);

                            allRubrics = (data.rubrics && data.rubrics.length > 0) ? data.rubrics : [DEFAULT_FALLBACK_RUBRIC];
                            globalAssignments = data.assignments || [];
                            globalFeedbackTags = data.feedbackChips || [];
                            globalFeedbackGeneral = data.feedbackGeneral || [];
                            globalUsers = data.users || [];
                            if (data.evalTypes && Array.isArray(data.evalTypes) && data.evalTypes.length > 0) {
                                globalEvalTypes = data.evalTypes;
                                updateEvalTypesDropdown();
                            }
                            if (data.geminiModels && Array.isArray(data.geminiModels) && data.geminiModels.length > 0) {
                                globalGeminiModels = data.geminiModels;
                            }
                            if (data.userGeminiApiKey) {
                                GEMINI_API_KEY = data.userGeminiApiKey;
                                storage.set('gemini_key', GEMINI_API_KEY);
                            }
                            if (data.userGeminiModel) {
                                GEMINI_MODEL = data.userGeminiModel;
                                storage.set('gemini_model', GEMINI_MODEL);
                            }
                            if (data.qaName) currentQaDisplayName = data.qaName;
                            if (data.qaFirstName) qaFirstName = data.qaFirstName;
                            updateHeaderTitle();

                            if (!cached) {
                                var matchedAuto = autoSelectAssignmentAndDate();
                                if (!matchedAuto || !selAgent.value) {
                                    renderNoAgentSelectedPlaceholder();
                                }
                            } else {
                                updateAgentDropdown();
                                if (!selAgent.value) {
                                    renderNoAgentSelectedPlaceholder();
                                }
                            }
                            showToast("Bulk synced with latest Google Sheets data!", false);

                            if (!QA_EMAIL) {
                                showSettingsModal(true);
                            }
                        })
                        .catch(function(err){
                            console.error(err);
                            showToast("Could not fetch latest sheets data: " + err.message, true);
                            if (!QA_EMAIL) showSettingsModal(true);
                        })
                        .finally(function(){ hideLoading(); });
                })
                .catch(function(err){
                    console.error(err);
                    hideLoading();
                    if (!cached) {
                        renderNoAgentSelectedPlaceholder();
                        showToast("Loaded Toast QA Rubric (offline mode)", false);
                    }
                    if (!QA_EMAIL) showSettingsModal(true);
                });
        });
    };

    checkAndSyncData(false);
})();