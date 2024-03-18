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
        preferredLanguages = JSON.parse(currentSite.getCustomPreferenceValue('zinreloPreferredLanguages') || '{}');
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

/**
 * Gets in cart dropdown text from preferences
 * @returns {string} in cart dropdown text
 */
function getInCartDropdownText() {
    var inCartDropdownText = currentSite.getCustomPreferenceValue('zinreloInCartDropdownText') || '';
    return inCartDropdownText;
}

/**
 * Gets in cart redemption text from preferences
 * @returns {string} in cart redemption text
 */
function getInCartRedemptionText() {
    var inCartRedemptionText = currentSite.getCustomPreferenceValue('zinreloInCartRedemptionText') || '';
    return inCartRedemptionText;
}

/**
 * Checks whether in cart redemption is enabled in the preferences or not
 * @returns {boolean} whether in cart redemption is enabled
 */
function isInCartRedemptionEnabled() {
    var inCartRedemptionEnabled = currentSite.getCustomPreferenceValue('zinreloEnableInCartRedemption') || '';
    return !!(inCartRedemptionEnabled);
}

/**
 * Get zinrelo webhook URL
 * @returns {string} webhok url
 */
function getZinreloWebhookURL() {
    var zinreloWebhookURL = currentSite.getCustomPreferenceValue('zinreloWebhookURL') || '';
    return zinreloWebhookURL;
}

/**
 * Checks whether pdp rewards feature is enabled in the preferences or not
 * @returns {boolean} whether pdp rewards feature is enabled
 */
function isZinreloRewardsEnabledOnPDP() {
    var zinreloRewardsEnabledOnPDP = currentSite.getCustomPreferenceValue('zinreloEnableRewardsOnPDP') || '';
    return !!(zinreloRewardsEnabledOnPDP);
}

/**
 * Gets zinrelo pdp rewards text
 * @returns {string} zinrelo pdp rewards text
 */
function getZinreloPDPRewardsText() {
    var zinreloPDPRewardsText = currentSite.getCustomPreferenceValue('zinreloPDPRewardsText') || '';
    return zinreloPDPRewardsText;
}

/**
 * Checks whether zinrelo order creation event is enabled in the preferences or not
 * @returns {boolean} whether zinrelo order creation event is enabled
 */
function isZinreloOrderCreationEventEnabled() {
    var zinreloOrderCreationEventEnabled = currentSite.getCustomPreferenceValue('zinreloEnableOrderCreationEvent') || '';
    return !!(zinreloOrderCreationEventEnabled);
}

/**
 * Checks whether zinrelo order placed event is enabled in the preferences or not
 * @returns {boolean} whether zinrelo order placed event is enabled
 */
function isZinreloOrderPlacedEventEnabled() {
    var zinreloOrderPlacedEventEnabled = currentSite.getCustomPreferenceValue('zinreloEnableOrderConfirmationEvent') || '';
    return !!(zinreloOrderPlacedEventEnabled);
}

/**
 * Gets zinrelo pdp rewards text
 * @returns {string} zinrelo pdp rewards text
 */
function getZinreloCartSessionTimeout() {
    var zinreloCartSessionTimeout = currentSite.getCustomPreferenceValue('zinreloCartSessionTimeout') || '';
    return zinreloCartSessionTimeout;
}

module.exports = {
    getPreferredLanguages: getPreferredLanguages,
    getParnerID: getParnerID,
    getAPIKey: getAPIKey,
    isZinreloEnabled: isZinreloEnabled,
    getInCartDropdownText: getInCartDropdownText,
    getInCartRedemptionText: getInCartRedemptionText,
    isInCartRedemptionEnabled: isInCartRedemptionEnabled,
    getZinreloWebhookURL: getZinreloWebhookURL,
    isZinreloRewardsEnabledOnPDP: isZinreloRewardsEnabledOnPDP,
    getZinreloPDPRewardsText: getZinreloPDPRewardsText,
    isZinreloOrderCreationEventEnabled: isZinreloOrderCreationEventEnabled,
    isZinreloOrderPlacedEventEnabled: isZinreloOrderPlacedEventEnabled,
    getZinreloCartSessionTimeout: getZinreloCartSessionTimeout
};
