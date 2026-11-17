/**
 * ============================================================================
 * GOOGLE APPS SCRIPT PENTRU INVITAȚIA DE NUNTĂ — MARIN & ADRIANA (12.06.2027)
 * ============================================================================
 *
 * CUM SE CONFIGUREAZĂ (în 2 minute):
 *
 * 1. Intră pe https://sheets.google.com și creează un tabel nou (Blank spreadsheet).
 * 2. Denumește-l, de exemplu: "Nunta Marin & Adriana - Invitați".
 * 3. În meniul de sus al tabelului, apasă pe:
 *    Extensii (Extensions) -> Apps Script.
 * 4. Șterge orice cod existent acolo și lipește TOT codul din acest fișier.
 * 5. Apasă pe iconița de salvare (Save / Ctrl+S).
 * 6. În dreapta sus, apasă pe butonul albastru "Implementați" (Deploy) -> "Implementare nouă" (New deployment).
 * 7. La "Selectați tipul" (rotița dințată din stânga), alege "Aplicație web" (Web app).
 * 8. Completează astfel:
 *    - Descriere: RSVP Nunta
 *    - Executați ca (Execute as): "Eu" (Me)
 *    - Cine are acces (Who has access): "Oricine" (Anyone)  <-- FOARTE IMPORTANT!
 * 9. Apasă pe "Implementați" (Deploy), acordă permisiunile (Authorize access -> Advanced -> Go to project)
 *    și copiază URL-ul aplicației web (Web app URL, care se termină în /exec).
 * 10. Lipește acel URL în fișierul index.html la variabila GOOGLE_SCRIPT_URL!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Dacă tabelul este gol, creăm automat capul de tabel (antetul)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data completării",
        "Nume și Prenume",
        "Confirmare Prezență",
        "Poartă rochie albă?",
        "Cadou în loc de flori",
        "Joc de masă ales",
        "Alergii / Mențiuni"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f5ecdd");
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("ro-RO"),
      data.name || "",
      data.attendance || "",
      data.white_dress || "Nu, promit!",
      data.gift_type || "",
      data.board_game || "",
      data.allergies || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var games = [];

    if (lastRow > 1) {
      // Coloana 6 (F) conține "Joc de masă ales"
      var values = sheet.getRange(2, 6, lastRow - 1, 1).getValues();
      for (var i = 0; i < values.length; i++) {
        var g = String(values[i][0] || "").trim();
        if (g && games.indexOf(g) === -1) {
          games.push(g);
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", games: games }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", games: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
