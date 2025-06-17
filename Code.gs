function doGetEssential(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find essential column indices
  const nameIndex = headers.indexOf('Name');
  const breedIndex = headers.indexOf('Breed AI');
  const photoIndex = headers.indexOf('mini_pic_1');
  const genderIndex = headers.indexOf('Gender');
  const ageIndex = headers.indexOf('Approx_Age');
  const locationIndex = headers.indexOf('Location_kennel');
  const dogIdIndex = headers.indexOf('Dog ID');
  
  const essentialData = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    essentialData.push({
      "Dog ID": row[dogIdIndex],
      "Name": row[nameIndex],
      "Breed": row[breedIndex],
      "Photo": row[photoIndex],
      "Gender": row[genderIndex],
      "Age": row[ageIndex],
      "Location": row[locationIndex]
    });
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(essentialData))
    .setMimeType(ContentService.MimeType.JSON);
}

// Modified main function to check for parameters
function doGet(e) {
  if (e.parameter.mode === 'essential') {
    return doGetEssential(e);
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get all data in one call instead of multiple calls
  const range = sheet.getDataRange();
  const data = range.getValues();
  
  // ... rest of processing
  
  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'Access-Control-Allow-Origin': '*'
    });
} 