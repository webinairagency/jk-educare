/**
 * JK Edu-Care Services – Registration + Class Portal backend (YouTube Live)
 * Replace ALL of the old Code.gs with this file.
 *
 * One-time setup:
 *  1. Project Settings (gear) > Script Properties > Add: PORTAL_SECRET = <long random string, same as Vercel env>
 *  2. File > Settings in the Google Sheet: Time zone = (GMT+05:30) India Standard Time
 *  3. Run setupPortal once (creates Classes + Attendance tabs and student portal columns)
 *  4. Run generateAccessCodes to give every shortlisted student a 6-digit code
 *  5. Deploy > Manage deployments > Edit > New version (URL stays the same)
 */
const SHEET_NAME = 'Batch I';
const LIMIT = 50;
const BATCH_CODE = 'B1';
const HEADERS = ['Timestamp','Reg No','Name','Class & Group','Board','Pool','Gender',
  'Student WhatsApp','Parent Mobile','School','Place','District','Pool Position','Status','Called?','Notes',
  'Email','Access Code','Linked At'];
// 0-based column indexes in the Batch I tab
const C = { regNo: 1, name: 2, group: 3, board: 4, pool: 5, gender: 6, phone: 7, status: 13, email: 16, code: 17, linkedAt: 18 };

const CLASS_HEADERS = ['Class ID','Subject','Topic','Teacher','For','Start','Duration (min)','YouTube Link','Recording Link (optional)','Notes Link','Caption','Hidden'];
const ATT_HEADERS = ['Timestamp','Reg No','Class ID'];
const MAT_HEADERS = ['Title','Subject','Type','For','Link','Added','Hidden'];
const NOTICE_HEADERS = ['Message (English)','Message (Tamil)','Date','Pinned','Show until','For','Hidden'];

/* ---------------- helpers ---------------- */
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(v, max) {
  v = String(v == null ? '' : v).trim().replace(/\s+/g, ' ').slice(0, max || 100);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function tab_(name, headers, colour) {
  let sh = ss_().getSheetByName(name);
  if (!sh) {
    sh = ss_().insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground(colour || '#183A8F').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}
function students_() {
  const sh = tab_(SHEET_NAME, HEADERS);
  sh.getRange('H:I').setNumberFormat('@');
  return sh;
}
function poolCounts_(sh) {
  const counts = { STATE: 0, CBSE: 0 };
  const last = sh.getLastRow();
  if (last < 2) return counts;
  sh.getRange(2, C.pool + 1, last - 1, 1).getValues().forEach(r => { if (counts[r[0]] !== undefined) counts[r[0]]++; });
  return counts;
}

/* ---------------- one-time setup ---------------- */
function setupPortal() {
  const sh = students_();
  // add Email / Access Code / Linked At headers if the tab is older
  const head = sh.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  HEADERS.forEach((h, i) => { if (!head[i]) sh.getRange(1, i + 1).setValue(h).setFontWeight('bold').setBackground('#183A8F').setFontColor('#ffffff'); });
  sh.getRange('R:R').setNumberFormat('@');
  const cl = tab_('Classes', CLASS_HEADERS, '#D3136B');
  cl.getRange('F:F').setNumberFormat('dd/mm/yyyy hh:mm AM/PM');
  tab_('Attendance', ATT_HEADERS, '#5A6688');
  tab_('Materials', MAT_HEADERS, '#1C6B3A');
  tab_('Notices', NOTICE_HEADERS, '#B5441B');
  if (!PropertiesService.getScriptProperties().getProperty('PORTAL_SECRET')) {
    Logger.log('⚠ Add PORTAL_SECRET in Project Settings > Script Properties');
  }
}

/** Gives each Shortlisted, not-yet-linked student without a code a fresh 6-digit code. Safe to run again. */
function generateAccessCodes() {
  const sh = students_();
  const rows = sh.getDataRange().getValues();
  let n = 0;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r[C.status] === 'Shortlisted' && !r[C.email] && !r[C.code]) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      sh.getRange(i + 1, C.code + 1).setNumberFormat('@').setValue(code);
      n++;
    }
  }
  Logger.log(n + ' codes generated');
}

/* ---------------- web endpoints ---------------- */
function doGet(e) {
  if (e && e.parameter.action === 'stats') return json_({ ok: true, limit: LIMIT, pools: poolCounts_(students_()) });
  return json_({ ok: true, status: 'API running' });
}

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents || '{}'); } catch (err) { return json_({ ok: false, error: 'Bad request' }); }
  if (d.action) return portal_(d);
  return register_(d);
}

