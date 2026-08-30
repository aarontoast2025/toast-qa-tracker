# Toast QA Tracker & Bookmarklet

A comprehensive Quality Assurance tracking suite integrated with Google Sheets, Gemini AI, and a browser bookmarklet for Stella Connect.

---

## 🚀 Google Apps Script Deployment Guide

To ensure that **both the Web App UI and the Bookmarklet API work seamlessly without session conflicts**, use Google Apps Script's dual-deployment architecture:

### 1. Main QA Tracker Web App (For Dashboard / Evaluations / Scheduling)
This deployment is accessed by team members in their browser to manage reviews, schedules, and reports.

* **Open Apps Script Editor**: [script.google.com](https://script.google.com)
* Click **Deploy** > **Manage deployments** (or **New deployment**).
* Configure:
  * **Type:** Web app
  * **Description:** `QA Tracker Main Web App`
  * **Execute as:** `User accessing the web app` (or `Me`)
  * **Who has access:** `Anyone within toasttab.com` *(Crucial: Do not set to "Anyone" on this deployment, or Apps Script will anonymize `Session.getActiveUser().getEmail()` and trigger "Login Required")*
* Use this URL for team members opening the QA Tracker.

---

### 2. Bookmarklet API Deployment (For Stella Connect Bookmarklet)
This deployment is used as a JSON API endpoint for external HTTP requests made from Stella Connect (`stella.toasttab.com` / `*.stellaconnect.net`).

* Click **Deploy** > **New deployment**.
* Configure:
  * **Type:** Web app
  * **Description:** `Toast QA Bookmarklet API`
  * **Execute as:** `Me`
  * **Who has access:** `Anyone`
* Protected by: `API_SECRET_TOKEN` and QA email validation against the `Users` database.
* Copy this Web App URL and enter it as the **Apps Script API URL** in the Bookmarklet settings.

---

## 📌 Bookmarklet Installation

Create a new bookmark in your browser bookmarks bar with the following URL:

```javascript
javascript:(function(){fetch('https://raw.githubusercontent.com/aarontoast2025/toast-qa-tracker/main/toast-qa-tracker.js?v='+Date.now()).then(function(r){return r.text();}).then(function(t){eval(t);});})();
```

*(Alternative script tag loader:)*
```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githack.com/aarontoast2025/toast-qa-tracker/main/toast-qa-tracker.js?v='+Date.now();document.body.appendChild(s);})();
```

---

## ⚙️ Bookmarklet Setup
1. Open any Stella Connect QA review page.
2. Click your **Toast QA Tracker** bookmark.
3. Click the **⚙️ (Settings)** icon in the top right of the modal.
4. Enter:
   - **Apps Script API URL**: Your Bookmarklet API Deployment URL (configured with "Who has access: Anyone")
   - **Your QA Email**: Your `@toasttab.com` email address
   - **Gemini API Key**: Your personal Gemini API key (from Google AI Studio)
5. Click **Save Settings**.

---

## 🔍 Troubleshooting "Login Required"
If a user encounters the "Login Required" page:
1. **Google Apps Script Access Setting:** Ensure the Main Web App deployment has **"Who has access"** set to **"Anyone within toasttab.com"**. When set to "Anyone", Google Apps Script strips user identity and returns an empty string for `Session.getActiveUser().getEmail()`.
2. **Multiple Google Accounts:** If the user has multiple Google accounts logged into the browser (e.g. personal `@gmail.com` and corporate `@toasttab.com`), Google may default to the personal account. Switch to the `@toasttab.com` profile or use a dedicated Chrome Profile.

