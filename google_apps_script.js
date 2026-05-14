/**
 * Google Apps Script to serve e-commerce data as JSON.
 * Deploy as a Web App with "Anyone" access.
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productsSheet = ss.getSheetByName("Products") || ss.getSheets()[0];
  const categoriesSheet = ss.getSheetByName("Categories") || ss.getSheets()[1];
  
  const products = getSheetData(productsSheet);
  const categories = getSheetData(categoriesSheet);
  
  const result = {
    products: products,
    categories: categories
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}
