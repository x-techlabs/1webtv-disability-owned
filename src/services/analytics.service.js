// To initialize video watch session
export const startVideoWatchSession = async (data) => {
  const url = `${process.env.REACT_APP_VIDEO_ANALYTICS_URL}/stats`;
  const jsonCall = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const response = await jsonCall.json();
  return response;
};

// To end video watch session
export const endVideoWatchSession = async (sessionId) => {
  const url = `${process.env.REACT_APP_VIDEO_ANALYTICS_URL}/${sessionId}/end`;
  const jsonCall = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await jsonCall.json();
  return response;
};

// To send heartbeat of video watch session
export const sendVideoHeartbeat = async (sessionId) => {
  const url = `${process.env.REACT_APP_VIDEO_ANALYTICS_URL}/heartbeat`;
  const jsonCall = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId }),
  });
  const response = await jsonCall.json();
  return response;
};
