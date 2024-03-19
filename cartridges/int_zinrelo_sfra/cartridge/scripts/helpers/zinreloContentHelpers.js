'use strict';

const ContentMgr = require('dw/content/ContentMgr');

/**
 * Gets body of the content using content id
 * @param {string} contentID content id
 * @returns {string} content body
 */
function getContent(contentID) {
    var content = ContentMgr.getContent(contentID);
    return (content && content.custom && content.custom.body && content.custom.body.markup) || '';
}

/**
 * Gets zinrelo pdp rewards text
 * @returns {string} zinrelo pdp rewards text
 */
function getZinreloPDPRewardsText() {
    var zinreloPDPRewardsText = getContent('zinreloPDPRewardsText') || '';
    return zinreloPDPRewardsText;
}

/**
 * Gets in cart dropdown text
 * @returns {string} in cart dropdown text
 */
function getInCartDropdownText() {
    var inCartDropdownText = getContent('zinreloInCartDropdownText') || '';
    return inCartDropdownText;
}

/**
 * Gets in cart redemption text
 * @returns {string} in cart redemption text
 */
function getInCartRedemptionText() {
    var inCartRedemptionText = getContent('zinreloInCartRedemptionText') || '';
    return inCartRedemptionText;
}

/**
 * Gets in cart redeem button text
 * @returns {string} in cart redeem button text
 */
function getInCartRedeemButtonText() {
    var inCartRedeemButtonText = getContent('zinreloInCartRedeemButtonText') || '';
    return inCartRedeemButtonText;
}

/**
 * Gets in cart Cancel button text
 * @returns {string} in cart Cancel button text
 */
function getInCartCancelButtonText() {
    var inCartCancelButtonText = getContent('zinreloInCartCancelButtonText') || '';
    return inCartCancelButtonText;
}


module.exports = {
    getContent: getContent,
    getZinreloPDPRewardsText: getZinreloPDPRewardsText,
    getInCartDropdownText: getInCartDropdownText,
    getInCartRedemptionText: getInCartRedemptionText,
    getInCartRedeemButtonText: getInCartRedeemButtonText,
    getInCartCancelButtonText: getInCartCancelButtonText
};
