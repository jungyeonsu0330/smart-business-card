const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Helper to base64url encode JSON
function toBase64Url(str) {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const choiEunJiCard = {
  n: '최은지',
  en: 'Choi Eun-ji',
  c: '타이어뱅크 주식회사',
  t: '과장',
  d: '뱅크그룹 재경부',
  p: '010-7672-6707',
  tel: '044-850-1078',
  e: 'cej6707@tirebank.com',
  w: 'https://www.tirebank.com',
  a: '세종특별자치시 한누리대로 350(뱅크빌딩) 8층',
  b: '대한민국 1등 타이어 유통 전문기업 타이어뱅크 / 뱅크그룹 재경부',
  th: 'minimal',
  s: [
    { t: 'website', l: '타이어뱅크 공식몰', u: 'https://www.tirebank.com' }
  ]
};

const encoded = toBase64Url(JSON.stringify(choiEunJiCard));
const localUrl = `http://localhost:4173/#card=${encoded}`;
const wifiUrl = `http://172.30.1.33:4173/#card=${encoded}`;

console.log('Encoded:', encoded);
console.log('Local URL:', localUrl);
console.log('Wi-Fi URL:', wifiUrl);

// Also MECARD for direct phone address book import
const mecard = `MECARD:N:최은지;ORG:타이어뱅크 주식회사;TIL:과장;TEL:010-7672-6707;TEL:044-850-1078;EMAIL:cej6707@tirebank.com;URL:https://www.tirebank.com;ADR:세종특별자치시 한누리대로 350(뱅크빌딩) 8층;NOTE:뱅크그룹 재경부;;`;

async function generateQRs() {
  const qrOptions = {
    errorCorrectionLevel: 'M',
    type: 'png',
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    width: 600
  };

  // 1. Web link QR (using Wi-Fi IP so phone on same Wi-Fi can scan & view interactive card)
  await QRCode.toFile(
    path.join(__dirname, 'tirebank_sample_web_qr.png'),
    wifiUrl,
    qrOptions
  );

  // 2. Localhost Web link QR
  await QRCode.toFile(
    path.join(__dirname, 'tirebank_sample_local_qr.png'),
    localUrl,
    qrOptions
  );

  // 3. Contact save vCard/MECARD QR (scannable offline by any phone camera to save contact!)
  await QRCode.toFile(
    path.join(__dirname, 'tirebank_sample_vcard_qr.png'),
    mecard,
    qrOptions
  );

  console.log('QR codes generated successfully!');
}

generateQRs().catch(console.error);
