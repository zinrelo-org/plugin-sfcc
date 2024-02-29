'use strict';

var base = module.superModule || {};

/**
 * Changes the provided value to url encoded format
 * @param {string | number | Object} value value to be formatted
 * @returns {string} url encoded value
 */
function getURLEncodedValue(value) {
    var urlEncodedValue = value;

    if (value && typeof value === 'object') {
        urlEncodedValue = encodeURIComponent(JSON.stringify(value));
    }

    return urlEncodedValue;
}

/**
 * Adds params to url
 * @param {string} url url to add params
 * @param {Object} params object of params
 * @returns {string} updated url with params
 */
function addParamsToURL(url, params) {
    var finalURL = url;

    if (url && params && typeof params === 'object') {
        Object.keys(params).forEach(function (paramKey) {
            if (!paramKey || (paramKey && !params[paramKey])) {
                return;
            }

            if (finalURL.indexOf('?') > -1) {
                finalURL += '&' + paramKey + '=' + getURLEncodedValue(params[paramKey]);
            } else {
                finalURL += '?' + paramKey + '=' + getURLEncodedValue(params[paramKey]);
            }
        });
    }

    return finalURL;
}

base.addParamsToURL = addParamsToURL;
module.exports = base;
