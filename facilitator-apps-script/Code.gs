/**
 * RMWUG 2026 facilitator control plane.
 *
 * Install this as a script bound to the private workshop spreadsheet. The
 * public GitHub Pages site never receives the roster, email addresses, full
 * assignment register, or the access-code register.
 */

const RMWUG = Object.freeze({
  spreadsheetId: "13fXfHD5ZhcTEoTjkhXKqfh7Z2tNSerJ5WkG7NCYszmU",
  sheets: {
    roster: "Roster",
    topics: "Topic Bank",
    pods: "Pod Plan",
    assignments: "Assignments",
    settings: "Settings",
    access: "Access Registry",
    cards: "Access Cards",
    audit: "Audit Log",
  },
  stateKey: "Assignment state",
  deploymentKey: "Lookup service",
  locked: "LOCKED",
  draft: "DRAFT",
  open: "NOT STARTED",
  maxFailedAttempts: 8,
  cooldownMinutes: 10,
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("RMWUG Control")
    .addItem("Open control panel", "showControlPanel")
    .addSeparator()
    .addItem("Validate workshop", "menuValidateWorkshop")
    .addItem("Generate missing access codes", "menuGenerateAccessCodes")
    .addItem("Run draft topic draw", "menuRunDraftDraw")
    .addItem("Lock and publish assignments", "menuLockAssignments")
    .addItem("Build printable access cards", "menuBuildAccessCards")
    .addToUi();
}

function showControlPanel() {
  ensureControlStructure_();
  const html = HtmlService.createHtmlOutput(getControlPanelHtml_())
    .setTitle("RMWUG Control")
    .setWidth(390);
  SpreadsheetApp.getUi().showSidebar(html);
}

function menuValidateWorkshop() {
  showMenuResult_(validateWorkshop());
}

function menuGenerateAccessCodes() {
  showMenuResult_(generateMissingAccessCodes());
}

function menuRunDraftDraw() {
  showMenuResult_(runDraftTopicDraw());
}

function menuLockAssignments() {
  showMenuResult_(lockAssignments());
}

function menuBuildAccessCards() {
  showMenuResult_(buildAccessCards());
}

function showMenuResult_(result) {
  SpreadsheetApp.getUi().alert(result.ok ? "RMWUG" : "RMWUG needs attention", result.message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function getControlState() {
  ensureControlStructure_();
  const roster = readTable_(RMWUG.sheets.roster);
  const assignments = readTable_(RMWUG.sheets.assignments);
  const access = readTable_(RMWUG.sheets.access);
  const state = getSetting_(RMWUG.stateKey) || RMWUG.open;
  return {
    ok: true,
    state: state,
    rosterCount: roster.length,
    placeholderCount: roster.filter(function (row) { return String(row["Roster Status"]).toUpperCase() === "PLACEHOLDER"; }).length,
    podCount: new Set(roster.map(function (row) { return row.Pod; }).filter(String)).size,
    assignmentCount: assignments.filter(function (row) { return row["Topic ID"]; }).length,
    accessCount: access.filter(function (row) { return row["Access Code"] && String(row["Token Status"]).toUpperCase() === "ACTIVE"; }).length,
    lookupService: getSetting_(RMWUG.deploymentKey) || "Not deployed",
    message: "Control state refreshed.",
  };
}

function validateWorkshop() {
  ensureControlStructure_();
  const roster = readTable_(RMWUG.sheets.roster);
  const topics = readTable_(RMWUG.sheets.topics);
  const issues = [];
  const warnings = [];

  if (!roster.length) issues.push("The roster is empty.");
  if (roster.length > topics.length) issues.push("The roster exceeds the available unique topics.");

  const ids = new Set();
  const emails = new Set();
  const podCounts = {};
  roster.forEach(function (row, index) {
    const label = "Roster row " + (index + 2);
    const id = normalizeId_(row["Student ID"]);
    const name = String(row.Name || "").trim();
    const email = String(row["Google Email"] || "").trim().toLowerCase();
    const pod = normalizePod_(row.Pod);
    if (!id) issues.push(label + " has no Student ID.");
    if (id && ids.has(id)) issues.push("Duplicate Student ID: " + id + ".");
    if (id) ids.add(id);
    if (!name) issues.push(label + " has no student name.");
    if (!email || email.indexOf("@") < 1) issues.push(label + " has no valid Google email.");
    if (email && emails.has(email)) issues.push("Duplicate email: " + email + ".");
    if (email) emails.add(email);
    if (!pod) issues.push(label + " has no valid pod.");
    if (pod) podCounts[pod] = (podCounts[pod] || 0) + 1;
    if (String(row["Roster Status"]).toUpperCase() === "PLACEHOLDER" || email.endsWith("@placeholder.invalid")) {
      warnings.push(label + " is still a placeholder.");
    }
  });

  Object.keys(podCounts).sort().forEach(function (pod) {
    if (podCounts[pod] < 2) issues.push(pod + " has fewer than two students.");
    if (podCounts[pod] > 10) issues.push(pod + " exceeds the ten-topic section capacity.");
    if (podCounts[pod] !== 5) warnings.push(pod + " has " + podCounts[pod] + " students; confirm this deliberate exception.");
  });

  const topicIds = new Set();
  topics.forEach(function (row) {
    const topicId = String(row["Topic ID"] || "").trim().toUpperCase();
    if (!topicId || !row["Research Question"] || !row["Editorial Section"]) {
      issues.push("The Topic Bank contains an incomplete topic row.");
    }
    if (topicIds.has(topicId)) issues.push("Duplicate Topic ID: " + topicId + ".");
    topicIds.add(topicId);
  });

  const ok = issues.length === 0;
  const message = ok
    ? "Validation passed for " + roster.length + " students in " + Object.keys(podCounts).length + " pods." + (warnings.length ? " Warnings: " + warnings.length + "." : "")
    : "Validation failed with " + issues.length + " blocking issue(s).";
  writeAudit_("VALIDATE", ok ? "PASS" : "FAIL", message + " " + issues.slice(0, 5).join(" "));
  return Object.assign(getControlState(), { ok: ok, message: message, issues: issues, warnings: warnings });
}

function generateMissingAccessCodes() {
  ensureControlStructure_();
  const roster = readTable_(RMWUG.sheets.roster);
  if (!roster.length) return { ok: false, message: "Add the roster before generating access codes." };

  const accessSheet = getSheet_(RMWUG.sheets.access);
  const existing = readTable_(RMWUG.sheets.access);
  const byId = {};
  existing.forEach(function (row) { byId[normalizeId_(row["Student ID"])] = row; });
  const now = new Date();
  const rows = roster.map(function (student) {
    const id = normalizeId_(student["Student ID"]);
    const current = byId[id] || {};
    return [
      id,
      student.Name,
      current["Access Code"] || createAccessCode_(),
      current["Token Status"] || "ACTIVE",
      current["Issued At"] || now,
      current["Last Used"] || "",
      Number(current["Failed Attempts"] || 0),
      current["Last Failed"] || "",
      current["Token Preview"] || "",
    ];
  });
  rows.forEach(function (row) { row[8] = previewCode_(row[2]); });
  replaceBody_(accessSheet, rows, 9);
  formatPrivateTable_(accessSheet, 9, [190, 190, 220, 110, 150, 150, 110, 150, 110]);
  protectPrivateSheet_(accessSheet, "Owner-only access-code register");
  writeAudit_("ACCESS_CODES", "PASS", "Prepared " + rows.length + " active student access codes.");
  return Object.assign(getControlState(), { ok: true, message: "Prepared " + rows.length + " access codes. Build access cards only after the draw is locked." });
}

function runDraftTopicDraw() {
  ensureControlStructure_();
  const state = getSetting_(RMWUG.stateKey) || RMWUG.open;
  if (state === RMWUG.locked) {
    return { ok: false, message: "Assignments are locked. Unlock explicitly before replacing the authoritative draw." };
  }
  const validation = validateWorkshop();
  if (!validation.ok) return validation;

  const roster = readTable_(RMWUG.sheets.roster);
  const topics = readTable_(RMWUG.sheets.topics);
  const seed = String(getSetting_("Assignment seed") || "RMWUG2026-01").trim();
  const random = seededRandom_(seed);
  const podsById = {};
  roster.forEach(function (student) {
    const pod = normalizePod_(student.Pod);
    if (!podsById[pod]) podsById[pod] = [];
    podsById[pod].push(student);
  });
  const pods = Object.keys(podsById).sort().map(function (id) { return { id: id, students: podsById[id] }; });
  const sectionCodes = Array.from(new Set(topics.map(function (row) { return String(row["Section Code"] || "").trim().toUpperCase(); })));
  const bins = packPods_(pods, sectionCodes, random);
  if (!bins) {
    return { ok: false, message: "The pod sizes cannot fit into the eight ten-topic sections. Change the pod plan and validate again." };
  }

  const assignments = {};
  const sectionByPod = {};
  bins.forEach(function (bin) {
    const sectionTopics = shuffle_(topics.filter(function (topic) { return String(topic["Section Code"]).toUpperCase() === bin.code; }), random);
    let cursor = 0;
    shuffle_(bin.pods, random).forEach(function (pod) {
      sectionByPod[pod.id] = bin.code;
      shuffle_(pod.students, random).forEach(function (student) {
        assignments[normalizeId_(student["Student ID"])] = sectionTopics[cursor];
        cursor += 1;
      });
    });
  });

  const sheet = getSheet_(RMWUG.sheets.assignments);
  const rows = roster.map(function (student) {
    const id = normalizeId_(student["Student ID"]);
    const topic = assignments[id];
    return [id, student.Name, student["Google Email"], normalizePod_(student.Pod), topic["Editorial Section"], topic["Topic ID"], topic["Research Question"], seed, RMWUG.draft, ""];
  });
  replaceBody_(sheet, rows, 10);
  formatPrivateTable_(sheet, 10, [95, 170, 220, 70, 220, 85, 520, 150, 100, 150]);

  const podSheet = getSheet_(RMWUG.sheets.pods);
  const podRows = pods.map(function (pod) { return [pod.id, pod.students.length, pod.students.length, sectionByPod[pod.id], "Draft draw; review before lock"]; });
  replaceBody_(podSheet, podRows, 5);
  setSetting_(RMWUG.stateKey, RMWUG.draft, "Only LOCKED assignments are returned to students");
  generateMissingAccessCodes();
  writeAudit_("TOPIC_DRAW", "DRAFT", "Created " + rows.length + " unique assignments with seed " + seed + ".");
  return Object.assign(getControlState(), { ok: true, message: "Draft draw created for " + rows.length + " students. Review Assignments and Pod Plan, then lock once." });
}

function lockAssignments() {
  ensureControlStructure_();
  const state = getSetting_(RMWUG.stateKey) || RMWUG.open;
  if (state === RMWUG.locked) return Object.assign(getControlState(), { ok: true, message: "Assignments are already locked." });
  const assignments = readTable_(RMWUG.sheets.assignments);
  const roster = readTable_(RMWUG.sheets.roster);
  if (!assignments.length || assignments.length !== roster.length || assignments.some(function (row) { return !row["Topic ID"]; })) {
    return { ok: false, message: "Create and review a complete draft draw before locking." };
  }
  const uniqueTopics = new Set(assignments.map(function (row) { return row["Topic ID"]; }));
  if (uniqueTopics.size !== assignments.length) return { ok: false, message: "The draft contains duplicate topic assignments." };

  const sheet = getSheet_(RMWUG.sheets.assignments);
  const now = new Date();
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).setValue(RMWUG.locked);
    sheet.getRange(2, 10, sheet.getLastRow() - 1, 1).setValue(now);
  }
  setSetting_(RMWUG.stateKey, RMWUG.locked, "Only LOCKED assignments are returned to students");
  buildAccessCards();
  writeAudit_("ASSIGNMENTS", "LOCKED", "Locked " + assignments.length + " assignments at " + now.toISOString() + ".");
  return Object.assign(getControlState(), { ok: true, message: "Assignments are locked and available through valid student access codes." });
}

function unlockAssignments(confirmation) {
  if (String(confirmation || "").trim().toUpperCase() !== "UNLOCK") {
    return Object.assign(getControlState(), { ok: false, message: "No change made. Type UNLOCK exactly to reopen the draw." });
  }
  setSetting_(RMWUG.stateKey, RMWUG.draft, "Only LOCKED assignments are returned to students");
  const sheet = getSheet_(RMWUG.sheets.assignments);
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).setValue(RMWUG.draft);
    sheet.getRange(2, 10, sheet.getLastRow() - 1, 1).clearContent();
  }
  writeAudit_("ASSIGNMENTS", "UNLOCKED", "Facilitator explicitly reopened the draw.");
  return Object.assign(getControlState(), { ok: true, message: "Draw reopened. Student lookup is paused until assignments are locked again." });
}

