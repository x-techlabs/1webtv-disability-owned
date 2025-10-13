export const buildLiveVastUrl = ({ hlsVideo, videoData, deviceInfo, randomCB }) => {
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

    // Build query params object (same as before)
    const query = {
        "CB": randomCB,
        "UA": safeValue(deviceInfo.ua),
        "PLAYER-WIDTH": 1920,
        "PLAYER-HEIGHT": 1080,
        "WEB-URL": safeValue(window?.location?.href),
        "APP-BUNDLE": safeValue(""),
        "APP-NAME": safeValue(""),
        "APP-STORE-URL": safeValue(""),
        "APP-VERSION": safeValue(""),
        "DEVICE-ID": '',
        "DEVICE-ID-TYPE": '',
        "DNT": safeValue(dnt),
        "DEVICE-MAKER": safeValue(deviceInfo.make),
        "DEVICE-MODEL": safeValue(deviceInfo.model),
        "DEVICE-TYPE": safeValue(deviceInfo.deviceType),
        "PLATFORM-NAME": safeValue(deviceInfo.platform),
        "USER-AGENT": safeValue(deviceInfo.ua),
        "US-PRIVACY": safeValue(USPrivacy_String),
        "IP-ADDRESS": safeValue(deviceInfo.ip),
        "CONTENT-ID": safeValue(videoData._id),
        "CONTENT-CUSTOM-1-PARAM": safeValue(videoData._id),
        "CONTENT-TYPE": 'Channel',
        "CONTENT-CUSTOM-3-PARAM": 'Channel',
        "CHANNEL-NAME": safeValue(videoData.channelName),
        "CHANNEL-TITLE": safeValue(videoData.channelName),
        "CHANNEL-GENRE": safeValue(videoData.genres),
        "CHANNEL-LANGUAGE": safeValue(videoData.language),
        "CHANNEL-RATING": safeValue(videoData.rating === 0 ? '' : videoData.rating),
        "CONTENT-LIVESTREAM": videoData.type === "event" ? 1 : 0,
        "CONTENT-PROVIDER": "disability-owned",
        "POS": "MID",
    };

    let hlsUrl = hlsVideo;
    Object.entries(query).forEach(([key, val]) => {
        const regex = new RegExp(`\\[${key}\\]`, "g");
        hlsUrl = hlsUrl.replace(regex, val);
    });

    return hlsUrl;
};
