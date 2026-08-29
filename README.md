# QA Tracker Bookmarklet

A browser bookmarklet for QA evaluations integrated with Google Sheets and client-side.

## Installation

Create a new bookmark in your browser bookmarks bar with the following URL:

```javascript
javascript:(function(){fetch('https://raw.githubusercontent.com/aarontoast2025/toast-qa-tracker/main/toast-qa-tracker.js?v='+Date.now()).then(function(r){return r.text();}).then(function(t){eval(t);});})();
```

*(Alternative script tag loader:)*
```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githack.com/aarontoast2025/toast-qa-tracker/main/toast-qa-tracker.js?v='+Date.now();document.body.appendChild(s);})();
```

## Setup
1. Open any Stella Connect QA review page.
2. Click your **Toast QA Tracker** bookmark.
3. Click the **⚙️ (Settings)** icon in the top right of the modal.
4. Enter:
   - **Apps Script API URL**: Your Google Apps Script Web App Deployment URL
   - **Your QA Email**: Your email
   - **Gemini API Key**: Your personal Gemini API key (from Google AI Studio)
5. Click **Save Settings**.