function rotateStudentAccessCode(studentId) {
  ensureControlStructure_();
  const id = normalizeId_(studentId);
  if (!id) return Object.assign(getControlState(), { ok: false, message: "Enter a Student ID such as S001." });
  const roster = readTable_(RMWUG.sheets.roster);
  const student = roster.find(function (row) { return normalizeId_(row["Student ID"]) === id; });
  if (!student) return Object.assign(getControlState(), { ok: false, message: "That Student ID is not in the roster." });
  generateMissingAccessCodes();
  const sheet = getSheet_(RMWUG.sheets.access);
  const values = sheet.getDataRange().getValues();
  const headers = headerMap_(values[0]);
  for (let index = 1; index < values.length; index += 1) {
    if (normalizeId_(values[index][headers["Student ID"]]) === id) {
      const code = createAccessCode_();
      sheet.getRange(index + 1, headers["Access Code"] + 1).setValue(code);
      sheet.getRange(index + 1, headers["Token Status"] + 1).setValue("ACTIVE");
      sheet.getRange(index + 1, headers["Issued At"] + 1).setValue(new Date());
      sheet.getRange(index + 1, headers["Failed Attempts"] + 1).setValue(0);
      sheet.getRange(index + 1, headers["Last Failed"] + 1).clearContent();
      sheet.getRange(index + 1, headers["Token Preview"] + 1).setValue(previewCode_(code));
      buildAccessCards();
      writeAudit_("TOKEN_ROTATE", id, "Rotated one student access code.");
      return Object.assign(getControlState(), { ok: true, message: "Access code rotated for " + id + ". Reissue that student's access card." });
    }
  }
  return Object.assign(getControlState(), { ok: false, message: "Access Registry row not found for " + id + "." });
}

