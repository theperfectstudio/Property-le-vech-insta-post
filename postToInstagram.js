import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function downloadImages(imageUrls) {
  const imagePaths = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const res = await fetch(imageUrls[i]);
    const buffer = await res.buffer();
    const filePath = `./temp_img_${i}.jpg`;
    fs.writeFileSync(filePath, buffer);
    imagePaths.push(path.resolve(filePath));
  }
  return imagePaths;
}

export async function postToInstagram(imageUrls, caption) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.emulate(puppeteer.devices['iPhone 12']); // enable mobile UI

  try {
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    await page.type('input[name=username]', process.env.INSTAGRAM_USER, { delay: 50 });
    await page.type('input[name=password]', process.env.INSTAGRAM_PASS, { delay: 50 });
    await page.click('button[type=submit]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('✅ Logged into Instagram');
    console.log('🖼️ Images:', imageUrls.length);
    console.log('📝 Caption:
' + caption);

    await browser.close();
    return true;

  } catch (err) {
    console.error('❌ Instagram post error:', err.message);
    await browser.close();
    return false;
  } finally {
    imageUrls.forEach((_, i) => {
      const file = `./temp_img_${i}.jpg`;
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
}
