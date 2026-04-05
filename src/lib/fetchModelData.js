import models from '../modelData/models';

/**
 * getLocalData – fallback to local model data when server is unavailable.
 */
function getLocalData(url) {
  const userListMatch = url.match(/^\/user\/list$/);
  const userMatch = url.match(/^\/user\/([^/]+)$/);
  const photosMatch = url.match(/^\/photosOfUser\/([^/]+)$/);
  const testMatch = url.match(/^\/test\/info$/);

  if (userListMatch) return models.userListModel();
  if (userMatch) return models.userModel(userMatch[1]);
  if (photosMatch) return models.photoOfUserModel(photosMatch[1]);
  if (testMatch) return models.schemaInfo();
  return null;
}

/**
 * fetchModel – Fetch a model from the web server.
 * Falls back to local model data if the server is unavailable.
 *
 * @param {string} url  The URL to issue the GET request.
 * @returns {Promise}   Resolves with the model data object.
 */
function fetchModel(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.warn(`[fetchModel] Server unavailable, using local data for "${url}":`, error.message);
      return Promise.resolve(getLocalData(url));
    });
}

export default fetchModel;