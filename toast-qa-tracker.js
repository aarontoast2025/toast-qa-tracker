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

    var API_BASE_URL = storage.get('api_url', DEFAULT_API_URL);
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
    var sSelect = "width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:5px;margin-bottom:8px;font-size:13px;background:white;cursor:pointer";
    var sTextarea = "width:100%;border:1px solid #cbd5e1;border-radius:5px;padding:8px;font-family:inherit;resize:vertical;height:55px;font-size:13px;box-sizing:border-box";
    var sInput = "width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:5px;font-size:13px;box-sizing:border-box";
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

    var isDragging = false, startX = 0, startY = 0, initialX = 0, initialY = 0;
    var header = createElement("div", sHeader);
    var headerTitle = createElement("span");
    headerTitle.innerHTML = "🍞 <strong>Toast QA Tracker</strong>";
    header.appendChild(headerTitle);

    var toolsContainer = createElement("div", "position:relative;display:flex;align-items:center;gap:8px");

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

    var btnAiTools = createElement("span");
    btnAiTools.textContent = "🛠️";
    btnAiTools.title = "AI Tools";
    btnAiTools.style.cssText = "cursor:pointer;font-size:16px;padding:4px 6px;border-radius:4px;transition:background 0.2s";
    addListener(btnAiTools, "mouseenter", function(){ btnAiTools.style.background = "rgba(0,0,0,0.06)"; });
    addListener(btnAiTools, "mouseleave", function(){ btnAiTools.style.background = "transparent"; });

    var aiToolsMenu = createElement("div");
    aiToolsMenu.style.cssText = "position:absolute;top:100%;right:32px;background:white;border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.12);display:none;flex-direction:column;min-width:180px;z-index:100001;margin-top:6px;overflow:hidden";

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
    };

    // Hook options to aiToolsMenu
    aiToolsMenu.appendChild(createMenuItem("📝 Case Notes Checker", showCaseNotesCheckerModal, aiToolsMenu));
    aiToolsMenu.appendChild(createMenuItem("💬 Chat Checker", showChatCheckerModal, aiToolsMenu));

    toolsContainer.appendChild(btnAiTools);
    toolsContainer.appendChild(aiToolsMenu);
    toolsContainer.appendChild(btnTools);
    toolsContainer.appendChild(toolsMenu);
    header.appendChild(toolsContainer);

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
    // User requested: "Before the Interaction ID, place the Agent's Name dropdown"
    var headerFieldsContainer = createElement("div");
    headerFieldsContainer.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #e2e8f0";

    var createFieldWrapper = function(label, element, fullWidth) {
        var wrap = createElement("div");
        if (fullWidth) wrap.style.gridColumn = "1 / -1";
        var lbl = createElement("label", sLabel);
        lbl.textContent = label;
        wrap.appendChild(lbl);
        wrap.appendChild(element);
        return wrap;
    };

    // 1. Agent's Name Dropdown (BEFORE Interaction ID)
    var selAgent = createElement("select", sSelect);
    selAgent.innerHTML = "<option value=''>-- Select Assigned Agent --</option>";
    var wrapAgent = createFieldWrapper("👤 Agent's Name", selAgent);

    // 2. Interaction ID
    var inpInteractionId = createElement("input", sInput);
    inpInteractionId.placeholder = "Interaction ID...";
    inpInteractionId.value = getInteractionId();
    var wrapInteractionId = createFieldWrapper("🆔 Interaction ID", inpInteractionId);

    var duplicateWarningBox = createElement("div");
    duplicateWarningBox.style.cssText = "display:none;background:#fef2f2;border:1px solid #ef4444;border-radius:5px;padding:6px 10px;margin-top:6px;color:#991b1b;font-size:11px;font-weight:600;line-height:1.4";
    wrapInteractionId.appendChild(duplicateWarningBox);

    // 3. Call ANI / DNIS
    var aniOpts = getAniDnisOptions();
    var defaultAni = (aniOpts.length > 1) ? aniOpts[1] : (aniOpts[0] || "");
    var selAni;
    if (aniOpts.length > 0) {
        selAni = createElement("select", sSelect);
        aniOpts.forEach(function(o){
            var opt = createElement("option");
            opt.value = o; opt.textContent = o;
            if (o === defaultAni) opt.selected = true;
            selAni.appendChild(opt);
        });
    } else {
        selAni = createElement("input", sInput);
        selAni.placeholder = "ANI / DNIS...";
    }
    var wrapAni = createFieldWrapper("📞 Call ANI/DNIS", selAni);

    headerFieldsContainer.appendChild(wrapAgent);
    headerFieldsContainer.appendChild(wrapInteractionId);
    headerFieldsContainer.appendChild(wrapAni);

    // Case # & Call Duration Row
    var caseDurationRow = createElement("div", "grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;");
    var inpCaseNo = createElement("input", sInput);
    inpCaseNo.placeholder = "Case #...";
    var inpDuration = createElement("input", sInput);
    inpDuration.placeholder = "Call Duration (sec)...";
    inpDuration.value = getCallDuration();
    caseDurationRow.appendChild(createFieldWrapper("🔢 Case #", inpCaseNo));
    caseDurationRow.appendChild(createFieldWrapper("⏱️ Call Duration", inpDuration));
    headerFieldsContainer.appendChild(caseDurationRow);

    // Date Row: Date of Interaction & Date of Evaluation (Equivalent to Assignments Date)
    var dateRow = createElement("div", "grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;");
    var inpDateInteraction = createElement("input", sInput);
    inpDateInteraction.type = "date";
    var inpDateEvaluation = createElement("input", sInput);
    inpDateEvaluation.type = "date";
    function getLocalDateString(d) {
        d = d || new Date();
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }
    inpDateEvaluation.value = getLocalDateString();
    dateRow.appendChild(createFieldWrapper("📅 Date of Interaction", inpDateInteraction));
    dateRow.appendChild(createFieldWrapper("📅 Date of Evaluation", inpDateEvaluation));
    headerFieldsContainer.appendChild(dateRow);

    // Category & Sub-Category Row
    var categoryRow = createElement("div", "grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;");
    var inpCategory = createElement("input", sInput);
    inpCategory.placeholder = "Category (e.g. Payroll, POS)...";
    var inpSubCategory = createElement("input", sInput);
    inpSubCategory.placeholder = "Sub-Category (e.g. Direct Deposit)...";
    categoryRow.appendChild(createFieldWrapper("🗂️ Category", inpCategory));
    categoryRow.appendChild(createFieldWrapper("📂 Sub-Category", inpSubCategory));
    headerFieldsContainer.appendChild(categoryRow);

    // Issue / Concern with ✨ Gemini Summary button
    var txtIssue = createElement("textarea", sTextarea);
    txtIssue.placeholder = "Issue / Concern description...";
    var issueBox = createElement("div", "position:relative");
    var btnSummary = createElement("span");
    btnSummary.textContent = "✨";
    btnSummary.title = "Generate Summary from Transcript using Gemini AI";
    btnSummary.style.cssText = "position:absolute;right:8px;top:8px;cursor:pointer;font-size:16px;opacity:0.7;user-select:none;z-index:5";
    issueBox.appendChild(txtIssue);
    issueBox.appendChild(btnSummary);
    headerFieldsContainer.appendChild(createFieldWrapper("✍️ Issue/Concern", issueBox, true));

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
        if(!s || !s.domTextarea) return;

        var txt = "";
        var cleanText = function(t) { return (t || "").replace(/\s*Source:[\s\S]*$/i, "").trim(); };

        if(s.selectedTags && s.selectedTags.length > 0) {
            txt = s.selectedTags.map(function(t){ return cleanText(t.feedbackText || t.feedback_text); }).join(" ");
        } else {
            var genFeedback = globalFeedbackGeneral.find(function(f){
                return (f.sectionIndex === s.secIdx || f.section_index === s.secIdx) &&
                       (f.itemIndex === s.itemIdx || f.item_index === s.itemIdx) &&
                       (f.optionIndex === s.selIndex || f.option_index === s.selIndex);
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
                    renderTags();
                    updateHeaderBg();
                };

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

        if(inpInteractionId.value) checkExistingRecord();
    };

    // --- Switch Rubric when Assignment is Selected ---
    var switchRubricById = function(rubricId) {
        if (!rubricId) return;
        var found = allRubrics.find(function(r){ return String(r.id) === String(rubricId); });
        if (found) {
            console.log("Switching to Rubric:", found.name, "(ID: " + rubricId + ")");
            renderRubric(found, globalFeedbackTags, globalFeedbackGeneral);
            showToast("Switched to Rubric: " + found.name, false);
        }
    };

    // --- Populate Agent Dropdown based on Date of Evaluation ---
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
        var namePart = email.split('@')[0];
        return namePart.split('.').map(function(part){
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join(' ');
    };

    var updateAgentDropdown = function() {
        var selectedDate = inpDateEvaluation.value; // YYYY-MM-DD
        selAgent.innerHTML = "";

        var defaultOpt = createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "-- Select Assigned Agent --";
        selAgent.appendChild(defaultOpt);

        var pageAdvocateName = getAdvocateNameFromPage().toLowerCase();

        var formatToDisplayName = function(name) {
            if (!name) return "";
            var str = String(name).trim();
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

        var resolveName = function(a) {
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

        var normSelectedDate = normalizeDateStr(selectedDate);

        // Filter assignments strictly matching the selected Date of Evaluation
        var dateAssignments = globalAssignments.filter(function(a){
            return normalizeDateStr(a.date) === normSelectedDate;
        });

        if (dateAssignments.length > 0) {
            dateAssignments.forEach(function(a){
                var opt = createElement("option");
                opt.value = "asg:" + a.id;
                var agentLabel = resolveName(a);
                opt.textContent = agentLabel + (a.status === 'Completed' ? ' [✓ Done]' : '');
                opt.dataset.rubricId = a.rubricId || "";
                opt.dataset.agentName = agentLabel;
                opt.dataset.asgId = a.id;

                if (pageAdvocateName && agentLabel.toLowerCase().includes(pageAdvocateName)) {
                    opt.selected = true;
                    selectedAssignmentId = a.id;
                }
                selAgent.appendChild(opt);
            });
        } else {
            var optNone = createElement("option");
            optNone.disabled = true;
            optNone.textContent = "(No assignments for " + selectedDate + ")";
            selAgent.appendChild(optNone);
        }

        // Custom / Unassigned Advocate option directly at the bottom
        var optCustom = createElement("option");
        optCustom.value = "custom";
        optCustom.textContent = "✏️ Custom / Unassigned Advocate";
        selAgent.appendChild(optCustom);
    };

    // When an agent is chosen from the dropdown:
    addListener(selAgent, "change", function(e){
        var val = e.target.value;
        var selectedOpt = selAgent.selectedOptions[0];

        if (val && val.startsWith("asg:")) {
            selectedAssignmentId = selectedOpt.dataset.asgId || "";
            var rubricId = selectedOpt.dataset.rubricId || "";
            var agentName = selectedOpt.dataset.agentName || "";

            // Switch to that assignment's Rubric ID
            if (rubricId) {
                switchRubricById(rubricId);
            }
        } else {
            selectedAssignmentId = "";
        }
    });

    // When Date of Evaluation changes:
    addListener(inpDateEvaluation, "change", function(){
        updateAgentDropdown();

        // Check if selected date is outside 2-month window
        var selDate = inpDateEvaluation.value;
        if (!selDate) return;
        var parts = selDate.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // 0-indexed

        var monthKey = year + '-' + month;
        idb.get('month_' + monthKey).then(function(cachedMonth){
            if (!cachedMonth && API_BASE_URL) {
                // Fetch this month on-demand
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
        if (!API_BASE_URL) {
            showToast("API URL not configured! Open ⚙️ Settings", true);
            showSettingsModal();
            return Promise.reject(new Error("API URL not configured"));
        }

        // Build Section-based Evaluation Details:
        // Format: { "Section Name": [ { question, selected, points, feedback, feedbackText, feedbackChips } ] }
        var details = {};
        if (currentRubric && Array.isArray(currentRubric.sections)) {
            currentRubric.sections.forEach(function(sec, secIdx){
                var secName = sec.name || sec.title || ("Section " + (secIdx + 1));
                details[secName] = [];
                (sec.items || []).forEach(function(item, itemIdx){
                    var key = secIdx + "_" + itemIdx;
                    var s = state[key];
                    if (!s) return;
                    var selectedOption = s.options.find(function(o){ return o.id === s.sel; });
                    var pts = selectedOption ? Number(selectedOption.points || 0) : 0;
                    var selLabel = selectedOption ? (selectedOption.label || selectedOption.text || '') : '';
                    var fbText = (s.text || '').trim();

                    var entry = {
                        question: item.question || item.title || '',
                        selected: selLabel,
                        points: pts,
                        feedback: fbText,
                        feedbackText: fbText
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
        }

        var totalPoints = 0;
        var earnedPoints = 0;
        Object.keys(state).forEach(function(key){
            var s = state[key];
            var opt = s.options.find(function(o){ return o.id === s.sel; });
            if (opt) earnedPoints += Number(opt.points || 0);
        });

        // Resolve advocate name & snapshot
        var selectedOpt = selAgent.selectedOptions[0];
        var resolvedAgentName = (selectedOpt && selectedOpt.dataset.agentName) ? selectedOpt.dataset.agentName : getAdvocateNameFromPage();
        var selectedAsg = selectedAssignmentId ? globalAssignments.find(function(a){ return a.id === selectedAssignmentId; }) : null;
        var agentSnap = selectedAsg && selectedAsg.agentSnapshot ? (typeof selectedAsg.agentSnapshot === 'string' ? JSON.parse(selectedAsg.agentSnapshot) : selectedAsg.agentSnapshot) : null;

        var payload = {
            action: 'submit_evaluation',
            token: API_TOKEN,
            qaEmail: QA_EMAIL,
            evaluationData: {
                interactionId: inpInteractionId.value.trim(),
                agentName: resolvedAgentName,
                agentEmail: (selectedAsg && selectedAsg.agentEmail) || '',
                agentSnapshot: agentSnap,
                qaName: QA_EMAIL,
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
                score: earnedPoints,
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

    // Check for previous evaluation by Interaction ID & Duplicate Search
    var checkExistingRecord = function() {
        var iId = inpInteractionId.value.trim();
        if(!iId || !API_BASE_URL) {
            duplicateWarningBox.style.display = "none";
            return;
        }

        var url = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                  'api=1&action=check_existing&token=' + encodeURIComponent(API_TOKEN) +
                  '&interaction_id=' + encodeURIComponent(iId);

        fetch(url)
            .then(function(res){ return res.json(); })
            .then(function(result){
                if(result.success && result.data) {
                    var record = result.data;
                    existingRecordId = record.id;

                    var evalDate = record.evaluationDate || record.submittedAt || record.date || "previous date";
                    if (evalDate.includes('T')) evalDate = evalDate.split('T')[0];
                    var qaName = record.qaName || record.qaEmail || "another QA";
                    var score = (record.score !== undefined && record.score !== null) ? (" • Score: " + record.score) : "";

                    // Display Duplicate Warning Box
                    duplicateWarningBox.style.display = "block";
                    duplicateWarningBox.innerHTML = "⚠️ <strong>Duplicate Interaction ID</strong><br>Already evaluated on " + evalDate + " by " + qaName + score + ".";
                    showToast("⚠️ Warning: Duplicate Interaction ID found in Sheets!", true);

                    if(record.caseNo && !inpCaseNo.value) inpCaseNo.value = record.caseNo;
                    if(record.callDuration && !inpDuration.value) inpDuration.value = record.callDuration;
                    if(record.dateOfInteraction && !inpDateInteraction.value) inpDateInteraction.value = record.dateOfInteraction.split('T')[0];
                    if(record.caseCategory && !inpCategory.value) inpCategory.value = record.caseCategory;
                    if(record.caseSubCategory && !inpSubCategory.value) inpSubCategory.value = record.caseSubCategory;
                    if(record.issueConcern && !txtIssue.value) txtIssue.value = record.issueConcern;

                    if (record.rubricId) switchRubricById(record.rubricId);

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
                            } else if (typeof details === 'object' && details !== null) {
                                Object.keys(details).forEach(function(secName, secIdx){
                                    var sItems = details[secName];
                                    if (Array.isArray(sItems)) {
                                        sItems.forEach(function(it, itIdx){
                                            var key = secIdx + "_" + itIdx;
                                            if (!state[key] && currentRubric && currentRubric.sections) {
                                                key = Object.keys(state).find(function(k){
                                                    var curItem = currentRubric.sections[state[k].secIdx] && currentRubric.sections[state[k].secIdx].items[state[k].itemIdx];
                                                    return curItem && (curItem.question || '').toLowerCase() === (it.question || '').toLowerCase();
                                                });
                                            }
                                            if (key && state[key]) {
                                                var matchedOpt = state[key].options.find(function(o){
                                                    return o.label === it.selected || (it.selected && o.label.toLowerCase() === it.selected.toLowerCase());
                                                });
                                                if (matchedOpt) {
                                                    state[key].sel = matchedOpt.id;
                                                    state[key].selIndex = state[key].options.indexOf(matchedOpt);
                                                }
                                                state[key].text = it.feedbackText || it.feedback || "";
                                            }
                                        });
                                    }
                                });
                                refreshAllUI();
                            }
                        } catch(e) {}
                    }
                } else {
                    duplicateWarningBox.style.display = "none";
                    duplicateWarningBox.innerHTML = "";
                }
            })
            .catch(function(){});
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

        var grpApi = createElement("div");
        grpApi.appendChild(createElement("label", sLabel)).textContent = "Apps Script API Web App URL";
        var inpApi = createElement("input", sInput);
        inpApi.placeholder = "https://script.google.com/macros/s/.../exec";
        inpApi.value = API_BASE_URL;
        grpApi.appendChild(inpApi);
        pBody.appendChild(grpApi);

        var grpEmail = createElement("div");
        grpEmail.appendChild(createElement("label", sLabel)).textContent = "Your Toast QA Email";
        var inpEmail = createElement("input", sInput);
        inpEmail.placeholder = "your.name@toasttab.com";
        inpEmail.value = QA_EMAIL;
        grpEmail.appendChild(inpEmail);
        pBody.appendChild(grpEmail);

        var grpKey = createElement("div");
        grpKey.appendChild(createElement("label", sLabel)).textContent = "Your Gemini API Key (from Google AI Studio)";
        var inpKey = createElement("input", sInput);
        inpKey.type = "password";
        inpKey.placeholder = "AIzaSy...";
        inpKey.value = GEMINI_API_KEY;
        grpKey.appendChild(inpKey);
        pBody.appendChild(grpKey);

        var grpModel = createElement("div");
        grpModel.appendChild(createElement("label", sLabel)).textContent = "Gemini Model";
        var inpModel = createElement("input", sInput);
        inpModel.value = GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
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

            storage.set('last_sync_ts', '');
            showToast("Settings saved! Syncing...", false);
            pOverlay.remove();
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
        storage.set('last_sync_ts', '');
        checkAndSyncData(true);
    }, toolsMenu));

    // --- Sync & Initialization Logic (Two-Month Window + Timestamp Check) ---
    var checkAndSyncData = function(forceRefresh) {
        showLoading("Loading Toast QA Data...");

        // 1. Load from IndexedDB immediately (instant rendering!)
        idb.get('cached_payload').then(function(cached){
            if (cached && !forceRefresh) {
                allRubrics = (cached.rubrics && cached.rubrics.length > 0) ? cached.rubrics : [DEFAULT_FALLBACK_RUBRIC];
                globalAssignments = cached.assignments || [];
                globalFeedbackTags = cached.feedbackChips || [];
                globalFeedbackGeneral = cached.feedbackGeneral || [];
                globalUsers = cached.users || [];

                currentRubric = allRubrics[0] || DEFAULT_FALLBACK_RUBRIC;
                renderRubric(currentRubric, globalFeedbackTags, globalFeedbackGeneral);
                updateAgentDropdown();
                hideLoading();
            }

            if (!API_BASE_URL) {
                hideLoading();
                if (!cached) {
                    renderRubric(DEFAULT_FALLBACK_RUBRIC, [], []);
                    updateAgentDropdown();
                }
                showToast("Please enter your Apps Script API URL in ⚙️ Settings", false);
                return;
            }

            // 2. Lightweight timestamp check (0 sheet reads)
            var syncUrl = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                          'api=1&action=check_sync&token=' + encodeURIComponent(API_TOKEN);

            fetch(syncUrl)
                .then(function(res){ return res.json(); })
                .then(function(syncData){
                    if(!syncData.success) throw new Error(syncData.error || "Sync check failed");

                    var lastTs = storage.get('last_sync_ts', '');
                    var currentTs = syncData.rubricsTimestamp + "_" + syncData.feedbackTimestamp + "_" + syncData.assignmentsTimestamp;

                    // If timestamps match and we have cache, STOP HERE! Zero sheet reads!
                    if (!forceRefresh && cached && lastTs === currentTs) {
                        console.log("Toast QA Tool: Cache is up-to-date (0 sheet reads!).");
                        return;
                    }

                    // 3. Fetch fresh two-month window payload
                    showLoading("Syncing with Google Sheets...");
                    var initUrl = API_BASE_URL + (API_BASE_URL.indexOf('?') === -1 ? '?' : '&') +
                                  'api=1&action=get_init_data&token=' + encodeURIComponent(API_TOKEN) +
                                  '&qa_email=' + encodeURIComponent(QA_EMAIL);

                    fetch(initUrl)
                        .then(function(res){ return res.json(); })
                        .then(function(data){
                            if(!data.success) throw new Error(data.error || "Failed to fetch data");

                            idb.set('cached_payload', data);
                            storage.set('last_sync_ts', currentTs);

                            allRubrics = (data.rubrics && data.rubrics.length > 0) ? data.rubrics : [DEFAULT_FALLBACK_RUBRIC];
                            globalAssignments = data.assignments || [];
                            globalFeedbackTags = data.feedbackChips || [];
                            globalFeedbackGeneral = data.feedbackGeneral || [];
                            globalUsers = data.users || [];

                            currentRubric = allRubrics[0] || DEFAULT_FALLBACK_RUBRIC;
                            renderRubric(currentRubric, globalFeedbackTags, globalFeedbackGeneral);
                            updateAgentDropdown();
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
                    if (!cached) {
                        renderRubric(DEFAULT_FALLBACK_RUBRIC, [], []);
                        updateAgentDropdown();
                        showToast("Loaded Toast QA Rubric (offline mode)", false);
                    }
                });
        });
    };

    checkAndSyncData(false);
})();