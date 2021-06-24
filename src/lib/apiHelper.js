import { trackPromise } from "react-promise-tracker";

export const encodeParams = params => {
  if (!params) {
    return "";
  }
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};

export const modifyFetch = (url, config, disable) => {
  if (disable) return fetch(url, config);
  return trackPromise(fetch(url, config));
};