/* ---------------- registration (public form) ---------------- */
function register_(d) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (d.website) return json_({ ok: true, regNo: 'JK-' + BATCH_CODE + '-0000', shortlisted: false, position: 999 });
    const mobile = /^[6-9]\d{9}$/;
    if (!d.name || String(d.name).length < 3) return json_({ ok: false, error: 'Name is missing' });
    if (!mobile.test(d.phone) || !mobile.test(d.parent)) return json_({ ok: false, error: 'Invalid mobile number' });
    if (['State Board', 'Matriculation', 'CBSE'].indexOf(d.board) < 0) return json_({ ok: false, error: 'Invalid board' });
    if (!d.consent) return json_({ ok: false, error: 'Parent consent is required' });

    const sh = students_();
    const name = clean_(String(d.name).toUpperCase(), 60);
    const last = sh.getLastRow();
    if (last >= 2) {
      const rows = sh.getRange(2, 1, last - 1, 13).getValues();
      for (const r of rows) {
        if (String(r[C.phone]) === d.phone && String(r[C.name]) === name) {
          return json_({ ok: true, duplicate: true, regNo: r[C.regNo], position: r[12], shortlisted: r[12] <= LIMIT, pools: poolCounts_(sh) });
        }
      }
    }
    const pool = d.board === 'CBSE' ? 'CBSE' : 'STATE';
    const counts = poolCounts_(sh);
    const position = counts[pool] + 1;
    const regNo = 'JK-' + BATCH_CODE + '-' + String(Math.max(last, 1)).padStart(4, '0');
    sh.appendRow([new Date(), regNo, name, clean_(d.group, 40), d.board, pool, clean_(d.gender, 10),
      d.phone, d.parent, clean_(d.school, 100), clean_(d.place, 60), clean_(d.district, 40), position,
      position <= LIMIT ? 'Shortlisted' : 'Waitlist', '', '']);
    counts[pool]++;
    return json_({ ok: true, regNo, pool, position, shortlisted: position <= LIMIT, pools: counts });
  } catch (err) {
    return json_({ ok: false, error: 'Server busy, try again' });
  } finally { lock.releaseLock(); }
}

/* ---------------- portal (called only by the Next.js server) ---------------- */
function portal_(d) {
  const secret = PropertiesService.getScriptProperties().getProperty('PORTAL_SECRET');
  if (!secret || d.secret !== secret) return json_({ ok: false, error: 'Unauthorized' });
  try {
    switch (d.action) {
      case 'student':    return json_({ ok: true, student: findByEmail_(d.email) });
      case 'link':       return json_(link_(d));
      case 'classes':    return json_({ ok: true, classes: classes_() });
      case 'attendance': return json_({ ok: true, ids: attendanceFor_(d.regNo) });
      case 'join':       return json_(join_(d));
      case 'materials':  return json_({ ok: true, materials: materials_() });
      case 'notices':    return json_({ ok: true, notices: notices_() });
      // Admin actions (the Next.js server only calls these for emails listed in ADMIN_EMAILS)
      case 'adminData':     return json_(adminData_());
      case 'adminAdd':      return json_(adminAdd_(d));
      case 'adminSetHidden': return json_(adminSetHidden_(d));
      default:           return json_({ ok: false, error: 'Unknown action' });
    }
  } catch (err) {
    return json_({ ok: false, error: 'Server busy, try again' });
  }
}

function studentObj_(r) {
  return { regNo: String(r[C.regNo]), name: String(r[C.name]), group: String(r[C.group]), board: String(r[C.board]), gender: String(r[C.gender]), status: String(r[C.status]) };
}

function findByEmail_(email) {
  email = String(email || '').toLowerCase().trim();
  if (!email) return null;
  const rows = students_().getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][C.email]).toLowerCase().trim() === email && rows[i][C.status] === 'Shortlisted') return studentObj_(rows[i]);
  }
  return null;
}

