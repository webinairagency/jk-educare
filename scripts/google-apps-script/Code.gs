/**
 * JK EduCare — REV-001
 * Visitor Enquiry → Google Sheets webhook
 *
 * SETUP:
 * 1. Create/open the Google Sheet that should collect enquiries.
 * 2. Extensions → Apps Script, delete any boilerplate, paste this file in.
 * 3. Deploy → New deployment → "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the /exec URL and set it as GOOGLE_SHEETS_WEBHOOK_URL in the
 *    Next.js project's environment variables.
 * 5. Run `setupSheet` once from the Apps Script editor (select it in the
 *    function dropdown → Run) to create the header row automatically.
 */

const SHEET_NAME = "Enquiries" // change to match your tab name if different

const HEADERS = [
  "Date",
  "Time",
  "Name",
  "Visitor Type",
  "Other Type",
  "Phone",
  "Email",
  "Subject",
  "Message",
]

function setupSheet() {
  const sheet = getOrCreateSheet_()
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
    sheet.setFrozenRows(1)
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }
  return sheet
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    const required = ["date", "time", "name", "visitorType", "phone", "subject", "message"]
    for (const key of required) {
      if (!data[key]) {
        return jsonResponse_({ result: "error", error: `Missing field: ${key}` })
      }
    }

    const sheet = getOrCreateSheet_()
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS)
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
      sheet.setFrozenRows(1)
    }

    sheet.appendRow([
      data.date,
      data.time,
      data.name,
      data.visitorType,
      data.otherType || "",
      data.phone,
      data.email || "",
      data.subject,
      data.message,
    ])

    return jsonResponse_({ result: "success" })
  } catch (err) {
    return jsonResponse_({ result: "error", error: String(err) })
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
