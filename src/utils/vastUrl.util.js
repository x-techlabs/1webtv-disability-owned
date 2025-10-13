export const buildVastUrl = ({
  deviceInfo,
  videoData,
  randomCB,
  appstoreUrl,
  appChannelName,
  contentSeries = "",
}) => {
  const safeValue = (val) => {
    if (val === undefined || val === null || val === "") return "";
    return encodeURIComponent(val);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const USPrivacy_String = getCookie("usprivacy");
  let dnt;
  if (USPrivacy_String && USPrivacy_String.length === 4) {
    const optOutSale = USPrivacy_String.charAt(2);
    if (optOutSale === "Y") {
      dnt = 1;
    } else if (optOutSale === "N") {
      dnt = 0;
    }
  }

  // Build query params object
  const query = {
    cb: safeValue(randomCB),
    ua: safeValue(deviceInfo.ua),
    url: safeValue(window?.location?.href),
    lat: "",
    lon: "",
    dnt: dnt,
    pod_max_dur: "",
    pod_ad_slots: "",
    content_type: safeValue(videoData.type ?? 'tvepisode'),
    content_custom_3_param: 'tvepisode',
    inv_partner_domain: "",
    min_dur: "",
    max_dur: "",
    content_id: safeValue(videoData.id),
    content_episode: safeValue(videoData.episode === 0 ? '' : videoData.episode),
    content_series: safeValue(videoData.series === 0 ? '' : videoData.series),
    content_season: safeValue(videoData.season === 0 ? '' : videoData.season),
    content_title: safeValue(videoData.title),
    content_genre: safeValue(videoData.genres || "tvmovies"),
    content_livestream: videoData.type === "event" ? 1 : 0,
    content_producer_name: "",
    video_rating: safeValue(videoData.rating === 0 ? '' : videoData.rating),
    channel_name: safeValue(videoData.channelName),
    content_len: safeValue(videoData.duration ?? ''),
    language: "en",
    network_name: "",
    content_duration: safeValue(videoData.duration),
    did: safeValue(deviceInfo.did),
    device_make: "",
    brand_name: "",
    country: "",
    ifa_type: "",
    sam_session_id: "",
    gdpr_consent: "",
    gdpr: "",
    us_privacy: USPrivacy_String,
    coppa: "0",
    lmt: "0",
    content_url: "",
    cuepoints: "",
    slot_type: "",
    os: safeValue(deviceInfo.os),
    osv: safeValue(deviceInfo.osv),
    model: safeValue(deviceInfo.model),
    device_height: safeValue(deviceInfo.dimensions?.height),
    device_width: safeValue(deviceInfo.dimensions?.width),
    imp_video_height: safeValue(deviceInfo.dimensions?.height),
    imp_video_width: safeValue(deviceInfo.dimensions?.width),
    connection_type: safeValue(deviceInfo.connection),
    category: safeValue(videoData.category),
    schain: "",
    height: safeValue(videoData.height),
    weight: safeValue(videoData.weight),
    device_model: safeValue(deviceInfo.deviceModel),
    device_type: safeValue(deviceInfo.deviceType),
    site_url: safeValue(window?.location?.href),
    content_lang: safeValue(videoData.language),
    device_ifa: safeValue(deviceInfo.uid),
    video_id: safeValue(videoData.id),
    player_height: safeValue(deviceInfo.dimensions?.height),
    player_width: safeValue(deviceInfo.dimensions?.width),
    media_title: safeValue(videoData.title),
    series_title: safeValue(contentSeries),
    // static required fields
    app_bundle: "",
    app_name: "",
    app_store_url: "",
    content_provider: "disability-owned",
    pos: "pre",
    ip: safeValue(deviceInfo.ip),
  };

  // Convert object to query string
  const queryString = Object.entries(query)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  return `${queryString}`;
};