function link_(d) {
  const email = String(d.email || '').toLowerCase().trim();
  const regNo = String(d.regNo || '').toUpperCase().replace(/\s+/g, '');
  const code = String(d.code || '').trim();
  if (!email) return { ok: false, error: 'Sign in with Google first' };

  const cache = CacheService.getScriptCache();
  const failKey = 'fail:' + email;
  const fails = Number(cache.get(failKey) || 0);
  if (fails >= 5) return { ok: false, error: 'Too many wrong attempts. Try again after 1 hour or contact JK sir.' };
  const fail = msg => { cache.put(failKey, String(fails + 1), 3600); return { ok: false, error: msg }; };

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const sh = students_();
    const rows = sh.getDataRange().getValues();
    let rowIdx = -1;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][C.email]).toLowerCase().trim() === email) return { ok: false, error: 'This Google account is already linked to ' + rows[i][C.regNo] };
      if (String(rows[i][C.regNo]).toUpperCase() === regNo) rowIdx = i;
    }
    if (rowIdx < 0) return fail('Roll number or access code is wrong');
    const r = rows[rowIdx];
    if (r[C.email]) return { ok: false, error: 'This roll number is already linked to another Google account. Ask JK sir to reset it.' };
    if (!r[C.code] || String(r[C.code]) !== code) return fail('Roll number or access code is wrong');
    if (r[C.status] !== 'Shortlisted') return { ok: false, error: 'This roll number is on the waitlist, not in Batch I yet.' };

    sh.getRange(rowIdx + 1, C.email + 1).setValue(email);
    sh.getRange(rowIdx + 1, C.code + 1).setValue('');      // code is single-use
    sh.getRange(rowIdx + 1, C.linkedAt + 1).setValue(new Date());
    cache.remove(failKey);
    return { ok: true, student: studentObj_(r) };
  } finally { lock.releaseLock(); }
}

function classes_() {
  const sh = tab_('Classes', CLASS_HEADERS, '#D3136B');
  const rows = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0] || r[11] === true || String(r[11]).toUpperCase() === 'TRUE') continue;
    if (!(r[5] instanceof Date)) continue;              // Start must be a real date-time
    out.push({
      id: String(r[0]).trim(), subject: String(r[1]), topic: String(r[2]), teacher: String(r[3]),
      for: String(r[4] || 'All'), start: r[5].toISOString(), duration: Number(r[6]) || 60,
      live: String(r[7]).trim(), recording: String(r[8]).trim(), notes: String(r[9]).trim(), caption: String(r[10])
    });
  }
  return out;
}

function attendanceFor_(regNo) {
  const rows = tab_('Attendance', ATT_HEADERS, '#5A6688').getDataRange().getValues();
  const ids = {};
  for (let i = 1; i < rows.length; i++) if (String(rows[i][1]) === String(regNo)) ids[String(rows[i][2])] = true;
  return Object.keys(ids);
}

function join_(d) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    if (attendanceFor_(d.regNo).indexOf(String(d.classId)) < 0) {
      tab_('Attendance', ATT_HEADERS, '#5A6688').appendRow([new Date(), String(d.regNo), String(d.classId)]);
    }
    return { ok: true };
  } finally { lock.releaseLock(); }
}

const isTrue_ = v => v === true || String(v).toUpperCase() === 'TRUE' || String(v).toUpperCase() === 'YES';

function materials_() {
  const rows = tab_('Materials', MAT_HEADERS, '#1C6B3A').getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0] || !r[4] || isTrue_(r[6])) continue;
    out.push({ title: String(r[0]), subject: String(r[1] || 'General'), type: String(r[2] || 'Notes'), for: String(r[3] || 'All'),
      link: String(r[4]).trim(), added: r[5] instanceof Date ? r[5].toISOString() : '' });
  }
  return out;
}

function notices_() {
  const rows = tab_('Notices', NOTICE_HEADERS, '#B5441B').getDataRange().getValues();
  const now = new Date();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if ((!r[0] && !r[1]) || isTrue_(r[6])) continue;
    if (r[4] instanceof Date && r[4] < now) continue;          // expired
    out.push({ en: String(r[0] || r[1]), ta: String(r[1] || r[0]), date: r[2] instanceof Date ? r[2].toISOString() : '',
      pinned: isTrue_(r[3]), for: String(r[5] || 'All') });
  }
  return out;
}

/** Test from the editor: logs the classes the portal will see. */
function testClasses() { Logger.log(JSON.stringify(classes_(), null, 2)); }

/* ---------------- admin (add / hide rows from the website admin page) ---------------- */
const ADMIN_TABS = {
  classes:   { name: 'Classes',   headers: CLASS_HEADERS,  colour: '#D3136B', hidden: 12 },
  materials: { name: 'Materials', headers: MAT_HEADERS,    colour: '#1C6B3A', hidden: 7 },
  notices:   { name: 'Notices',   headers: NOTICE_HEADERS, colour: '#B5441B', hidden: 7 },
};
const url_ = v => { v = String(v || '').trim(); return /^https?:\/\/\S+$/i.test(v) ? v : ''; };
const date_ = v => { const m = String(v || '').match(/^\d{4}-\d{2}-\d{2}/); return m ? m[0] : ''; };

