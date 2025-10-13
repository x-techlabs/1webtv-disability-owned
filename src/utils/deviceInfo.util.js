import { v4 as uuidv4 } from 'uuid';

// Generate or persist device ID (IFA)
export const getDeviceId = () => {
  let uid = localStorage.getItem('device_uid');
  if (!uid) {
    uid = uuidv4();
    localStorage.setItem('device_uid', uid);
  }
  return uid;
};

export const getDeviceModel = () => {
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) return 'Android Device';
  if (/Macintosh/i.test(ua)) return 'Mac';
  if (/Windows/i.test(ua)) return 'Windows PC';
  if (/Linux/i.test(ua)) return 'Linux Machine';
  return 'Unknown Device';
};

export const getUserAgent = () => {
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    return navigator.userAgent.replace(/\s/g, '');
  }
  return 'UnknownUA';
};

export const getDeviceDimensions = () => ({
  width: window.screen.width,
  height: window.screen.height,
});

export const getDeviceOs = () => {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'MacOS';
  if (platform.includes('linux')) return 'Linux';
  if (/iphone|ipad|ipod/.test(platform)) return 'iOS';
  if (/android/.test(platform)) return 'Android';
  return 'Unknown OS';
};

export const getDeviceOsVersion = () => {
  const ua = navigator.userAgent;
  let match;

  match = ua.match(/Windows NT ([0-9.]+)/);
  if (match) return match[1];

  match = ua.match(/Mac OS X ([0-9_]+)/);
  if (match) return match[1].replace(/_/g, '.');

  match = ua.match(/OS (\d+_\d+(_\d+)?)/);
  if (match) return match[1].replace(/_/g, '.');

  match = ua.match(/Android ([0-9.]+)/);
  if (match) return match[1];

  return 'Unknown Version';
};

export const getConnectionType = () => {
  try {
    return navigator.connection?.effectiveType || 'unknown';
  } catch {
    return 'unknown';
  }
};

export const getGeoLocation = async () => {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    return {
      ip: data.ip || 'NA',
      country: data.country || 'NA',
      lat: data.latitude || 'NA',
      lon: data.longitude || 'NA',
    };
  } catch {
    return { ip: 'NA', country: 'NA', lat: 'NA', lon: 'NA' };
  }
};

// GDPR / CCPA placeholders (replace with CMP integration if available)
export const getPrivacyFlags = () => ({
  gdprConsent: 'NA',
  gdpr: '0',
  usPrivacy: '1---',
});

// Collect all device info
export const getAllDeviceInfo = async () => {
  const geo = await getGeoLocation();

  return {
    uid: getDeviceId(),
    model: getDeviceModel(),
    ua: getUserAgent(),
    dimensions: getDeviceDimensions(),
    os: getDeviceOs(),
    osv: getDeviceOsVersion(),
    connection: getConnectionType(),
    ip: geo.ip,
    lat: geo.lat,
    lon: geo.lon,
    country: geo.country,
    did: getDeviceId(),
    make: navigator.vendor || 'NA',
    brand: getDeviceModel(),
    ifaType: 'device_id',
    deviceModel: getDeviceModel(),
    deviceType: /Mobile|Android|iP(hone|od)/.test(navigator.userAgent)
      ? 'mobile'
      : 'desktop',
    ...getPrivacyFlags(),
  };
};