function buildAccessCards() {
  ensureControlStructure_();
  generateMissingAccessCodes();
  const assignments = readTable_(RMWUG.sheets.assignments);
  const access = readTable_(RMWUG.sheets.access);
  const accessById = {};
  access.forEach(function (row) { accessById[normalizeId_(row["Student ID"])] = row; });
  const assignmentById = {};
  assignments.forEach(function (row) { assignmentById[normalizeId_(row["Student ID"])] = row; });
  const publicApp = getSetting_("Public app") || "https://socraticsurge.github.io/RMWUG2026/";
  const roster = readTable_(RMWUG.sheets.roster);
  const rows = roster.map(function (student) {
    const id = normalizeId_(student["Student ID"]);
    const assignment = assignmentById[id] || {};
    const token = accessById[id] || {};
    return [id, student.Name, normalizePod_(student.Pod), assignment["Topic ID"] || "Pending", token["Access Code"] || "", publicApp, "Give only to the named student"];
  });
  const sheet = getSheet_(RMWUG.sheets.cards);
  replaceBody_(sheet, rows, 7);
  formatPrivateTable_(sheet, 7, [90, 190, 70, 90, 230, 280, 220]);
  sheet.getRange(2, 5, Math.max(rows.length, 1), 1).setFontFamily("Roboto Mono").setFontWeight("bold");
  protectPrivateSheet_(sheet, "Owner-only printable access cards");
  writeAudit_("ACCESS_CARDS", "PASS", "Rebuilt " + rows.length + " access-card rows.");
  return Object.assign(getControlState(), { ok: true, message: "Access Cards rebuilt. Print or privately issue one row per named student." });
}

