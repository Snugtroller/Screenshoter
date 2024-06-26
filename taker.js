const puppeteer = require("puppeteer");
const xlsx = require("xlsx");
const path = require("path");

async function takeScreenshot(url, imagePath) {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.screenshot({ path: imagePath });
  await browser.close();
}

function readUrlsFromExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const urls = xlsx.utils.sheet_to_json(sheet, { header: 1 }).flat();
  return urls;
}

async function main() {
  const excelFilePath = "Book1.xlsx";
  const urls = readUrlsFromExcel(excelFilePath);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const imagePath = path.join(__dirname, `screenshot_${i + 1}.png`);
    console.log(`Taking screenshot of ${url}`);
    await takeScreenshot(url, imagePath);
    console.log(`Screenshot saved to ${imagePath}`);
  }
}

main();
