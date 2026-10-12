const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const sampleCard = {
  name: '최은지',
  engName: 'Choi Eun-ji',
  company: '타이어뱅크 주식회사',
  title: '과장',
  department: '뱅크그룹 재경부',
  phone: '010-7672-6707',
  tel: '044-850-1078',
  email: 'cej6707@tirebank.com',
  website: 'https://www.tirebank.com',
  address: '세종특별자치시 한누리대로 350(뱅크빌딩) 8층',
  bio: '대한민국 1등 타이어 유통 전문기업 타이어뱅크 / 뱅크그룹 재경부',
  theme: 'minimal',
  socials: [
    { type: 'website', label: '타이어뱅크 공식몰', url: 'https://www.tirebank.com' }
  ]
};

const payload = {
  n: sampleCard.name,
  en: sampleCard.engName,
  c: sampleCard.company,
  t: sampleCard.title,
  d: sampleCard.department,
  p: sampleCard.phone,
  tel: sampleCard.tel,
  e: sampleCard.email,
  w: sampleCard.website,
  a: sampleCard.address,
  b: sampleCard.bio,
  th: sampleCard.theme,
  s: sampleCard.socials
};

const encoded = Buffer.from(JSON.stringify(payload)).toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

// 1. 24시간 언제 어디서나 접속 가능한 온라인 영구 배포 URL (GitHub Pages)
const onlineUrl = `https://jungyeonsu0330.github.io/smart-business-card/sample_card.html#card=${encoded}`;
const onlineShortUrl = `https://jungyeonsu0330.github.io/smart-business-card/sample_card.html`;

// 2. 로컬 Wi-Fi 접속 URL
const localUrl = `http://172.30.1.33:4173/sample_card.html#card=${encoded}`;

// 3. vCard 텍스트
const vcardText = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'FN;CHARSET=UTF-8:최은지',
  'N;CHARSET=UTF-8:최;은지;;;',
  'ORG;CHARSET=UTF-8:타이어뱅크 주식회사;뱅크그룹 재경부',
  'TITLE;CHARSET=UTF-8:과장',
  'TEL;TYPE=CELL,VOICE:010-7672-6707',
  'TEL;TYPE=WORK,VOICE:044-850-1078',
  'EMAIL;TYPE=WORK,INTERNET:cej6707@tirebank.com',
  'URL:https://www.tirebank.com',
  'ADR;TYPE=WORK;CHARSET=UTF-8:;;세종특별자치시 한누리대로 350(뱅크빌딩) 8층;;;;',
  'END:VCARD'
].join('\r\n');

async function generate() {
  const qrOpts = {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 2,
    color: {
      dark: '#1e3a8a',
      light: '#ffffff'
    },
    width: 600
  };

  // 온라인 24시간 영구 접속 QR (메인)
  await QRCode.toFile(path.join(__dirname, 'tirebank_sample_web_qr.png'), onlineShortUrl, qrOpts);
  await QRCode.toFile(path.join(__dirname, '최은지_과장_QR코드.png'), onlineShortUrl, qrOpts);
  await QRCode.toFile(path.join(__dirname, 'choi_eunji_qr.png'), onlineShortUrl, qrOpts);

  // 로컬 Wi-Fi용 QR
  await QRCode.toFile(path.join(__dirname, 'tirebank_sample_local_qr.png'), localUrl, qrOpts);

  // vCard 바로 저장용 QR
  await QRCode.toFile(path.join(__dirname, 'tirebank_sample_vcard_qr.png'), vcardText, qrOpts);

  console.log('24/7 Global Online URL:', onlineShortUrl);
  console.log('Local Wi-Fi URL:', localUrl);
  console.log('All QR codes regenerated successfully!');
}

generate().catch(console.error);
