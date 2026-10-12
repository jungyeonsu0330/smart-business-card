const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const mecard = `MECARD:N:최은지;ORG:타이어뱅크 주식회사;TIL:과장;TEL:010-7672-6707;TEL:044-850-1078;EMAIL:cej6707@tirebank.com;URL:https://www.tirebank.com;ADR:세종특별자치시 한누리대로 350(뱅크빌딩) 8층;NOTE:뱅크그룹 재경부;;`;

async function generateCleanQRs() {
  const qrOptions = {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 3,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    width: 800
  };

  // 1. Pure QR Code PNG (Korean name filename for direct phone saving)
  const pureQrPath = path.join(__dirname, '최은지_명함_QR코드.png');
  await QRCode.toFile(pureQrPath, mecard, qrOptions);
  console.log('Generated:', pureQrPath);

  // 2. Also save an English filename version for web download attribute compatibility
  const webPureQrPath = path.join(__dirname, 'choi_eunji_qr.png');
  await QRCode.toFile(webPureQrPath, mecard, qrOptions);
  console.log('Generated:', webPureQrPath);
}

generateCleanQRs().catch(console.error);
