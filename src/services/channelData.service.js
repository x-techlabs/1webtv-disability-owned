// To fetch menu details
export const getMainMenuData = async () => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/top_menu`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

// To get menu categories
export const getMenuDetails = async (id) => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/tab/${id}`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

// To get video based on menu and category selection
export const getMenuVideoDetails = async (id, catId, page, perPage) => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/tab/${id}/${catId}/videos?page=${page}&per_page=${perPage}`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

// Series data
export const seriesData = async (id, catId) => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/tab/${id}/${catId}/series`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

export const seriesPaginationData = async (id, catId, page, perPage) => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/tab/${id}/${catId}/series?page=${page}&per_page=${perPage}`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

// Series Episode data
export const seriesEpisodeData = async (id, seriesId, episodeId) => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/tab/${id}/${seriesId}/series/${episodeId}/episode`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

// Search data
export const searchData = async (query) => {
  const url = `${
    process.env.REACT_APP_CHANNEL_DATA_JSON
  }/search?search=${encodeURIComponent(query)}`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
};

// Get Vast Url
export const getVastUrl = async (params) => {
  const url = process.env.REACT_APP_VAST_BASE_URL;
  const jsonCall = await fetch(`${url}?${params}`);
  const response = await jsonCall.json();
  return response;
};

// Get Additional Top Menu Details
export const getAdditionalTopMenuDetails = async (id) => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/additional_tabs`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response;
}

// Getting the ads from the api vastcsai_webtv_v2_json
export const getVastAd = async () => {
  const url = `${process.env.REACT_APP_CHANNEL_BASE_URL}/vastcsai_webtv_v2_json`;
  const jsonCall = await fetch(`${url}`);
  const response = await jsonCall.json();
  return response;
};

// Getting the Footer Details
export const footerSettings = async () => {
  const url = `${process.env.REACT_APP_CHANNEL_DATA_JSON}/footer_setting`;
  const jsonCall = await fetch(`${url}`);
  const response = await jsonCall.json();
  return response;
};