function doGet(event) {
  const params = (event && event.parameter) || {};
  const callback = String(params.callback || "");
  let result;
  try {
    result = lookupAssignment_(params.id, params.token);
  } catch (error) {
    result = { ok: false, code: "UNAVAILABLE", message: "The workshop register is temporarily unavailable. Try again shortly or ask the facilitator." };
  }
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$.]{0,100}$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + JSON.stringify(result) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return HtmlService.createHtmlOutput(renderStudentCard_(result))
    .setTitle("RMWUG 2026 · My Study")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function lookupAssignment_(studentId, token) {
  const genericFailure = { ok: false, code: "NOT_FOUND", message: "The details do not match an available assignment. Check the access card or ask the facilitator." };
  if ((getSetting_(RMWUG.stateKey) || RMWUG.open) !== RMWUG.locked) {
    return { ok: false, code: "NOT_OPEN", message: "The facilitator has not opened the authoritative assignment register yet." };
  }
  const id = normalizeId_(studentId);
  const supplied = normalizeCode_(token);
  if (!id || !supplied) return genericFailure;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { ok: false, code: "BUSY", message: "The workshop register is busy. Try again in a moment." };
  try {
    const accessSheet = getSheet_(RMWUG.sheets.access);
    const values = accessSheet.getDataRange().getValues();
    if (values.length < 2) return genericFailure;
    const headers = headerMap_(values[0]);
    let accessIndex = -1;
    for (let index = 1; index < values.length; index += 1) {
      if (normalizeId_(values[index][headers["Student ID"]]) === id) { accessIndex = index; break; }
    }
    if (accessIndex < 1) return genericFailure;
    const row = values[accessIndex];
    const failed = Number(row[headers["Failed Attempts"]] || 0);
    const lastFailed = row[headers["Last Failed"]] instanceof Date ? row[headers["Last Failed"]] : null;
    const withinCooldown = lastFailed && (new Date().getTime() - lastFailed.getTime()) < RMWUG.cooldownMinutes * 60 * 1000;
    if (failed >= RMWUG.maxFailedAttempts && withinCooldown) {
      return { ok: false, code: "COOLDOWN", message: "Too many attempts. Wait ten minutes or ask the facilitator to rotate the access code." };
    }
    const expected = normalizeCode_(row[headers["Access Code"]]);
    const active = String(row[headers["Token Status"]] || "").toUpperCase() === "ACTIVE";
    if (!active || !safeEqual_(supplied, expected)) {
      accessSheet.getRange(accessIndex + 1, headers["Failed Attempts"] + 1).setValue(withinCooldown ? failed + 1 : 1);
      accessSheet.getRange(accessIndex + 1, headers["Last Failed"] + 1).setValue(new Date());
      writeAudit_("LOOKUP_FAIL", id, "Invalid or inactive access code.");
      return genericFailure;
    }
    accessSheet.getRange(accessIndex + 1, headers["Last Used"] + 1).setValue(new Date());
    accessSheet.getRange(accessIndex + 1, headers["Failed Attempts"] + 1).setValue(0);
    accessSheet.getRange(accessIndex + 1, headers["Last Failed"] + 1).clearContent();

    const assignments = readTable_(RMWUG.sheets.assignments);
    const assignment = assignments.find(function (item) { return normalizeId_(item["Student ID"]) === id && String(item.Status).toUpperCase() === RMWUG.locked; });
    if (!assignment) return genericFailure;
    const peers = assignments
      .filter(function (item) { return normalizePod_(item.Pod) === normalizePod_(assignment.Pod); })
      .map(function (item) { return { id: normalizeId_(item["Student ID"]), name: String(item.Name || "") }; });
    return {
      ok: true,
      code: "FOUND",
      message: "Authoritative assignment loaded.",
      assignment: {
        studentId: id,
        name: String(assignment.Name || ""),
        pod: normalizePod_(assignment.Pod),
        section: String(assignment.Section || ""),
        topicId: String(assignment["Topic ID"] || ""),
        question: String(assignment["Research Question"] || ""),
        peers: peers,
        forms: {
          onboarding: String(getSetting_("Onboarding form") || ""),
          milestone: String(getSetting_("Milestone form") || ""),
          submission: String(getSetting_("Final submission form") || ""),
        },
      },
    };
  } finally {
    lock.releaseLock();
  }
}

