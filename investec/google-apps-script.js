/**
 * ============================================================
 *  GOOGLE APPS SCRIPT — Email Subscriber Capture
 *  for bankinvestec.co.za
 * ============================================================
 *
 *  SETUP GUIDE (takes ~5 minutes):
 *
 *  STEP 1: Create a Google Sheet
 *    - Go to sheets.google.com and create a new spreadsheet
 *    - Name it "Bank Investec Subscribers" (or anything you like)
 *    - Add these headers in Row 1:
 *        A1: Timestamp   B1: Email   C1: Source   D1: Page
 *
 *  STEP 2: Open Apps Script
 *    - In your Google Sheet, click Extensions → Apps Script
 *    - Delete any existing code in the editor
 *    - Paste ALL of the code below (from the doPost function to the end)
 *    - Click Save (Ctrl+S)
 *
 *  STEP 3: Deploy as Web App
 *    - Click Deploy → New deployment
 *    - Click the gear icon next to "Select type" → Web app
 *    - Description: "Email capture v1"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 *    - Copy the Web App URL (looks like: https://script.google.com/macros/s/XXXXX/exec)
 *
 *  STEP 4: Paste URL into the website
 *    - Open each HTML file (index.html, vs-rmb.html, vs-discovery.html)
 *    - Find the line:  var APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
 *    - Replace the placeholder text with your URL
 *    - Save and push the files
 *
 *  STEP 5: Test it
 *    - Open the website and enter a test email address
 *    - Check your Google Sheet — the email should appear within seconds
 *
 *  NOTE: Google Apps Script requires 'mode: no-cors' in fetch() calls.
 *  This means the browser cannot read the response body. The form will
 *  show a success message optimistically. Check your Sheet to confirm
 *  submissions are being received.
 * ============================================================
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email || '';

    // Basic email validation
    if (!email || !email.includes('@')) {
      return respond(false, 'Invalid email address');
    }

    // Open the active spreadsheet (the one this script is attached to)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Subscribers');
    if (!sheet) {
      // Create the sheet if it doesn't exist yet
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Subscribers');
      sheet.appendRow(['Timestamp', 'Email', 'Source', 'Page']);
    }

    // Check for duplicate email (optional — remove the next 8 lines to allow duplicates)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat();
      if (emails.indexOf(email) !== -1) {
        return respond(true, 'Already subscribed'); // Treat as success silently
      }
    }

    // Write the new subscriber
    sheet.appendRow([
      new Date().toISOString(),
      email,
      data.source || 'bankinvestec.co.za',
      data.page || 'unknown'
    ]);

    return respond(true, 'Subscribed successfully');

  } catch (err) {
    return respond(false, err.toString());
  }
}

function doGet(e) {
  // Health check endpoint — visit the URL in a browser to confirm deployment
  return ContentService.createTextOutput('Bank Investec subscriber endpoint is active.');
}

function respond(success, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: success, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
