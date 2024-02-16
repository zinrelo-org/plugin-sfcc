'use strict';

const Site = require('dw/system/Site');
const currentSite = Site.getCurrent();

/**
 * Gets preferred languages from the preferences
 * @returns {Array} list of preferred languages
 */
function getPreferredLanguages() {
    var preferredLanguages;

    try {
        preferredLanguages = JSON.parse(currentSite.getCustomPreferenceValue('preferredLanguages') || '{}');
    } catch (error) {
        preferredLanguages = {};
    }

    return preferredLanguages;
}

/**
 * Gets partner id from the preferences
 * @returns {string} partner id
 */
function getParnerID() {
    var partnerID = currentSite.getCustomPreferenceValue('zinreloPartnerID') || '';
    return partnerID;
}

/**
 * Gets API key from the preferences
 * @returns {string} API key
 */
function getAPIKey() {
    var apiKey = currentSite.getCustomPreferenceValue('zinreloAPIKey') || '';
    return apiKey;
}

/**
 * Checks whether Zinrelo is enabled in the preferences or not
 * @returns {boolean} whether Zinrelo is enabled
 */
function isZinreloEnabled() {
    var zinreloEnableLoyalty = currentSite.getCustomPreferenceValue('zinreloEnableLoyalty') || '';
    return !!(zinreloEnableLoyalty);
}

module.exports = {
    getPreferredLanguages: getPreferredLanguages,
    getParnerID: getParnerID,
    getAPIKey: getAPIKey,
    isZinreloEnabled: isZinreloEnabled
};