function ensureControlStructure_() {
  const spreadsheet = SpreadsheetApp.openById(RMWUG.spreadsheetId);
  ensureSheet_(spreadsheet, RMWUG.sheets.access, ["Student ID", "Name", "Access Code", "Token Status", "Issued At", "Last Used", "Failed Attempts", "Last Failed", "Token Preview"]);
  ensureSheet_(spreadsheet, RMWUG.sheets.cards, ["Student ID", "Name", "Pod", "Topic ID", "Access Code", "Public App", "Issue Note"]);
  ensureSheet_(spreadsheet, RMWUG.sheets.audit, ["Timestamp", "Actor", "Event", "Status", "Detail"]);
  ensureHeaders_(getSheet_(RMWUG.sheets.assignments), ["Student ID", "Name", "Google Email", "Pod", "Section", "Topic ID", "Research Question", "Assignment Seed", "Status", "Locked At"]);
  if (!getSetting_(RMWUG.stateKey)) setSetting_(RMWUG.stateKey, RMWUG.open, "Only LOCKED assignments are returned to students");
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  ensureHeaders_(sheet, headers);
  formatPrivateTable_(sheet, headers.length, []);
  protectPrivateSheet_(sheet, "Owner-only RMWUG control data");
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  headers.forEach(function (header, index) {
    if (String(current[index] || "").trim() !== header) sheet.getRange(1, index + 1).setValue(header);
  });
}

