const fs = require('fs');
const path = require('path');

// Read the vCard QR code image as base64
const qrPngPath = path.join(__dirname, 'tirebank_sample_vcard_qr.png');
const qrBase64 = fs.readFileSync(qrPngPath).toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Header Gradient -->
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>

    <!-- Card Shadow Filter -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.08"/>
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.04"/>
    </filter>

    <filter id="qrShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGrad)"/>

  <!-- Top Ambient Glow -->
  <circle cx="540" cy="0" r="500" fill="#2563eb" opacity="0.08"/>
  <circle cx="900" cy="1700" r="400" fill="#38bdf8" opacity="0.06"/>

  <!-- Top Header Pill -->
  <g transform="translate(340, 120)">
    <rect width="400" height="60" rx="30" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <circle cx="36" cy="30" r="7" fill="#2563eb"/>
    <text x="56" y="38" font-family="'Pretendard', sans-serif" font-size="22" font-weight="700" fill="#1d4ed8" letter-spacing="1">스마트폰 명함 패스</text>
  </g>

  <!-- Main Card Container -->
  <g transform="translate(80, 220)" filter="url(#cardShadow)">
    <rect width="920" height="1500" rx="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>

    <!-- Top Card Header Banner -->
    <path d="M 0 48 Q 0 0 48 0 L 872 0 Q 920 0 920 48 L 920 180 L 0 180 Z" fill="url(#headerGrad)"/>

    <!-- Bank Group Emblem (Inside Top Banner) -->
    <g transform="translate(60, 42)">
      <rect width="96" height="96" rx="20" fill="#2563eb"/>
      <circle cx="48" cy="52" r="20" fill="#fbbf24"/>
      <!-- Stars -->
      <g fill="#fbbf24">
        <polygon points="48,12 50,17 56,17 51,21 53,26 48,23 43,26 45,21 40,17 46,17"/>
        <polygon points="28,18 30,23 36,23 31,27 33,32 28,29 23,32 25,27 20,23 26,23"/>
        <polygon points="68,18 70,23 76,23 71,27 73,32 68,29 63,32 65,27 60,23 66,23"/>
        <polygon points="14,32 16,37 22,37 17,41 19,46 14,43 9,46 11,41 6,37 12,37"/>
        <polygon points="82,32 84,37 90,37 85,41 87,46 82,43 77,46 79,41 74,37 80,37"/>
      </g>
      <text x="48" y="88" font-family="'Arial', sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">BANK GROUP</text>
    </g>

    <!-- Company Meta -->
    <text x="180" y="94" font-family="'Pretendard', sans-serif" font-size="34" font-weight="800" fill="#ffffff">타이어뱅크 주식회사</text>
    <text x="180" y="128" font-family="'Pretendard', sans-serif" font-size="22" font-weight="700" fill="#93c5fd" letter-spacing="2">BANK GROUP · 재경부</text>

    <!-- Tire Bank Red Badge -->
    <g transform="translate(730, 65)">
      <rect width="130" height="50" rx="12" fill="#dc2626"/>
      <text x="65" y="32" font-family="'Pretendard', sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">TIRE BANK</text>
    </g>

    <!-- Person Info Section -->
    <g transform="translate(60, 260)">
      <text x="0" y="55" font-family="'Pretendard', sans-serif" font-size="64" font-weight="900" fill="#0f172a" letter-spacing="4">최 은 지</text>
      <text x="260" y="52" font-family="'Outfit', sans-serif" font-size="28" font-weight="600" fill="#64748b">Choi Eun-ji</text>
      
      <text x="0" y="110" font-family="'Pretendard', sans-serif" font-size="30" font-weight="700" fill="#2563eb">과장  <tspan fill="#cbd5e1" font-size="24">|</tspan>  뱅크그룹 재경부</text>
      
      <!-- Bio quote box -->
      <rect x="0" y="145" width="800" height="70" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
      <rect x="0" y="145" width="8" height="70" rx="4" fill="#2563eb"/>
      <text x="30" y="190" font-family="'Pretendard', sans-serif" font-size="22" font-weight="500" fill="#334155">“대한민국 1등 타이어 유통 전문기업 타이어뱅크 / 뱅크그룹 재경부”</text>
    </g>

    <!-- Center QR Code Box -->
    <g transform="translate(160, 560)" filter="url(#qrShadow)">
      <rect width="600" height="600" rx="36" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
      <!-- QR Image -->
      <image href="data:image/png;base64,${qrBase64}" x="40" y="40" width="520" height="520"/>
    </g>

    <!-- Scan Guide Banner Below QR -->
    <g transform="translate(60, 1220)">
      <text x="400" y="0" font-family="'Pretendard', sans-serif" font-size="26" font-weight="800" fill="#0f172a" text-anchor="middle">
        스마트폰 기본 카메라로 비추면 바로 연락처가 저장됩니다
      </text>
      <text x="400" y="38" font-family="'Pretendard', sans-serif" font-size="20" font-weight="600" fill="#2563eb" text-anchor="middle">
        아이폰 · 갤럭시 기본 카메라 앱 100% 호환 (앱 설치 불필요)
      </text>
    </g>

    <!-- Bottom Contact Details Strip -->
    <g transform="translate(60, 1310)">
      <line x1="0" y1="0" x2="800" y2="0" stroke="#e2e8f0" stroke-width="2"/>
      
      <!-- Phone -->
      <text x="40" y="50" font-family="'Pretendard', sans-serif" font-size="22" font-weight="700" fill="#64748b">휴대전화</text>
      <text x="140" y="50" font-family="'Pretendard', sans-serif" font-size="24" font-weight="800" fill="#0f172a">010-7672-6707</text>

      <!-- Office Tel -->
      <text x="460" y="50" font-family="'Pretendard', sans-serif" font-size="22" font-weight="700" fill="#64748b">사무실</text>
      <text x="540" y="50" font-family="'Pretendard', sans-serif" font-size="24" font-weight="800" fill="#0f172a">044-850-1078</text>

      <!-- Email -->
      <text x="40" y="100" font-family="'Pretendard', sans-serif" font-size="22" font-weight="700" fill="#64748b">이메일</text>
      <text x="140" y="100" font-family="'Pretendard', sans-serif" font-size="24" font-weight="800" fill="#0f172a">cej6707@tirebank.com</text>

      <!-- Web -->
      <text x="460" y="100" font-family="'Pretendard', sans-serif" font-size="22" font-weight="700" fill="#64748b">웹사이트</text>
      <text x="540" y="100" font-family="'Pretendard', sans-serif" font-size="24" font-weight="800" fill="#2563eb">tirebank.com</text>

      <!-- Address -->
      <text x="40" y="150" font-family="'Pretendard', sans-serif" font-size="20" font-weight="700" fill="#64748b">본사</text>
      <text x="140" y="150" font-family="'Pretendard', sans-serif" font-size="20" font-weight="700" fill="#475569">세종특별자치시 한누리대로 350 (뱅크빌딩) 8층</text>
    </g>
  </g>

  <!-- Bottom Watermark -->
  <text x="540" y="1800" font-family="'Pretendard', sans-serif" font-size="20" font-weight="600" fill="#94a3b8" text-anchor="middle">
    CardLink AI Smart Business Card · 대한민국 1등 타이어뱅크
  </text>
</svg>`;

const outPath = path.join(__dirname, 'choi_eunji_mobile_pass.svg');
fs.writeFileSync(outPath, svgContent, 'utf8');
console.log('Generated choi_eunji_mobile_pass.svg successfully!');
