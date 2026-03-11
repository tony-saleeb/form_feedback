# Google Sheets Setup — Balance Bites Feedback

Follow these steps to receive **unlimited, free** responses directly in a Google Sheet.

---

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it **"Balance Bites Feedback"**
4. In **Row 1**, add these headers (copy-paste this entire row):

```
التوقيت | إزاي عرفنا | معدل الشراء | التقييم العام | التقييم (رقم) | زعتر | بابريكا | ملح وفلفل | روزماري وريحان | النكهة المفضلة | الطعم | القرمشة | التغليف | السعر | التوافر | القيمة الغذائية | هينصح صحابه | اقتراحات | الاسم | الموبايل | الإيميل
```

> Use `|` as a guide — each word/phrase goes in its own column (A through U).

---

## Step 2: Add the Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. **Delete** everything in the editor
3. Paste this code:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var d = e.parameter;

  sheet.appendRow([
    d.timestamp,
    d.discovery,
    d.frequency,
    d.overallLabel,
    d.overallRating,
    d.zaatar,
    d.paprika,
    d.salt_pepper,
    d.rosemary_basil,
    d.favoriteFlavor,
    d.taste,
    d.crunchiness,
    d.packaging,
    d.price,
    d.availability,
    d.nutrition,
    d.recommend,
    d.suggestions,
    d.name,
    d.phone,
    d.email
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Save** (💾) and name the project **"BB Feedback"**

---

## Step 3: Deploy

1. Click **Deploy → New deployment**
2. Click the ⚙️ gear icon → select **Web app**
3. Set these options:
   - **Description**: Balance Bites Feedback
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → Allow
6. **Copy the Web App URL** (it looks like `https://script.google.com/macros/s/ABC.../exec`)

---

## Step 4: Paste the URL

Open `app.js` and replace this line:

```javascript
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE';
```

With your URL:

```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

---

## Done! ✅

Every time someone submits the form, a new row will appear in your Google Sheet automatically. Unlimited. Free. Forever.