function protectPrivateSheet_(sheet, description) {
  const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  const protection = protections.length ? protections[0] : sheet.protect();
  protection.setDescription(description);
  const me = Session.getEffectiveUser();
  protection.addEditor(me);
  protection.getEditors().forEach(function (editor) {
    if (editor.getEmail() !== me.getEmail()) protection.removeEditor(editor);
  });
  if (protection.canDomainEdit()) protection.setDomainEdit(false);
}

function getSheet_(name) {
  const sheet = SpreadsheetApp.openById(RMWUG.spreadsheetId).getSheetByName(name);
  if (!sheet) throw new Error("Missing sheet: " + name);
  return sheet;
}

function readTable_(name) {
  const sheet = getSheet_(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(function (value) { return String(value || "").trim(); });
  return values.slice(1).filter(function (row) { return row.some(function (value) { return value !== ""; }); }).map(function (row) {
    const object = {};
    headers.forEach(function (header, index) { if (header) object[header] = row[index]; });
    return object;
  });
}

function replaceBody_(sheet, rows, width) {
  const bodyRows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 1, bodyRows, Math.max(width, sheet.getMaxColumns())).clearContent();
  if (rows.length) sheet.getRange(2, 1, rows.length, width).setValues(rows);
}

function formatPrivateTable_(sheet, width, widths) {
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  const header = sheet.getRange(1, 1, 1, width);
  header.setBackground("#112A46").setFontColor("#FFFFFF").setFontWeight("bold").setVerticalAlignment("middle");
  sheet.setRowHeight(1, 34);
  widths.forEach(function (value, index) { sheet.setColumnWidth(index + 1, value); });
}

function headerMap_(headers) {
  const result = {};
  headers.forEach(function (header, index) { result[String(header || "").trim()] = index; });
  return result;
}

function getSetting_(key) {
  const values = getSheet_(RMWUG.sheets.settings).getDataRange().getValues();
  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][0] || "").trim().toLowerCase() === String(key).trim().toLowerCase()) return values[index][1];
  }
  return "";
}

function setSetting_(key, value, purpose) {
  const sheet = getSheet_(RMWUG.sheets.settings);
  const values = sheet.getDataRange().getValues();
  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][0] || "").trim().toLowerCase() === String(key).trim().toLowerCase()) {
      sheet.getRange(index + 1, 2).setValue(value);
      if (purpose) sheet.getRange(index + 1, 3).setValue(purpose);
      return;
    }
  }
  sheet.appendRow([key, value, purpose || ""]);
}

function writeAudit_(event, status, detail) {
  const sheet = getSheet_(RMWUG.sheets.audit);
  sheet.appendRow([new Date(), Session.getEffectiveUser().getEmail() || "web-app", event, status, detail]);
}

