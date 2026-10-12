/**
 * CardLink - Interactive Smart Business Card System
 * Full Client-Side Serverless Architecture
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Data Schema & Initial State
  // =========================================================================

  const STORAGE_KEY = 'cardlink_my_card_v1';

  const BANK_GROUP_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160"><rect width="160" height="160" rx="30" fill="%231e3a8a"/><circle cx="80" cy="85" r="32" fill="%23eab308"/><g fill="%23eab308"><polygon points="80,18 83,27 92,27 85,32 87,41 80,36 73,41 75,32 68,27 77,27"/><polygon points="46,28 49,37 58,37 51,42 53,51 46,46 39,51 41,42 34,37 43,37"/><polygon points="114,28 117,37 126,37 119,42 121,51 114,46 107,51 109,42 102,37 111,37"/><polygon points="24,52 27,61 36,61 29,66 31,75 24,70 17,75 19,66 12,61 21,61"/><polygon points="136,52 139,61 148,61 141,66 143,75 136,70 129,75 131,66 124,61 133,61"/><polygon points="18,84 21,93 30,93 23,98 25,107 18,102 11,107 13,98 6,93 15,93"/><polygon points="142,84 145,93 154,93 147,98 149,107 142,102 135,107 137,98 130,93 139,93"/></g><text x="80" y="145" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="%23ffffff" text-anchor="middle" letter-spacing="1">BANK GROUP</text></svg>`;

  const DEFAULT_SAMPLE_CARD = {
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
    avatar: BANK_GROUP_LOGO_SVG,
    socials: [
      { type: 'website', label: '타이어뱅크 공식몰', url: 'https://www.tirebank.com' },
      { type: 'blog', label: '타이어뱅크 블로그', url: 'https://blog.naver.com/tirebank_story' },
      { type: 'youtube', label: '타이어뱅크 유튜브', url: 'https://www.youtube.com/@tirebank' }
    ]
  };

  let currentCard = { ...DEFAULT_SAMPLE_CARD };
  let isReceiverMode = false;
  let activeQRType = 'web'; // 'web' or 'vcard'

  // Network Host Configuration for Smartphone Scanning
  const DETECTED_WIFI_IP = '172.30.1.33';
  const CLOUD_ONLINE_URL = 'https://jungyeonsu0330.github.io/smart-business-card';
  let hostMode = 'cloud'; // 'wifi', 'localhost', 'custom'
  let customBaseUrl = '';

  // Social options presets
  const SOCIAL_PRESETS = [
    { type: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { type: 'github', label: 'GitHub', icon: '🐙' },
    { type: 'instagram', label: 'Instagram', icon: '📸' },
    { type: 'kakao', label: '카카오톡', icon: '💬' },
    { type: 'youtube', label: 'YouTube', icon: '▶️' },
    { type: 'twitter', label: 'X (Twitter)', icon: '🐦' },
    { type: 'blog', label: '블로그/노션', icon: '📝' }
  ];

  // =========================================================================
  // 2. DOM Selectors
  // =========================================================================

  const DOM = {
    // Form Inputs
    form: document.getElementById('card-form'),
    inputName: document.getElementById('input-name'),
    inputEngName: document.getElementById('input-eng-name'),
    inputCompany: document.getElementById('input-company'),
    inputTitle: document.getElementById('input-title'),
    inputDept: document.getElementById('input-department'),
    inputBio: document.getElementById('input-bio'),
    inputPhone: document.getElementById('input-phone'),
    inputTel: document.getElementById('input-tel'),
    inputEmail: document.getElementById('input-email'),
    inputWebsite: document.getElementById('input-website'),
    inputAddress: document.getElementById('input-address'),
    avatarInput: document.getElementById('avatar-file-input'),
    formAvatarImg: document.getElementById('form-avatar-img'),
    formAvatarPlaceholder: document.getElementById('form-avatar-placeholder'),
    removeAvatarBtn: document.getElementById('remove-avatar-btn'),
    socialsContainer: document.getElementById('socials-container'),
    addSocialBtn: document.getElementById('add-social-btn'),
    loadSampleBtn: document.getElementById('load-sample-btn'),
    resetCardBtn: document.getElementById('reset-card-btn'),
    autosaveStatus: document.getElementById('autosave-status'),

    // Card Preview Elements
    cardWrapper: document.getElementById('card-3d-wrapper'),
    cardRenderFront: document.getElementById('card-render-front'),
    cardName: document.getElementById('card-name'),
    cardEngName: document.getElementById('card-eng-name'),
    cardCompany: document.getElementById('card-company'),
    cardTitleDept: document.getElementById('card-title-dept'),
    cardBio: document.getElementById('card-bio'),
    cardBioBox: document.getElementById('card-bio-box'),
    cardAvatarImg: document.getElementById('card-avatar-img'),
    cardAvatarFallback: document.getElementById('card-avatar-fallback'),
    cardSocialsWrap: document.getElementById('card-socials-wrap'),
    
    // Quick Buttons on Card
    actionCall: document.getElementById('action-call'),
    actionEmail: document.getElementById('action-email'),
    actionSms: document.getElementById('action-sms'),
    actionWebsite: document.getElementById('action-website'),
    
    // Details Rows
    rowPhone: document.getElementById('row-phone'),
    valPhone: document.getElementById('detail-phone-val'),
    rowEmail: document.getElementById('row-email'),
    valEmail: document.getElementById('detail-email-val'),
    rowAddress: document.getElementById('row-address'),
    valAddress: document.getElementById('detail-address-val'),

    // Back of Card
    cardBackQrContainer: document.getElementById('card-back-qr-container'),
    backName: document.getElementById('back-name'),
    backCompanyTitle: document.getElementById('back-company-title'),
    backToFrontBtn: document.getElementById('back-to-front-btn'),
    backShareBtn: document.getElementById('back-share-btn'),

    // Preview Controls
    flipCardBtn: document.getElementById('flip-card-btn'),
    quickQrBtn: document.getElementById('quick-qr-btn'),
    quickQrHeaderBtn: document.getElementById('quick-qr-header-btn'),
    shareHeaderBtn: document.getElementById('share-header-btn'),
    openShareModalBtn: document.getElementById('open-share-modal-btn'),
    previewOpenBtn: document.getElementById('preview-open-btn'),
    saveVcardBtn: document.getElementById('save-vcard-btn'),

    // Receiver Banner
    receiverBanner: document.getElementById('receiver-banner'),
    receiverTitle: document.getElementById('receiver-title'),
    createMyCardBtn: document.getElementById('create-my-card-btn'),

    // Mobile Tabs
    tabEditBtn: document.getElementById('tab-edit-btn'),
    tabPreviewBtn: document.getElementById('tab-preview-btn'),

    // Modals
    qrModal: document.getElementById('qr-modal'),
    closeQrModalBtn: document.getElementById('close-qr-modal-btn'),
    modalQrRender: document.getElementById('modal-qr-render'),
    qrModeWebBtn: document.getElementById('qr-mode-web-btn'),
    qrModeVcardBtn: document.getElementById('qr-mode-vcard-btn'),
    qrModeHint: document.getElementById('qr-mode-hint'),
    downloadQrBtn: document.getElementById('download-qr-btn'),
    copyCardLinkBtn: document.getElementById('copy-card-link-btn'),

    // QR Host guidance elements
    qrHostGuideBox: document.getElementById('qr-host-guide-box'),
    hostGuideText: document.getElementById('host-guide-text'),
    pillCloudBtn: document.getElementById('pill-cloud-btn'),
    pillWifiIpBtn: document.getElementById('pill-wifi-ip-btn'),
    pillLocalhostBtn: document.getElementById('pill-localhost-btn'),
    pillCustomUrlBtn: document.getElementById('pill-custom-url-btn'),
    customUrlRow: document.getElementById('custom-url-row'),
    customBaseUrlInput: document.getElementById('custom-base-url-input'),
    saveCustomUrlBtn: document.getElementById('save-custom-url-btn'),

    shareModal: document.getElementById('share-modal'),
    closeShareModalBtn: document.getElementById('close-share-modal-btn'),
    nativeShareBtn: document.getElementById('native-share-btn'),
    nfcShareBtn: document.getElementById('nfc-share-btn'),
    urlCopyChannelBtn: document.getElementById('url-copy-channel-btn'),
    vcardDownloadChannelBtn: document.getElementById('vcard-download-channel-btn'),
    nfcWriteStatus: document.getElementById('nfc-write-status'),

    // Toast
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toast-message'),
    toastIcon: document.getElementById('toast-icon'),

    // OCR & Business Card Scanner Elements
    scanCardHeaderBtn: document.getElementById('scan-card-header-btn'),
    btnHeroScan: document.getElementById('btn-hero-scan'),
    btnHeroDemoTest: document.getElementById('btn-hero-demo-test'),
    previewScanBtn: document.getElementById('preview-scan-btn'),
    ocrModal: document.getElementById('ocr-modal'),
    closeOcrModalBtn: document.getElementById('close-ocr-modal-btn'),
    ocrTabUpload: document.getElementById('ocr-tab-upload'),
    ocrTabCamera: document.getElementById('ocr-tab-camera'),
    ocrTabDemo: document.getElementById('ocr-tab-demo'),
    ocrViewUpload: document.getElementById('ocr-view-upload'),
    ocrViewCamera: document.getElementById('ocr-view-camera'),
    ocrDropzone: document.getElementById('ocr-dropzone'),
    ocrFileInput: document.getElementById('ocr-file-input'),
    ocrCameraMobileInput: document.getElementById('ocr-camera-mobile-input'),
    ocrCameraVideo: document.getElementById('ocr-camera-video'),
    ocrCaptureBtn: document.getElementById('ocr-capture-btn'),
    ocrStopCameraBtn: document.getElementById('ocr-stop-camera-btn'),
    ocrImageToolbar: document.getElementById('ocr-image-toolbar'),
    ocrPreviewImg: document.getElementById('ocr-preview-img'),
    ocrCanvas: document.getElementById('ocr-canvas'),
    ocrRotateBtn: document.getElementById('ocr-rotate-btn'),
    ocrFilterBtn: document.getElementById('ocr-filter-btn'),
    filterBtnLabel: document.getElementById('filter-btn-label'),
    ocrReselectBtn: document.getElementById('ocr-reselect-btn'),
    optLocalEngine: document.getElementById('opt-local-engine'),
    optGeminiEngine: document.getElementById('opt-gemini-engine'),
    geminiKeyBox: document.getElementById('gemini-key-box'),
    geminiApiKeyInput: document.getElementById('gemini-api-key-input'),
    ocrStartAnalyzeBtn: document.getElementById('ocr-start-analyze-btn'),
    ocrLoadingView: document.getElementById('ocr-loading-view'),
    ocrLoadingStatus: document.getElementById('ocr-loading-status'),
    ocrProgressBarFill: document.getElementById('ocr-progress-bar-fill'),
    ocrProgressPct: document.getElementById('ocr-progress-pct'),
    ocrResultView: document.getElementById('ocr-result-view'),
    ocrFieldName: document.getElementById('ocr-field-name'),
    ocrFieldEngName: document.getElementById('ocr-field-engname'),
    ocrFieldCompany: document.getElementById('ocr-field-company'),
    ocrFieldTitle: document.getElementById('ocr-field-title'),
    ocrFieldDept: document.getElementById('ocr-field-dept'),
    ocrFieldPhone: document.getElementById('ocr-field-phone'),
    ocrFieldTel: document.getElementById('ocr-field-tel'),
    ocrFieldEmail: document.getElementById('ocr-field-email'),
    ocrFieldWebsite: document.getElementById('ocr-field-website'),
    ocrFieldAddress: document.getElementById('ocr-field-address'),
    ocrFieldBio: document.getElementById('ocr-field-bio'),
    ocrUseImageAsAvatar: document.getElementById('ocr-use-image-as-avatar'),
    ocrRawTextBox: document.getElementById('ocr-raw-text-box'),
    ocrBackToToolsBtn: document.getElementById('ocr-back-to-tools-btn'),
    ocrApplyAndQrBtn: document.getElementById('ocr-apply-and-qr-btn')
  };

  // =========================================================================
  // 3. URL Encoding & Base64 Helpers (Zero Backend)
  // =========================================================================

  function toBase64Url(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  function fromBase64Url(base64url) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  /**
   * Generates a sharable business card URL with encoded payload
   */
  function generateShareUrl(card) {
    // Exclude oversized avatar from the URL so QR codes stay clean and scan effortlessly
    const shareablePayload = {
      n: card.name || '',
      en: card.engName || '',
      c: card.company || '',
      t: card.title || '',
      d: card.department || '',
      p: card.phone || '',
      tel: card.tel || '',
      e: card.email || '',
      w: card.website || '',
      a: card.address || '',
      b: card.bio || '',
      th: card.theme || 'midnight',
      s: (card.socials || []).map(s => ({ t: s.type, l: s.label, u: s.url }))
    };

    const encoded = toBase64Url(JSON.stringify(shareablePayload));
    
    // Determine base URL (Wi-Fi IP, custom URL, or current host)
    let baseUrl = '';
    if (hostMode === 'custom' && customBaseUrl) {
      baseUrl = customBaseUrl.endsWith('/') ? customBaseUrl.slice(0, -1) : customBaseUrl;
      return `${baseUrl}/#card=${encoded}`;
    }

    try {
      if (hostMode === 'cloud') {
        baseUrl = `${CLOUD_ONLINE_URL}/sample_card.html`;
        return `${baseUrl}#card=${encoded}`;
      }
      const current = new URL(window.location.href);
      if (hostMode === 'wifi') {
        const port = current.port ? `:${current.port}` : '';
        baseUrl = `${current.protocol}//${DETECTED_WIFI_IP}${port}${current.pathname}`;
      } else {
        baseUrl = `${current.origin}${current.pathname}`;
      }
    } catch (e) {
      baseUrl = window.location.href.split('#')[0].split('?')[0];
    }

    return `${baseUrl}#card=${encoded}`;
  }

  /**
   * Parses card payload from URL hash or query params
   */
  function parseCardFromUrl() {
    try {
      let hash = window.location.hash;
      let encodedData = null;

      if (hash.startsWith('#card=')) {
        encodedData = hash.substring(6);
      } else {
        const params = new URLSearchParams(window.location.search);
        if (params.has('card')) {
          encodedData = params.get('card');
        }
      }

      if (!encodedData) return null;

      const jsonStr = fromBase64Url(encodedData);
      const parsed = JSON.parse(jsonStr);

      // Reconstruct full card object from compact representation
      return {
        name: parsed.n || '',
        engName: parsed.en || '',
        company: parsed.c || '',
        title: parsed.t || '',
        department: parsed.d || '',
        phone: parsed.p || '',
        tel: parsed.tel || '',
        email: parsed.e || '',
        website: parsed.w || '',
        address: parsed.a || '',
        bio: parsed.b || '',
        theme: parsed.th || 'midnight',
        avatar: '', // Note: URL payload keeps images lightweight
        socials: (parsed.s || []).map(s => ({
          type: s.t,
          label: s.l,
          url: s.u
        }))
      };
    } catch (err) {
      console.warn('Failed to parse card from URL:', err);
      return null;
    }
  }

  // =========================================================================
  // 4. vCard (RFC 2426 v3.0) & MECARD Generation
  // =========================================================================

  /**
   * Generates a standard vCard 3.0 file content with full Korean & UTF-8 support
   */
  function generateVCardContent(card) {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'PRODID:-//CardLink//Smart Digital Business Card//KO'
    ];

    // Formatted Name & Name parts
    if (card.name) {
      lines.push(`FN;CHARSET=UTF-8:${card.name}`);
      lines.push(`N;CHARSET=UTF-8:${card.name};;;;`);
    }

    // Organization & Department
    if (card.company || card.department) {
      const org = [card.company || '', card.department || ''].filter(Boolean).join(';');
      lines.push(`ORG;CHARSET=UTF-8:${org}`);
    }

    // Job Title
    if (card.title) {
      lines.push(`TITLE;CHARSET=UTF-8:${card.title}`);
    }

    // Phone numbers
    if (card.phone) {
      const cleanPhone = card.phone.replace(/[^0-9+\-]/g, '');
      lines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
    }
    if (card.tel) {
      const cleanTel = card.tel.replace(/[^0-9+\-]/g, '');
      lines.push(`TEL;TYPE=WORK,VOICE:${cleanTel}`);
    }

    // Email
    if (card.email) {
      lines.push(`EMAIL;TYPE=WORK,INTERNET:${card.email.trim()}`);
    }

    // Website
    if (card.website) {
      lines.push(`URL:${card.website.trim()}`);
    }

    // Address
    if (card.address) {
      lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${card.address.trim()};;;;`);
    }

    // Bio / Note
    if (card.bio) {
      // Escape newlines for vCard specification
      const safeBio = card.bio.replace(/\n/g, '\\n');
      lines.push(`NOTE;CHARSET=UTF-8:${safeBio}`);
    }

    lines.push(`REV:${new Date().toISOString()}`);
    lines.push('END:VCARD');

    return lines.join('\r\n');
  }

  /**
   * Downloads .vcf file to phone or PC
   */
  function downloadVCard(card) {
    const vcardText = generateVCardContent(card);
    const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
    const filename = `${(card.name || '스마트명함').trim()}.vcf`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    showToast('주소록 연락처 파일(.vcf)이 생성되었습니다! 📲');
  }

  /**
   * Generates a compact MECARD string for offline camera QR scan
   */
  function generateMeCard(card) {
    let me = 'MECARD:';
    if (card.name) me += `N:${card.name};`;
    if (card.company) me += `ORG:${card.company};`;
    if (card.title) me += `TIL:${card.title};`;
    if (card.phone) me += `TEL:${card.phone.replace(/[^0-9+\-]/g, '')};`;
    if (card.email) me += `EMAIL:${card.email};`;
    if (card.website) me += `URL:${card.website};`;
    if (card.address) me += `ADR:${card.address};`;
    if (card.bio) me += `NOTE:${card.bio.replace(/;/g, ' ')};`;
    me += ';';
    return me;
  }

  // =========================================================================
  // 5. QR Code Generator Engine
  // =========================================================================

  /**
   * Renders QR code SVG into target container
   */
  function renderQRCode(container, text, cellSize = 5) {
    if (!container || !window.qrcode) return;
    try {
      container.innerHTML = '';
      const qr = window.qrcode(0, 'M');
      qr.addData(text, 'Byte');
      qr.make();
      
      const svgTag = qr.createSvgTag(cellSize, 0);
      container.innerHTML = svgTag;
    } catch (err) {
      console.error('QR code generation error:', err);
      container.innerHTML = '<p style="color:red; font-size:12px;">QR 생성 오류 (데이터가 너무 깁니다)</p>';
    }
  }

  /**
   * Generates a PNG Data URL from QR Code for image download
   */
  function createQRPngDataUrl(text, size = 300) {
    return new Promise((resolve, reject) => {
      try {
        const qr = window.qrcode(0, 'M');
        qr.addData(text, 'Byte');
        qr.make();
        const moduleCount = qr.getModuleCount();
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const margin = 20;
        const cellSize = (size - margin * 2) / moduleCount;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Dark modules
        ctx.fillStyle = '#0f172a';
        for (let r = 0; r < moduleCount; r++) {
          for (let c = 0; c < moduleCount; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(
                margin + c * cellSize,
                margin + r * cellSize,
                cellSize + 0.5,
                cellSize + 0.5
              );
            }
          }
        }
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    });
  }

  // =========================================================================
  // 6. Proximity Sharing & Web NFC
  // =========================================================================

  /**
   * Triggers Native System Share Sheet (AirDrop / Quick Share / Messenger)
   */
  async function triggerNativeShare(card) {
    const shareUrl = generateShareUrl(card);
    const shareData = {
      title: `${card.name || '디지털'}님의 스마트 명함`,
      text: `${card.company || ''} ${card.title || ''} ${card.name || ''}님의 디지털 명함입니다.`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('명함 공유가 완료되었습니다 ✨');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(shareUrl);
    }
  }

  /**
   * Web NFC API for direct contactless tap
   */
  async function triggerWebNFC(card) {
    const shareUrl = generateShareUrl(card);
    DOM.nfcWriteStatus.classList.remove('hidden');

    if ('NDEFReader' in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.write({
          records: [{ recordType: 'url', data: shareUrl }]
        });
        DOM.nfcWriteStatus.classList.add('hidden');
        showToast('🎉 NFC 카드에 명함 링크가 성공적으로 기록되었습니다!');
      } catch (err) {
        DOM.nfcWriteStatus.classList.add('hidden');
        showToast('NFC 쓰기 취소 또는 오류: ' + (err.message || '다시 시도해주세요'));
      }
    } else {
      DOM.nfcWriteStatus.classList.add('hidden');
      alert(
        '💡 NFC 태그 공유 안내:\n\n' +
        '1. 스마트폰 뒷면에 부착하는 저렴한 실물 NFC 스티커(태그)에 이 명함 링크를 저장할 수 있습니다.\n' +
        '2. Android 크롬 브라우저에서는 직접 NFC 쓰기가 가능하며,\n' +
        '3. iPhone에서는 "단축어" 앱이나 "NFC Tools" 무료 앱으로 명함 링크를 입력하시면 탭 한 번으로 명함이 전달됩니다!\n\n' +
        '현재 명함 링크가 클립보드에 복사되었습니다.'
      );
      copyToClipboard(shareUrl);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 명함 링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('📋 명함 링크가 복사되었습니다!');
    } catch (e) {
      showToast('복사 권한이 제한되었습니다. 수동으로 복사해주세요.');
    }
    document.body.removeChild(textArea);
  }

  // =========================================================================
  // 7. UI Rendering & Synchronization
  // =========================================================================

  /**
   * Applies the theme class to body
   */
  function applyTheme(themeName) {
    document.body.classList.remove(
      'theme-midnight',
      'theme-cyber',
      'theme-emerald',
      'theme-sunset',
      'theme-royal',
      'theme-minimal'
    );
    document.body.classList.add(`theme-${themeName || 'midnight'}`);
  }

  /**
   * Renders the digital card preview with the current state
   */
  function updateCardPreview() {
    const card = currentCard;

    // Theme
    applyTheme(card.theme);

    // Profile Info
    DOM.cardName.textContent = card.name || '성명';
    DOM.cardEngName.textContent = card.engName || '';
    DOM.cardCompany.textContent = card.company || '소속 회사명';
    
    const titleAndDept = [card.title, card.department].filter(Boolean).join(' · ');
    DOM.cardTitleDept.textContent = titleAndDept || '직함 / 부서';

    // Bio
    if (card.bio && card.bio.trim()) {
      DOM.cardBio.textContent = card.bio;
      DOM.cardBioBox.classList.remove('hidden');
    } else {
      DOM.cardBioBox.classList.add('hidden');
    }

    // Avatar
    if (card.avatar) {
      DOM.cardAvatarImg.src = card.avatar;
      DOM.cardAvatarImg.classList.remove('hidden');
      DOM.cardAvatarFallback.classList.add('hidden');
    } else {
      DOM.cardAvatarImg.src = '';
      DOM.cardAvatarImg.classList.add('hidden');
      DOM.cardAvatarFallback.classList.remove('hidden');
      DOM.cardAvatarFallback.textContent = (card.name && card.name.length > 0) ? card.name.charAt(0) : '명';
    }

    // Quick Action Links
    if (card.phone) {
      const cleanPhone = card.phone.replace(/[^0-9+\-]/g, '');
      DOM.actionCall.href = `tel:${cleanPhone}`;
      DOM.actionSms.href = `sms:${cleanPhone}`;
      DOM.actionCall.classList.remove('hidden');
      DOM.actionSms.classList.remove('hidden');
    } else {
      DOM.actionCall.classList.add('hidden');
      DOM.actionSms.classList.add('hidden');
    }

    if (card.email) {
      DOM.actionEmail.href = `mailto:${card.email.trim()}`;
      DOM.actionEmail.classList.remove('hidden');
    } else {
      DOM.actionEmail.classList.add('hidden');
    }

    if (card.website) {
      let web = card.website.trim();
      if (!web.startsWith('http://') && !web.startsWith('https://')) {
        web = 'https://' + web;
      }
      DOM.actionWebsite.href = web;
      DOM.actionWebsite.classList.remove('hidden');
    } else {
      DOM.actionWebsite.classList.add('hidden');
    }

    // Detail rows
    if (card.phone) {
      DOM.valPhone.textContent = card.phone;
      DOM.rowPhone.classList.remove('hidden');
    } else {
      DOM.rowPhone.classList.add('hidden');
    }

    if (card.email) {
      DOM.valEmail.textContent = card.email;
      DOM.rowEmail.classList.remove('hidden');
    } else {
      DOM.rowEmail.classList.add('hidden');
    }

    if (card.address) {
      DOM.valAddress.textContent = card.address;
      DOM.rowAddress.classList.remove('hidden');
    } else {
      DOM.rowAddress.classList.add('hidden');
    }

    // Social Badges on Card
    renderSocialBadges(card.socials || []);

    // Back of Card Info
    DOM.backName.textContent = card.name || '성명';
    DOM.backCompanyTitle.textContent = `${card.company || ''} ${card.title ? '· ' + card.title : ''}`;

    // Render Back QR Code
    const backQRData = generateShareUrl(card);
    renderQRCode(DOM.cardBackQrContainer, backQRData, 4);

    // Save to LocalStorage (only when not in receiver mode)
    if (!isReceiverMode) {
      saveCardToStorage();
    }
  }

  /**
   * Renders Social badges list on the card preview
   */
  function renderSocialBadges(socials) {
    DOM.cardSocialsWrap.innerHTML = '';
    if (!socials || socials.length === 0) return;

    socials.forEach(s => {
      if (!s.url || !s.url.trim()) return;
      const a = document.createElement('a');
      a.className = 'social-badge-pill';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      
      let safeUrl = s.url.trim();
      if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
        safeUrl = 'https://' + safeUrl;
      }
      a.href = safeUrl;

      // Icon emoji based on preset
      const preset = SOCIAL_PRESETS.find(p => p.type === s.type);
      const icon = preset ? preset.icon : '🔗';

      a.innerHTML = `<span>${icon}</span><span>${s.label || preset?.label || 'Link'}</span>`;
      DOM.cardSocialsWrap.appendChild(a);
    });
  }

  /**
   * Renders the dynamic social input rows in the editor form
   */
  function renderSocialInputs() {
    DOM.socialsContainer.innerHTML = '';
    (currentCard.socials || []).forEach((social, index) => {
      const row = document.createElement('div');
      row.className = 'social-input-row';

      // Type Selector
      let selectHtml = `<select class="social-type-select" data-index="${index}">`;
      SOCIAL_PRESETS.forEach(p => {
        const isSel = p.type === social.type ? 'selected' : '';
        selectHtml += `<option value="${p.type}" ${isSel}>${p.icon} ${p.label}</option>`;
      });
      selectHtml += `</select>`;

      row.innerHTML = `
        ${selectHtml}
        <input type="url" class="social-url-input" data-index="${index}" placeholder="URL 링크 입력" value="${social.url || ''}">
        <button type="button" class="btn-sm btn-ghost danger remove-social-btn" data-index="${index}" title="삭제">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      DOM.socialsContainer.appendChild(row);
    });
  }

  /**
   * Fills the form fields from the current card object
   */
  function syncCardToForm() {
    const card = currentCard;
    DOM.inputName.value = card.name || '';
    DOM.inputEngName.value = card.engName || '';
    DOM.inputCompany.value = card.company || '';
    DOM.inputTitle.value = card.title || '';
    DOM.inputDept.value = card.department || '';
    DOM.inputBio.value = card.bio || '';
    DOM.inputPhone.value = card.phone || '';
    DOM.inputTel.value = card.tel || '';
    DOM.inputEmail.value = card.email || '';
    DOM.inputWebsite.value = card.website || '';
    DOM.inputAddress.value = card.address || '';

    // Theme Radio
    const themeRadio = document.querySelector(`input[name="cardTheme"][value="${card.theme || 'midnight'}"]`);
    if (themeRadio) themeRadio.checked = true;

    // Avatar in Form
    if (card.avatar) {
      DOM.formAvatarImg.src = card.avatar;
      DOM.formAvatarImg.classList.remove('hidden');
      DOM.formAvatarPlaceholder.classList.add('hidden');
      DOM.removeAvatarBtn.classList.remove('hidden');
    } else {
      DOM.formAvatarImg.src = '';
      DOM.formAvatarImg.classList.add('hidden');
      DOM.formAvatarPlaceholder.classList.remove('hidden');
      DOM.removeAvatarBtn.classList.add('hidden');
    }

    renderSocialInputs();
  }

  /**
   * Reads data from form fields and updates current card
   */
  function syncFormToCard() {
    currentCard.name = DOM.inputName.value.trim();
    currentCard.engName = DOM.inputEngName.value.trim();
    currentCard.company = DOM.inputCompany.value.trim();
    currentCard.title = DOM.inputTitle.value.trim();
    currentCard.department = DOM.inputDept.value.trim();
    currentCard.bio = DOM.inputBio.value.trim();
    currentCard.phone = DOM.inputPhone.value.trim();
    currentCard.tel = DOM.inputTel.value.trim();
    currentCard.email = DOM.inputEmail.value.trim();
    currentCard.website = DOM.inputWebsite.value.trim();
    currentCard.address = DOM.inputAddress.value.trim();

    const selectedTheme = document.querySelector('input[name="cardTheme"]:checked');
    if (selectedTheme) {
      currentCard.theme = selectedTheme.value;
    }

    updateCardPreview();
  }

  // =========================================================================
  // 8. Image Compression & Avatar Upload
  // =========================================================================

  function handleAvatarUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('이미지 파일만 등록할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        // Resize down to max 240x240 for fast loading and compactness
        const maxDim = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        currentCard.avatar = compressedDataUrl;

        DOM.formAvatarImg.src = compressedDataUrl;
        DOM.formAvatarImg.classList.remove('hidden');
        DOM.formAvatarPlaceholder.classList.add('hidden');
        DOM.removeAvatarBtn.classList.remove('hidden');

        updateCardPreview();
        showToast('프로필 사진이 등록되었습니다! 📸');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // =========================================================================
  // 9. QR Presentation Modal
  // =========================================================================

  function openQRModal() {
    updateModalQR();
    if (typeof DOM.qrModal.showModal === 'function') {
      DOM.qrModal.showModal();
    } else {
      DOM.qrModal.setAttribute('open', '');
    }
  }

  function closeQRModal() {
    if (typeof DOM.qrModal.close === 'function') {
      DOM.qrModal.close();
    } else {
      DOM.qrModal.removeAttribute('open');
    }
  }

  function updateModalQR() {
    let textToEncode = '';
    if (activeQRType === 'web') {
      textToEncode = generateShareUrl(currentCard);
      DOM.qrModeHint.textContent = '스마트폰 카메라로 비추면 감각적인 모바일 웹 명함이 바로 열립니다.';
      DOM.qrModeWebBtn.classList.add('active');
      DOM.qrModeVcardBtn.classList.remove('active');
      if (DOM.qrHostGuideBox) DOM.qrHostGuideBox.classList.remove('hidden');
    } else {
      // Offline MeCard (No internet required, works 100% anywhere!)
      textToEncode = generateMeCard(currentCard);
      DOM.qrModeHint.textContent = '인터넷 없이도 카메라로 스캔하는 즉시 스마트폰 기본 주소록에 연락처가 등록됩니다! 📲';
      DOM.qrModeVcardBtn.classList.add('active');
      DOM.qrModeWebBtn.classList.remove('active');
      if (DOM.qrHostGuideBox) DOM.qrHostGuideBox.classList.add('hidden');
    }

    renderQRCode(DOM.modalQrRender, textToEncode, 6);
  }

  // =========================================================================
  // 10. Proximity Share Modal
  // =========================================================================

  function openShareModal() {
    if (typeof DOM.shareModal.showModal === 'function') {
      DOM.shareModal.showModal();
    } else {
      DOM.shareModal.setAttribute('open', '');
    }
  }

  function closeShareModal() {
    if (typeof DOM.shareModal.close === 'function') {
      DOM.shareModal.close();
    } else {
      DOM.shareModal.removeAttribute('open');
    }
  }

  // =========================================================================
  // 11. Storage & Persistence
  // =========================================================================

  function saveCardToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCard));
      DOM.autosaveStatus.style.opacity = '1';
      setTimeout(() => {
        DOM.autosaveStatus.style.opacity = '0.7';
      }, 1000);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function loadCardFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage load failed:', e);
    }
    return null;
  }

  // =========================================================================
  // 12. Toast Feedback
  // =========================================================================

  let toastTimer = null;
  function showToast(msg, duration = 3000) {
    if (!DOM.toast) return;
    DOM.toastMsg.textContent = msg;
    DOM.toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toast.classList.add('hidden');
    }, duration);
  }

  // =========================================================================
  // 13. Event Listeners Setup
  // =========================================================================

  function setupEventListeners() {
    // Form Input typing synchronization
    DOM.form.addEventListener('input', (e) => {
      if (e.target.classList.contains('social-url-input')) {
        const idx = parseInt(e.target.dataset.index, 10);
        if (currentCard.socials[idx]) {
          currentCard.socials[idx].url = e.target.value;
          updateCardPreview();
        }
        return;
      }
      syncFormToCard();
    });

    // Social Type dropdown change
    DOM.socialsContainer.addEventListener('change', (e) => {
      if (e.target.classList.contains('social-type-select')) {
        const idx = parseInt(e.target.dataset.index, 10);
        const preset = SOCIAL_PRESETS.find(p => p.type === e.target.value);
        if (currentCard.socials[idx]) {
          currentCard.socials[idx].type = e.target.value;
          currentCard.socials[idx].label = preset ? preset.label : 'Link';
          updateCardPreview();
        }
      }
    });

    // Remove Social button
    DOM.socialsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.remove-social-btn');
      if (btn) {
        const idx = parseInt(btn.dataset.index, 10);
        currentCard.socials.splice(idx, 1);
        renderSocialInputs();
        updateCardPreview();
      }
    });

    // Add Social button
    DOM.addSocialBtn.addEventListener('click', () => {
      currentCard.socials.push({
        type: 'linkedin',
        label: 'LinkedIn',
        url: ''
      });
      renderSocialInputs();
      updateCardPreview();
    });

    // Theme selector
    document.querySelectorAll('input[name="cardTheme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentCard.theme = e.target.value;
        updateCardPreview();
      });
    });

    // Avatar Upload & Remove
    DOM.avatarInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleAvatarUpload(e.target.files[0]);
      }
    });

    DOM.removeAvatarBtn.addEventListener('click', () => {
      currentCard.avatar = '';
      DOM.formAvatarImg.src = '';
      DOM.formAvatarImg.classList.add('hidden');
      DOM.formAvatarPlaceholder.classList.remove('hidden');
      DOM.removeAvatarBtn.classList.add('hidden');
      DOM.avatarInput.value = '';
      updateCardPreview();
      showToast('프로필 사진이 삭제되었습니다.');
    });

    // Flip Card Toggle
    DOM.flipCardBtn.addEventListener('click', () => {
      DOM.cardWrapper.classList.toggle('is-flipped');
    });

    DOM.backToFrontBtn.addEventListener('click', () => {
      DOM.cardWrapper.classList.remove('is-flipped');
    });

    // Save vCard button on card
    DOM.saveVcardBtn.addEventListener('click', () => {
      downloadVCard(currentCard);
    });

    // QR Presentation Triggers
    DOM.quickQrBtn.addEventListener('click', openQRModal);
    DOM.quickQrHeaderBtn.addEventListener('click', openQRModal);
    DOM.closeQrModalBtn.addEventListener('click', closeQRModal);

    // QR Modal Type toggles
    DOM.qrModeWebBtn.addEventListener('click', () => {
      activeQRType = 'web';
      updateModalQR();
    });
    DOM.qrModeVcardBtn.addEventListener('click', () => {
      activeQRType = 'vcard';
      updateModalQR();
    });

    // QR Host Guidance Pills
    if (DOM.pillCloudBtn) {
      DOM.pillCloudBtn.addEventListener('click', () => {
        hostMode = 'cloud';
        DOM.pillCloudBtn.classList.add('active');
        if (DOM.pillWifiIpBtn) DOM.pillWifiIpBtn.classList.remove('active');
        if (DOM.pillLocalhostBtn) DOM.pillLocalhostBtn.classList.remove('active');
        if (DOM.pillCustomUrlBtn) DOM.pillCustomUrlBtn.classList.remove('active');
        if (DOM.customUrlRow) DOM.customUrlRow.classList.add('hidden');
        updateModalQR();
        showToast('🌐 24시간 온라인 클라우드 모드: 어디서나 동시 접속 가능합니다!');
      });
    }

    if (DOM.pillWifiIpBtn) {
      DOM.pillWifiIpBtn.addEventListener('click', () => {
        if (DOM.pillCloudBtn) DOM.pillCloudBtn.classList.remove('active');
        hostMode = 'wifi';
        DOM.pillWifiIpBtn.classList.add('active');
        DOM.pillLocalhostBtn.classList.remove('active');
        DOM.pillCustomUrlBtn.classList.remove('active');
        DOM.customUrlRow.classList.add('hidden');
        updateModalQR();
        showToast('📶 Wi-Fi IP (172.30.1.33) 모드로 전환되었습니다.');
      });
    }

    if (DOM.pillLocalhostBtn) {
      DOM.pillLocalhostBtn.addEventListener('click', () => {
        hostMode = 'localhost';
        DOM.pillLocalhostBtn.classList.add('active');
        DOM.pillWifiIpBtn.classList.remove('active');
        DOM.pillCustomUrlBtn.classList.remove('active');
        DOM.customUrlRow.classList.add('hidden');
        updateModalQR();
        showToast('💻 PC 로컬(localhost) 모드로 전환되었습니다.');
      });
    }

    if (DOM.pillCustomUrlBtn) {
      DOM.pillCustomUrlBtn.addEventListener('click', () => {
        hostMode = 'custom';
        DOM.pillCustomUrlBtn.classList.add('active');
        DOM.pillWifiIpBtn.classList.remove('active');
        DOM.pillLocalhostBtn.classList.remove('active');
        DOM.customUrlRow.classList.remove('hidden');
        DOM.customBaseUrlInput.focus();
      });
    }

    if (DOM.saveCustomUrlBtn) {
      DOM.saveCustomUrlBtn.addEventListener('click', () => {
        const val = DOM.customBaseUrlInput.value.trim();
        if (val) {
          customBaseUrl = val;
          hostMode = 'custom';
          updateModalQR();
          showToast('🌐 배포 주소가 QR 코드에 적용되었습니다!');
        } else {
          showToast('배포 주소를 입력해주세요.');
        }
      });
    }

    // Download QR Code image
    DOM.downloadQrBtn.addEventListener('click', async () => {
      const textToEncode = activeQRType === 'web'
        ? generateShareUrl(currentCard)
        : generateMeCard(currentCard);

      const pngData = await createQRPngDataUrl(textToEncode, 400);
      const link = document.createElement('a');
      link.href = pngData;
      link.download = `${currentCard.name || '명함'}_QR코드.png`;
      link.click();
      showToast('고화질 QR 코드 이미지가 다운로드되었습니다! 🖼️');
    });

    // Copy Link in QR Modal
    DOM.copyCardLinkBtn.addEventListener('click', () => {
      const shareUrl = generateShareUrl(currentCard);
      copyToClipboard(shareUrl);
    });

    // Proximity Sharing Triggers
    DOM.shareHeaderBtn.addEventListener('click', openShareModal);
    DOM.openShareModalBtn.addEventListener('click', openShareModal);
    DOM.backShareBtn.addEventListener('click', openShareModal);
    DOM.closeShareModalBtn.addEventListener('click', closeShareModal);

    // Share Options in Modal
    DOM.nativeShareBtn.addEventListener('click', () => {
      closeShareModal();
      triggerNativeShare(currentCard);
    });

    DOM.nfcShareBtn.addEventListener('click', () => {
      triggerWebNFC(currentCard);
    });

    DOM.urlCopyChannelBtn.addEventListener('click', () => {
      closeShareModal();
      const shareUrl = generateShareUrl(currentCard);
      copyToClipboard(shareUrl);
    });

    DOM.vcardDownloadChannelBtn.addEventListener('click', () => {
      closeShareModal();
      downloadVCard(currentCard);
    });

    // Sample data loader
    DOM.loadSampleBtn.addEventListener('click', () => {
      if (confirm('샘플 데이터로 교체하시겠습니까? 현재 작성 중인 내용이 덮어쓰여집니다.')) {
        currentCard = { ...DEFAULT_SAMPLE_CARD };
        syncCardToForm();
        updateCardPreview();
        showToast('샘플 명함 데이터가 적용되었습니다 ✨');
      }
    });

    // Reset card
    DOM.resetCardBtn.addEventListener('click', () => {
      if (confirm('모든 내용을 초기화하고 새 명함을 작성하시겠습니까?')) {
        currentCard = {
          name: '',
          engName: '',
          company: '',
          title: '',
          department: '',
          phone: '',
          tel: '',
          email: '',
          website: '',
          address: '',
          bio: '',
          theme: 'midnight',
          avatar: '',
          socials: []
        };
        syncCardToForm();
        updateCardPreview();
        showToast('명함이 초기화되었습니다.');
      }
    });

    // Receiver Mode: Create My Card Button
    DOM.createMyCardBtn.addEventListener('click', () => {
      window.location.hash = '';
      window.location.search = '';
      window.location.reload();
    });

    // Mobile Tabs: Editor vs Preview
    DOM.tabEditBtn.addEventListener('click', () => {
      document.body.classList.remove('mobile-view-preview');
      document.body.classList.add('mobile-view-editor');
      DOM.tabEditBtn.classList.add('active');
      DOM.tabPreviewBtn.classList.remove('active');
    });

    DOM.tabPreviewBtn.addEventListener('click', () => {
      document.body.classList.remove('mobile-view-editor');
      document.body.classList.add('mobile-view-preview');
      DOM.tabPreviewBtn.classList.add('active');
      DOM.tabEditBtn.classList.remove('active');
    });

    DOM.previewOpenBtn.addEventListener('click', () => {
      DOM.tabPreviewBtn.click();
    });

    // Close modals on clicking backdrop
    [DOM.qrModal, DOM.shareModal, DOM.ocrModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (typeof modal.close === 'function') modal.close();
          else modal.removeAttribute('open');
          if (modal === DOM.ocrModal) {
            stopLiveWebcam();
          }
        }
      });
    });

    // OCR Scanner Triggers
    if (DOM.scanCardHeaderBtn) DOM.scanCardHeaderBtn.addEventListener('click', openOcrModal);
    if (DOM.btnHeroScan) DOM.btnHeroScan.addEventListener('click', openOcrModal);
    if (DOM.previewScanBtn) DOM.previewScanBtn.addEventListener('click', openOcrModal);
    if (DOM.closeOcrModalBtn) DOM.closeOcrModalBtn.addEventListener('click', closeOcrModal);

    // Hero Demo Test Button
    if (DOM.btnHeroDemoTest) {
      DOM.btnHeroDemoTest.addEventListener('click', () => {
        openOcrModal();
        triggerDemoBusinessCard();
      });
    }

    // OCR Modal Tab Navigation
    if (DOM.ocrTabUpload) DOM.ocrTabUpload.addEventListener('click', () => setOcrTab('upload'));
    if (DOM.ocrTabCamera) DOM.ocrTabCamera.addEventListener('click', () => setOcrTab('camera'));
    if (DOM.ocrTabDemo) DOM.ocrTabDemo.addEventListener('click', triggerDemoBusinessCard);

    // OCR Dropzone and File inputs
    if (DOM.ocrDropzone) {
      DOM.ocrDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.ocrDropzone.classList.add('dragover');
      });
      DOM.ocrDropzone.addEventListener('dragleave', () => {
        DOM.ocrDropzone.classList.remove('dragover');
      });
      DOM.ocrDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        DOM.ocrDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleOcrImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (DOM.ocrFileInput) {
      DOM.ocrFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleOcrImageFile(e.target.files[0]);
        }
      });
    }

    if (DOM.ocrCameraMobileInput) {
      DOM.ocrCameraMobileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleOcrImageFile(e.target.files[0]);
        }
      });
    }

    // Camera Viewfinder Controls
    if (DOM.ocrCaptureBtn) DOM.ocrCaptureBtn.addEventListener('click', captureLiveWebcam);
    if (DOM.ocrStopCameraBtn) DOM.ocrStopCameraBtn.addEventListener('click', stopLiveWebcam);

    // Image Toolbar Controls
    if (DOM.ocrRotateBtn) DOM.ocrRotateBtn.addEventListener('click', rotateOcrImage);
    if (DOM.ocrFilterBtn) DOM.ocrFilterBtn.addEventListener('click', toggleOcrContrastFilter);
    if (DOM.ocrReselectBtn) DOM.ocrReselectBtn.addEventListener('click', resetOcrImageSelection);

    // Engine Selection Radios
    const engineRadios = document.querySelectorAll('input[name="ocrEngine"]');
    engineRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        ocrSelectedEngine = e.target.value;
        if (ocrSelectedEngine === 'gemini') {
          DOM.optGeminiEngine.classList.add('active');
          DOM.optLocalEngine.classList.remove('active');
          DOM.geminiKeyBox.classList.remove('hidden');
        } else {
          DOM.optLocalEngine.classList.add('active');
          DOM.optGeminiEngine.classList.remove('active');
          DOM.geminiKeyBox.classList.add('hidden');
        }
      });
    });

    if (DOM.geminiApiKeyInput) {
      // Load saved key if any
      const savedKey = localStorage.getItem('cardlink_gemini_api_key');
      if (savedKey) DOM.geminiApiKeyInput.value = savedKey;
      DOM.geminiApiKeyInput.addEventListener('change', (e) => {
        localStorage.setItem('cardlink_gemini_api_key', e.target.value.trim());
      });
    }

    // Start Analysis
    if (DOM.ocrStartAnalyzeBtn) DOM.ocrStartAnalyzeBtn.addEventListener('click', runOcrAnalysis);

    // Result Actions
    if (DOM.ocrBackToToolsBtn) DOM.ocrBackToToolsBtn.addEventListener('click', backToImageTools);
    if (DOM.ocrApplyAndQrBtn) DOM.ocrApplyAndQrBtn.addEventListener('click', applyOcrResultAndCreateQR);

    // Subtle 3D Card Tilt Effect on Mouse Move
    const cardEl = DOM.cardRenderFront;
    if (cardEl && window.matchMedia('(min-width: 992px)').matches) {
      cardEl.addEventListener('mousemove', (e) => {
        const rect = cardEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;
        cardEl.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      cardEl.addEventListener('mouseleave', () => {
        cardEl.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  // =========================================================================
  // 14. OCR Business Card Scanner & Smart Korean Parser Engine
  // =========================================================================

  let ocrSourceImage = null; // HTMLImageElement
  let ocrRotation = 0; // 0, 90, 180, 270
  let ocrContrastEnhanced = false;
  let ocrSelectedEngine = 'local';
  let liveCameraStream = null;
  let ocrProcessedDataUrl = '';
  let ocrParsedData = {};

  function openOcrModal() {
    if (typeof DOM.ocrModal.showModal === 'function') {
      DOM.ocrModal.showModal();
    } else {
      DOM.ocrModal.setAttribute('open', '');
    }
    setOcrTab('upload');
  }

  function closeOcrModal() {
    stopLiveWebcam();
    if (typeof DOM.ocrModal.close === 'function') {
      DOM.ocrModal.close();
    } else {
      DOM.ocrModal.removeAttribute('open');
    }
  }

  function setOcrTab(tabName) {
    if (tabName !== 'camera') {
      stopLiveWebcam();
    }

    DOM.ocrTabUpload.classList.toggle('active', tabName === 'upload');
    DOM.ocrTabCamera.classList.toggle('active', tabName === 'camera');
    DOM.ocrTabDemo.classList.toggle('active', tabName === 'demo');

    if (tabName === 'upload') {
      DOM.ocrViewUpload.classList.remove('hidden');
      DOM.ocrViewCamera.classList.add('hidden');
    } else if (tabName === 'camera') {
      DOM.ocrViewUpload.classList.add('hidden');
      DOM.ocrViewCamera.classList.remove('hidden');
      startLiveWebcam();
    }
  }

  // --- Live Webcam Viewfinder ---
  async function startLiveWebcam() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('이 브라우저에서는 카메라 직접 연결을 지원하지 않습니다. 사진 업로드를 이용해주세요.');
      setOcrTab('upload');
      return;
    }

    try {
      stopLiveWebcam();
      // Prefer environment (back) camera on phones, fallback to default on PC
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      liveCameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      DOM.ocrCameraVideo.srcObject = liveCameraStream;
      await DOM.ocrCameraVideo.play();
    } catch (err) {
      console.warn('Camera access failed:', err);
      showToast('카메라 접근 권한이 필요합니다. 사진 파일 업로드를 이용해주세요.');
      setOcrTab('upload');
    }
  }

  function stopLiveWebcam() {
    if (liveCameraStream) {
      liveCameraStream.getTracks().forEach(track => track.stop());
      liveCameraStream = null;
    }
    if (DOM.ocrCameraVideo) {
      DOM.ocrCameraVideo.srcObject = null;
    }
  }

  function captureLiveWebcam() {
    if (!DOM.ocrCameraVideo || DOM.ocrCameraVideo.videoWidth === 0) {
      showToast('카메라 화면이 준비되지 않았습니다.');
      return;
    }

    const video = DOM.ocrCameraVideo;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stopLiveWebcam();
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    handleOcrDataUrl(dataUrl);
    showToast('📸 명함 사진이 캡처되었습니다!');
  }

  // --- Image Handling & Preprocessing ---
  function handleOcrImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG 등)을 선택해주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      handleOcrDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleOcrDataUrl(dataUrl) {
    const img = new Image();
    img.onload = () => {
      ocrSourceImage = img;
      ocrRotation = 0;
      ocrContrastEnhanced = false;
      if (DOM.filterBtnLabel) DOM.filterBtnLabel.textContent = '대비 보정 ON';

      DOM.ocrViewUpload.classList.add('hidden');
      DOM.ocrViewCamera.classList.add('hidden');
      DOM.ocrLoadingView.classList.add('hidden');
      DOM.ocrResultView.classList.add('hidden');
      DOM.ocrImageToolbar.classList.remove('hidden');

      updateProcessedOcrImage();
    };
    img.src = dataUrl;
  }

  function resetOcrImageSelection() {
    ocrSourceImage = null;
    ocrProcessedDataUrl = '';
    DOM.ocrImageToolbar.classList.add('hidden');
    DOM.ocrLoadingView.classList.add('hidden');
    DOM.ocrResultView.classList.add('hidden');
    setOcrTab('upload');
  }

  function rotateOcrImage() {
    if (!ocrSourceImage) return;
    ocrRotation = (ocrRotation + 90) % 360;
    updateProcessedOcrImage();
  }

  function toggleOcrContrastFilter() {
    ocrContrastEnhanced = !ocrContrastEnhanced;
    if (DOM.filterBtnLabel) {
      DOM.filterBtnLabel.textContent = ocrContrastEnhanced ? '대비 보정 OFF' : '대비 보정 ON';
    }
    updateProcessedOcrImage();
  }

  function backToImageTools() {
    DOM.ocrResultView.classList.add('hidden');
    DOM.ocrLoadingView.classList.add('hidden');
    DOM.ocrImageToolbar.classList.remove('hidden');
  }

  function updateProcessedOcrImage() {
    if (!ocrSourceImage) return;

    const canvas = DOM.ocrCanvas;
    const ctx = canvas.getContext('2d');

    // Downscale if too large to ensure snappy OCR performance
    const maxDim = 1600;
    let w = ocrSourceImage.width;
    let h = ocrSourceImage.height;

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    // Account for 90 or 270 deg rotation
    if (ocrRotation === 90 || ocrRotation === 270) {
      canvas.width = h;
      canvas.height = w;
    } else {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((ocrRotation * Math.PI) / 180);

    if (ocrRotation === 90 || ocrRotation === 270) {
      ctx.drawImage(ocrSourceImage, -h / 2, -w / 2, h, w);
    } else {
      ctx.drawImage(ocrSourceImage, -w / 2, -h / 2, w, h);
    }
    ctx.restore();

    // Contrast Enhancement & Grayscale for high accuracy OCR
    if (ocrContrastEnhanced) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const contrast = 1.6; // High contrast
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        // Luminance grayscale
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const enhanced = factor * (gray - 128) + 128;
        const clamped = Math.min(255, Math.max(0, enhanced));
        data[i] = clamped;
        data[i + 1] = clamped;
        data[i + 2] = clamped;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    ocrProcessedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    DOM.ocrPreviewImg.src = ocrProcessedDataUrl;
  }

  // --- Demo Business Card Generator ---
  function triggerDemoBusinessCard() {
    setOcrTab('demo');
    DOM.ocrTabDemo.classList.add('active');

    // Load the user's uploaded real-world business card photograph
    handleOcrDataUrl('sample_card.jpg');
    showToast('📸 타이어뱅크(최은지 과장) 실물 명함 사진이 로드되었습니다! [스마트 명함 분석 시작]을 눌러보세요.');
  }

  // --- OCR Analysis Engine Execution ---
  async function runOcrAnalysis() {
    if (!ocrProcessedDataUrl) {
      showToast('명함 사진이 선택되지 않았습니다.');
      return;
    }

    DOM.ocrImageToolbar.classList.add('hidden');
    DOM.ocrLoadingView.classList.remove('hidden');
    DOM.ocrResultView.classList.add('hidden');

    DOM.ocrLoadingStatus.textContent = '명함 분석 엔진 초기화 중...';
    DOM.ocrProgressBarFill.style.width = '15%';
    DOM.ocrProgressPct.textContent = '15%';

    try {
      if (ocrSelectedEngine === 'gemini') {
        const apiKey = DOM.geminiApiKeyInput.value.trim() || localStorage.getItem('cardlink_gemini_api_key');
        if (!apiKey) {
          throw new Error('Google Gemini API 키가 입력되지 않았습니다. API 키를 입력하거나 기본 스마트 OCR 모드를 선택해주세요.');
        }
        await runGeminiVisionAnalysis(ocrProcessedDataUrl, apiKey);
      } else {
        await runLocalTesseractAnalysis(ocrProcessedDataUrl);
      }
    } catch (err) {
      console.error('OCR Error:', err);
      DOM.ocrLoadingView.classList.add('hidden');
      DOM.ocrImageToolbar.classList.remove('hidden');
      alert('⚠️ 명함 분석 중 안내:\n' + (err.message || '인식에 실패했습니다.'));
    }
  }

  // --- Engine A: Local Tesseract.js Analysis ---
  async function runLocalTesseractAnalysis(dataUrl) {
    if (typeof window.Tesseract === 'undefined') {
      throw new Error('OCR 엔진 라이브러리(Tesseract.js)를 불러오는 중입니다. 인터넷 연결을 확인해주세요.');
    }

    DOM.ocrLoadingStatus.textContent = '한글 & 영문 문자 인식 모델 로딩 중...';
    DOM.ocrProgressBarFill.style.width = '30%';
    DOM.ocrProgressPct.textContent = '30%';

    const result = await window.Tesseract.recognize(dataUrl, 'kor+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const pct = Math.min(95, Math.max(30, Math.round(m.progress * 100)));
          DOM.ocrProgressBarFill.style.width = `${pct}%`;
          DOM.ocrProgressPct.textContent = `${pct}%`;
          DOM.ocrLoadingStatus.textContent = `명함 텍스트 및 레이아웃 인식 중 (${pct}%)...`;
        }
      }
    });

    const rawText = result.data ? result.data.text : '';
    DOM.ocrLoadingStatus.textContent = '인적사항 및 연락처 스마트 파싱 중...';
    DOM.ocrProgressBarFill.style.width = '100%';
    DOM.ocrProgressPct.textContent = '100%';

    const parsed = parseKoreanBusinessCard(rawText);
    ocrParsedData = parsed;

    setTimeout(() => {
      DOM.ocrLoadingView.classList.add('hidden');
      populateOcrResultFields(parsed, rawText);
      DOM.ocrResultView.classList.remove('hidden');
      showToast('🎉 명함 정보가 성공적으로 추출되었습니다!');
    }, 400);
  }

  // --- Engine B: Gemini Vision AI Analysis ---
  async function runGeminiVisionAnalysis(dataUrl, apiKey) {
    DOM.ocrLoadingStatus.textContent = 'Google Gemini Vision AI 모델에 연결 중...';
    DOM.ocrProgressBarFill.style.width = '45%';
    DOM.ocrProgressPct.textContent = '45%';

    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const prompt = `당신은 대한민국 최고의 명함 OCR 전문가입니다. 이 명함 사진에서 인적사항과 연락처 정보를 정밀 추출하여 반드시 유효한 JSON 형식으로만 응답하세요.
키 이름:
- name: 성명(한글 이름)
- engName: 영문 이름
- company: 회사명 또는 단체명
- title: 직책, 직급, 직함
- department: 부서명 또는 팀명
- phone: 휴대전화번호 (010-XXXX-XXXX 형식)
- tel: 회사 유선전화번호
- email: 이메일 주소
- website: 회사 웹사이트 또는 포트폴리오 URL
- address: 회사 도로명 주소 또는 오피스 주소
- bio: 슬로건, 비전 문구, 또는 한 줄 소개

JSON 외의 다른 말(마크다운 코드블록 등)은 일절 포함하지 마세요.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Gemini API 호출 실패 (HTTP ${response.status})`);
    }

    const resJson = await response.json();
    const candidate = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean JSON markdown fences if present
    const cleaned = candidate.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini JSON parse fallback:', candidate);
      parsed = parseKoreanBusinessCard(candidate);
    }

    ocrParsedData = parsed;
    DOM.ocrProgressBarFill.style.width = '100%';
    DOM.ocrProgressPct.textContent = '100%';

    DOM.ocrLoadingView.classList.add('hidden');
    populateOcrResultFields(parsed, candidate);
    DOM.ocrResultView.classList.remove('hidden');
    showToast('✨ Gemini AI 분석 완료! 명함 정보가 추출되었습니다.');
  }

  // --- Korean Business Card Heuristic Parser ---
  function parseKoreanBusinessCard(text) {
    if (!text || typeof text !== 'string') return {};

    const rawLines = text.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const result = {
      name: '',
      engName: '',
      company: '',
      title: '',
      department: '',
      phone: '',
      tel: '',
      email: '',
      website: '',
      address: '',
      bio: ''
    };

    const TITLE_KEYWORDS = [
      '대표이사', '대표', 'CEO', 'CTO', 'COO', 'CFO', 'CMO', 'CIO', 'CSO',
      '부사장', '전무이사', '전무', '상무이사', '상무', '이사', '본부장', '실장', '팀장',
      '부장', '차장', '과장', '대리', '주임', '사원', '인턴',
      '수석연구원', '책임연구원', '선임연구원', '전임연구원', '연구원', '연구소장',
      '총괄디렉터', '디렉터', '크리에이티브디렉터', '프로덕트매니저', '프로젝트매니저',
      '매니저', '리드', '엔지니어', '개발자', '디자이너', '기획자', '컨설턴트', '마케터',
      'President', 'Vice President', 'Director', 'Manager', 'Lead', 'Senior',
      'Engineer', 'Developer', 'Designer', 'Consultant', 'Researcher', 'Founder'
    ];

    const DEPT_SUFFIXES = ['팀', '부', '실', '본부', '사업부', '개발실', '연구소', '센터', '그룹', 'Division', 'Dept', 'Department', 'Team'];
    const COMPANY_KEYWORDS = ['(주)', '주식회사', '(유)', '유한회사', '사단법인', '재단법인', 'Co., Ltd.', 'Co.,Ltd.', 'Inc.', 'Corp.', 'LLC', 'Ltd.', '테크', '솔루션', '시스템', '스튜디오', '연구소', '랩', '인터내셔널', '그룹'];

    const remainingLines = [];

    // Pass 1: Extract high-confidence structured fields (Email, Website, Phone, Tel, Address)
    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      let matchedField = false;

      // 1. Email extraction
      const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch && !result.email) {
        result.email = emailMatch[0].toLowerCase();
        matchedField = true;
      }

      // 2. Website extraction
      const urlMatch = line.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}\.(?:com|co\.kr|net|kr|io|org|me|ai|app|biz|info)(?:\/[^\s]*)?/i);
      if (urlMatch && !result.website && (!emailMatch || !line.includes('@'))) {
        let cleanUrl = urlMatch[0];
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = 'https://' + cleanUrl;
        }
        result.website = cleanUrl;
        matchedField = true;
      }

      // 3. Mobile Phone extraction
      const mobileMatch = line.match(/(?:\+82[ -.]?|0)1[016789][ -.]?\d{3,4}[ -.]?\d{4}/);
      if (mobileMatch && !result.phone) {
        const cleanP = mobileMatch[0].replace(/[^0-9+]/g, '');
        if (cleanP.length === 11 && cleanP.startsWith('010')) {
          result.phone = `${cleanP.slice(0, 3)}-${cleanP.slice(3, 7)}-${cleanP.slice(7)}`;
        } else if (cleanP.length === 10 && cleanP.startsWith('01')) {
          result.phone = `${cleanP.slice(0, 3)}-${cleanP.slice(3, 6)}-${cleanP.slice(6)}`;
        } else {
          result.phone = mobileMatch[0];
        }
        matchedField = true;
      }

      // 4. Office Telephone / Tel extraction
      const telMatch = line.match(/(?:(?:Tel|T|전화|사무실|대표)[ :.-]*)?(?:\+82[ -.]?|0)[2-6][1-5]?[ -.]?\d{3,4}[ -.]?\d{4}/i);
      if (telMatch && !result.tel && (!mobileMatch || telMatch[0] !== mobileMatch[0])) {
        const digitsOnly = telMatch[0].replace(/[^0-9]/g, '');
        if (digitsOnly.startsWith('02') && digitsOnly.length >= 9) {
          result.tel = digitsOnly.length === 10
            ? `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`
            : `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 5)}-${digitsOnly.slice(5)}`;
        } else if (digitsOnly.length >= 10) {
          result.tel = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, digitsOnly.length - 4)}-${digitsOnly.slice(digitsOnly.length - 4)}`;
        } else {
          result.tel = telMatch[0].replace(/^(?:Tel|T|전화|사무실|대표)[ :.-]*/i, '').trim();
        }
        matchedField = true;
      }

      // 5. Korean Address - directly match starting from region
      const addrMatch = line.match(/(?:서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주).+/);
      if (addrMatch && !result.address) {
        result.address = addrMatch[0].trim();
        matchedField = true;
      }

      // 6. Slogan / Quotes (Bio)
      if (!result.bio && (line.includes('“') || line.includes('”') || line.includes('"'))) {
        result.bio = line.replace(/^[“"']+|[”"']+$/g, '').trim();
        matchedField = true;
      }

      if (!matchedField) {
        remainingLines.push(line);
      }
    }

    // Pass 2: Check lines with combined Name & English Name (e.g. "김 민 준 / Minjun Kim" or "홍길동 Gildong Hong")
    for (let i = remainingLines.length - 1; i >= 0; i--) {
      const line = remainingLines[i];
      
      const combinedNameMatch = line.match(/^([가-힣\s]{2,6})\s*[/|·]\s*([A-Za-z\s]+)$/);
      if (combinedNameMatch && !result.name) {
        result.name = combinedNameMatch[1].replace(/\s+/g, '');
        result.engName = combinedNameMatch[2].trim();
        remainingLines.splice(i, 1);
        continue;
      }

      // Pure English company subtitle like "NEXT TECHNOLOGY INC."
      if (!result.bio && /^[A-Z\s.,()&'-]+(?:INC|CORP|CO|LTD|TECH|GROUP|LAB)[A-Z\s.,()&'-]*$/i.test(line)) {
        continue;
      }
    }

    // Pass 3: Process composite lines (e.g. "대표이사 · CEO | 신사업 AI 추진본부")
    for (let i = remainingLines.length - 1; i >= 0; i--) {
      const line = remainingLines[i];

      if (line.includes('|') || line.includes('/') || line.includes('·')) {
        const subParts = line.split(/[|/]/).map(p => p.trim()).filter(Boolean);
        let consumed = false;
        for (const part of subParts) {
          if (!result.title && TITLE_KEYWORDS.some(tk => part.includes(tk))) {
            result.title = part;
            consumed = true;
          } else if (!result.department && DEPT_SUFFIXES.some(ds => part.endsWith(ds))) {
            result.department = part;
            consumed = true;
          }
        }
        if (consumed) {
          remainingLines.splice(i, 1);
        }
      }
    }

    // Pass 4: Extract Title, Department, Company, and Name from remaining
    for (let i = 0; i < remainingLines.length; i++) {
      const line = remainingLines[i];

      // Company check
      if (!result.company) {
        for (const compKey of COMPANY_KEYWORDS) {
          if (line.includes(compKey)) {
            result.company = line;
            break;
          }
        }
      }

      // Title check
      if (!result.title) {
        for (const titleKey of TITLE_KEYWORDS) {
          if (line.includes(titleKey)) {
            result.title = line;
            break;
          }
        }
      }

      // Department check
      if (!result.department) {
        for (const suffix of DEPT_SUFFIXES) {
          if (line.endsWith(suffix) && (!result.title || !result.title.includes(line))) {
            result.department = line;
            break;
          }
        }
      }

      // Name check (Hangul 2~4 chars with or without spaces, ignoring stray OCR symbols)
      if (!result.name) {
        const hangulOnly = line.replace(/[^가-힣\s]/g, '').trim();
        const cleanName = hangulOnly.replace(/\s+/g, '');
        if (/^[가-힣]{2,4}$/.test(cleanName) && 
            !TITLE_KEYWORDS.includes(cleanName) && 
            !DEPT_SUFFIXES.some(s => cleanName.endsWith(s)) && 
            !COMPANY_KEYWORDS.some(k => cleanName.includes(k))) {
          result.name = cleanName;
        }
      }

      // English Name check
      if (!result.engName && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/.test(line)) {
        result.engName = line;
      }
    }

    // Auto infer website from corporate email domain if missing
    if (!result.website && result.email) {
      const parts = result.email.split('@');
      if (parts.length > 1) {
        const domain = parts[1].toLowerCase();
        const publicEmailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'hanmail.net', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
        if (!publicEmailDomains.includes(domain)) {
          result.website = `https://www.${domain}`;
        }
      }
    }

    // Fallback for company name: take the first remaining line that is not name/title
    if (!result.company && remainingLines.length > 0) {
      const candidate = remainingLines.find(l => l !== result.name && l !== result.title && l !== result.department);
      if (candidate) result.company = candidate;
    }

    return result;
  }

  function populateOcrResultFields(data, rawText) {
    DOM.ocrFieldName.value = data.name || '';
    DOM.ocrFieldEngName.value = data.engName || '';
    DOM.ocrFieldCompany.value = data.company || '';
    DOM.ocrFieldTitle.value = data.title || '';
    DOM.ocrFieldDept.value = data.department || '';
    DOM.ocrFieldPhone.value = data.phone || '';
    DOM.ocrFieldTel.value = data.tel || '';
    DOM.ocrFieldEmail.value = data.email || '';
    DOM.ocrFieldWebsite.value = data.website || '';
    DOM.ocrFieldAddress.value = data.address || '';
    DOM.ocrFieldBio.value = data.bio || '';
    DOM.ocrRawTextBox.textContent = rawText || '(인식된 원문 텍스트가 없습니다)';
  }

  // --- Final Step: Apply Data & Instantly Create QR Code ---
  function applyOcrResultAndCreateQR() {
    const name = DOM.ocrFieldName.value.trim();
    if (!name) {
      alert('성명(이름)을 입력해주세요.');
      DOM.ocrFieldName.focus();
      return;
    }

    currentCard.name = name;
    currentCard.engName = DOM.ocrFieldEngName.value.trim();
    currentCard.company = DOM.ocrFieldCompany.value.trim();
    currentCard.title = DOM.ocrFieldTitle.value.trim();
    currentCard.department = DOM.ocrFieldDept.value.trim();
    currentCard.phone = DOM.ocrFieldPhone.value.trim();
    currentCard.tel = DOM.ocrFieldTel.value.trim();
    currentCard.email = DOM.ocrFieldEmail.value.trim();
    currentCard.website = DOM.ocrFieldWebsite.value.trim();
    currentCard.address = DOM.ocrFieldAddress.value.trim();
    currentCard.bio = DOM.ocrFieldBio.value.trim();

    // Optionally set scanned business card image as avatar/logo
    if (DOM.ocrUseImageAsAvatar.checked && ocrProcessedDataUrl) {
      currentCard.avatar = ocrProcessedDataUrl;
    }

    // 1. Update form & 3D preview
    syncCardToForm();
    updateCardPreview();
    saveCardToStorage();

    // 2. Close OCR modal
    closeOcrModal();

    // 3. Automatically open QR Presentation Modal!
    setTimeout(() => {
      openQRModal();
      showToast('🎉 명함 사진이 디지털 명함으로 변환되었으며 QR 코드가 생성되었습니다! 📲', 4500);
    }, 200);
  }

  // =========================================================================
  // 14. App Initialization
  // =========================================================================

  function initApp() {
    // 1. Check if launched in Receiver Mode (via shared link)
    const sharedCard = parseCardFromUrl();
    if (sharedCard && sharedCard.name) {
      isReceiverMode = true;
      currentCard = sharedCard;
      document.body.classList.add('mode-receiver');
      DOM.receiverBanner.classList.remove('hidden');
      DOM.receiverTitle.textContent = `${currentCard.name}님의 스마트 디지털 명함`;
      document.title = `${currentCard.name} - 스마트 디지털 명함 | CardLink`;
    } else {
      // 2. Creator Mode: Load saved card or default sample
      const savedCard = loadCardFromStorage();
      if (savedCard && savedCard.name && savedCard.name !== '홍길동') {
        currentCard = { ...DEFAULT_SAMPLE_CARD, ...savedCard };
      } else {
        currentCard = { ...DEFAULT_SAMPLE_CARD };
      }
      document.body.classList.add('mobile-view-editor');
    }

    // 3. Populate form & card
    syncCardToForm();
    updateCardPreview();

    // 4. Setup listeners
    setupEventListeners();
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