function adminData_() {
  const t = ADMIN_TABS;
  const rowsOf = k => { const sh = tab_(t[k].name, t[k].headers, t[k].colour); return sh.getDataRange().getValues().slice(1).map((r, i) => ({ r: r, row: i + 2 })); };
  const iso = v => v instanceof Date ? v.toISOString() : '';
  const classes = rowsOf('classes').filter(x => x.r[0]).map(x => ({ row: x.row, id: String(x.r[0]), subject: String(x.r[1]), topic: String(x.r[2]), teacher: String(x.r[3]),
    for: String(x.r[4]), start: iso(x.r[5]), duration: Number(x.r[6]) || 60, live: String(x.r[7]), recording: String(x.r[8]), hidden: isTrue_(x.r[11]) }));
  const materials = rowsOf('materials').filter(x => x.r[0]).map(x => ({ row: x.row, title: String(x.r[0]), subject: String(x.r[1]), type: String(x.r[2]), for: String(x.r[3]),
    link: String(x.r[4]), added: iso(x.r[5]), hidden: isTrue_(x.r[6]) }));
  const notices = rowsOf('notices').filter(x => x.r[0] || x.r[1]).map(x => ({ row: x.row, en: String(x.r[0]), ta: String(x.r[1]), date: iso(x.r[2]), pinned: isTrue_(x.r[3]),
    until: iso(x.r[4]), hidden: isTrue_(x.r[6]) }));
  const rows = students_().getDataRange().getValues().slice(1);
  // no phone numbers, access codes or emails go to the admin page
  const students = rows.filter(r => r[C.regNo]).map(r => ({ regNo: String(r[C.regNo]), name: String(r[C.name]), group: String(r[C.group]), board: String(r[C.board]),
    school: String(r[9]), place: String(r[10]), district: String(r[11]), status: String(r[C.status]), linked: !!r[C.email] }));
  return { ok: true, classes: classes, materials: materials, notices: notices, students: students };
}

function adminAdd_(d) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const a = d.item || {};
    if (d.kind === 'class') {
      const subject = clean_(a.subject, 40), topic = clean_(a.topic, 120);
      const start = Utilities.parseDate(String(a.start || ''), 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm");   // typed in IST
      if (!subject || !topic) return { ok: false, error: 'Subject and topic are required' };
      const live = url_(a.live);
      if (!live) return { ok: false, error: 'YouTube link must start with https://' };
      const id = 'C' + Utilities.formatDate(start, 'Asia/Kolkata', 'yyMMdd-HHmm') + '-' + subject.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
      tab_('Classes', CLASS_HEADERS, '#D3136B').appendRow([id, subject, topic, clean_(a.teacher || 'JK Sir', 60), clean_(a.for || 'All', 40), start,
        Math.max(10, Math.min(300, Number(a.duration) || 60)), live, url_(a.recording), url_(a.notes), clean_(a.caption, 200), '']);
      return { ok: true };
    }
    if (d.kind === 'material') {
      const link = url_(a.link);
      if (!clean_(a.title, 120) || !link) return { ok: false, error: 'Title and a https:// link are required' };
      if (['notes', 'question bank', 'answer key', 'model exam'].indexOf(String(a.type)) < 0) return { ok: false, error: 'Unknown type' };
      tab_('Materials', MAT_HEADERS, '#1C6B3A').appendRow([clean_(a.title, 120), clean_(a.subject || 'General', 40), a.type, clean_(a.for || 'All', 40), link, new Date(), '']);
      return { ok: true };
    }
    if (d.kind === 'notice') {
      const en = clean_(a.en, 300), ta = clean_(a.ta, 300);
      if (!en && !ta) return { ok: false, error: 'Write the notice in English or Tamil' };
      const until = date_(a.until);
      tab_('Notices', NOTICE_HEADERS, '#B5441B').appendRow([en, ta, new Date(), a.pinned ? true : '',
        until ? Utilities.parseDate(until + 'T23:59', 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm") : '', clean_(a.for || 'All', 40), '']);
      return { ok: true };
    }
    return { ok: false, error: 'Unknown kind' };
  } catch (err) {
    return { ok: false, error: 'Could not save: check the date and time' };
  } finally { lock.releaseLock(); }
}

function adminSetHidden_(d) {
  const t = ADMIN_TABS[d.tab];
  const row = Number(d.row);
  if (!t || !(row >= 2)) return { ok: false, error: 'Bad request' };
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sh = tab_(t.name, t.headers, t.colour);
    if (row > sh.getLastRow()) return { ok: false, error: 'Row not found' };
    sh.getRange(row, t.hidden).setValue(d.hidden ? true : '');
    return { ok: true };
  } finally { lock.releaseLock(); }
}