function createAccessCode_() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let raw = "";
  while (raw.length < 24) {
    const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + new Date().getTime() + Math.random());
    bytes.forEach(function (byte) {
      if (raw.length < 24) raw += alphabet.charAt((byte + 256) % alphabet.length);
    });
  }
  return raw.match(/.{1,4}/g).join("-");
}

function previewCode_(code) {
  const normalized = normalizeCode_(code);
  return normalized ? normalized.slice(0, 4) + "…" + normalized.slice(-4) : "";
}

function normalizeCode_(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeId_(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function normalizePod_(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function safeEqual_(left, right) {
  const length = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  return diff === 0;
}

function hashSeed_(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom_(seed) {
  let value = hashSeed_(seed) || 1;
  return function () {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle_(items, random) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = result[index];
    result[index] = result[swap];
    result[swap] = current;
  }
  return result;
}

function packPods_(podGroups, sectionCodes, random) {
  const randomized = shuffle_(podGroups.map(function (pod) { return { id: pod.id, students: pod.students, tie: random() }; }), random)
    .sort(function (a, b) { return b.students.length - a.students.length || a.tie - b.tie; });
  const bins = shuffle_(sectionCodes, random).map(function (code) { return { code: code, remaining: 10, pods: [] }; });
  function place(index) {
    if (index === randomized.length) return true;
    const pod = randomized[index];
    const candidates = bins.filter(function (bin) { return bin.remaining >= pod.students.length; }).sort(function (a, b) { return a.remaining - b.remaining; });
    const tried = {};
    for (let candidateIndex = 0; candidateIndex < candidates.length; candidateIndex += 1) {
      const bin = candidates[candidateIndex];
      if (tried[bin.remaining]) continue;
      tried[bin.remaining] = true;
      bin.pods.push(pod);
      bin.remaining -= pod.students.length;
      if (place(index + 1)) return true;
      bin.remaining += pod.students.length;
      bin.pods.pop();
    }
    return false;
  }
  return place(0) ? bins : null;
}

function renderStudentCard_(result) {
  const assignment = result.assignment || {};
  const peerHtml = (assignment.peers || []).map(function (peer) { return "<li><strong>" + escapeHtml_(peer.id) + "</strong> " + escapeHtml_(peer.name) + "</li>"; }).join("");
  const body = result.ok
    ? "<p class='eyebrow'>AUTHORITATIVE ASSIGNMENT</p><h1>" + escapeHtml_(assignment.question) + "</h1><div class='facts'><p><b>Researcher</b><br>" + escapeHtml_(assignment.name) + " · " + escapeHtml_(assignment.studentId) + "</p><p><b>Study</b><br>" + escapeHtml_(assignment.topicId) + " · " + escapeHtml_(assignment.section) + "</p><p><b>Peer pod</b><br>" + escapeHtml_(assignment.pod) + "</p></div><h2>Pod members</h2><ul>" + peerHtml + "</ul><p class='limit'><b>Inference ceiling:</b> describe patterns in the collected public artifacts. Do not infer intent, effect, legality, or population-wide prevalence.</p>"
    : "<p class='eyebrow'>RMWUG 2026</p><h1>Assignment unavailable</h1><p>" + escapeHtml_(result.message) + "</p>";
  return "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'><style>body{margin:0;background:#f3efe7;color:#112a46;font:16px/1.55 Arial,sans-serif}.wrap{max-width:760px;margin:0 auto;padding:40px 22px}.card{background:#fff;border:1px solid #d7d1c6;border-radius:20px;padding:32px;box-shadow:0 18px 50px #112a4615}.eyebrow{font-size:12px;font-weight:800;letter-spacing:.14em;color:#bf5b3f}h1{font:700 clamp(28px,5vw,50px)/1.08 Georgia,serif;margin:.3em 0}h2{margin-top:30px}.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.facts p,.limit{background:#f3efe7;border-radius:12px;padding:14px}ul{padding-left:22px}footer{margin-top:18px;color:#617083;font-size:13px}</style></head><body><div class='wrap'><div class='card'>" + body + "</div><footer>Research Methods by Vinay Chaganti · St Mary's, Hyderabad · Do not share your access code.</footer></div></body></html>";
}

function escapeHtml_(value) {
  return String(value || "").replace(/[&<>\"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
  });
}

function getControlPanelHtml_() {
  return `<!doctype html><html><head><base target="_top"><style>
    body{font:14px/1.45 Arial,sans-serif;margin:0;color:#112a46;background:#f5f2ec}.wrap{padding:18px}.eyebrow{font-size:10px;font-weight:800;letter-spacing:.15em;color:#bd5c42}h1{font:700 26px/1.08 Georgia,serif;margin:4px 0 8px}.lede{color:#5d6c7b;margin:0 0 16px}.state{background:#112a46;color:white;border-radius:14px;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:9px}.state b{display:block;font-size:20px}.state small{color:#bed0df}.banner{grid-column:1/-1;border-top:1px solid #ffffff30;padding-top:9px}.actions{display:grid;gap:8px;margin:14px 0}.actions button{border:0;border-radius:10px;padding:11px 12px;background:white;color:#112a46;text-align:left;font-weight:700;cursor:pointer;box-shadow:0 2px 9px #112a4610}.actions button.primary{background:#bf5b3f;color:white}.danger{margin-top:14px;padding-top:12px;border-top:1px solid #d6d0c6}.row{display:flex;gap:7px}.row input{min-width:0;flex:1;padding:9px;border:1px solid #c8c2b8;border-radius:8px}.row button{padding:9px;border:0;border-radius:8px;background:#112a46;color:#fff}.status{background:#fff;border-left:4px solid #d9a72f;padding:10px;margin-top:12px;white-space:pre-wrap}.issues{font-size:12px;color:#7b352a;padding-left:18px}.muted{font-size:11px;color:#6c7884}.busy{opacity:.55;pointer-events:none}</style></head><body><div class="wrap"><p class="eyebrow">OWNER-ONLY CONTROL PLANE</p><h1>RMWUG 2026</h1><p class="lede">Review, draw, lock, issue. Students never see this panel or the registers behind it.</p><div id="state" class="state"><div class="banner">Loading…</div></div><div class="actions" id="actions"><button onclick="run('validateWorkshop')">1 · Validate roster and pods</button><button onclick="run('generateMissingAccessCodes')">2 · Generate missing access codes</button><button onclick="run('runDraftTopicDraw')">3 · Run reproducible draft draw</button><button class="primary" onclick="run('lockAssignments')">4 · Lock and publish assignments</button><button onclick="run('buildAccessCards')">5 · Build printable access cards</button></div><div class="danger"><p class="muted"><b>Lost or shared code</b> — rotate one student only.</p><div class="row"><input id="student" placeholder="S001"><button onclick="callWith('rotateStudentAccessCode','student')">Rotate</button></div><p class="muted"><b>Reopen a locked draw</b> — pauses every student lookup. Type UNLOCK.</p><div class="row"><input id="unlock" placeholder="UNLOCK"><button onclick="callWith('unlockAssignments','unlock')">Reopen</button></div></div><div id="status" class="status">Ready.</div><ul id="issues" class="issues"></ul></div><script>
  function busy(on){document.getElementById('actions').className=on?'actions busy':'actions'}
  function render(r){busy(false);document.getElementById('state').innerHTML='<div><b>'+r.rosterCount+'</b><small>students</small></div><div><b>'+r.podCount+'</b><small>pods</small></div><div><b>'+r.assignmentCount+'</b><small>assigned</small></div><div><b>'+r.accessCount+'</b><small>codes</small></div><div class="banner"><b>'+r.state+'</b><small>assignment state</small></div>';document.getElementById('status').textContent=r.message||'Complete.';document.getElementById('issues').innerHTML=(r.issues||[]).slice(0,8).map(function(x){return '<li>'+String(x).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})+'</li>'}).join('')}
  function fail(e){busy(false);document.getElementById('status').textContent='Error: '+(e.message||e)}
  function run(name){busy(true);google.script.run.withSuccessHandler(render).withFailureHandler(fail)[name]()}
  function callWith(name,id){busy(true);google.script.run.withSuccessHandler(render).withFailureHandler(fail)[name](document.getElementById(id).value)}
  google.script.run.withSuccessHandler(render).withFailureHandler(fail).getControlState();
  </script></body></html>`;
}
