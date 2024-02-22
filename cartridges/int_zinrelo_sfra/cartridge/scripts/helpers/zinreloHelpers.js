'use strict';

const zinreloPreferencesHelpers = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
const zinreloLoyaltyServiceHelpers = require('*/cartridge/scripts/helpers/zinreloLoyaltyServiceHelpers');

/**
 * Generates data for in cart redemption
 * @param {Object} customer current customer object
 * @returns {Object} in cart redemption data
 */
function getInCartRedemptionData(customer) {
    var inCartRedemptionData = {};

    const isInCartRedemptionEnabled = zinreloPreferencesHelpers.isInCartRedemptionEnabled();
    inCartRedemptionData.isInCartRedemptionEnabled = isInCartRedemptionEnabled;

    if (customer && customer.raw && customer.raw.profile && isInCartRedemptionEnabled) {
        var inCartRedemptionText = zinreloPreferencesHelpers.getInCartRedemptionText();
        var memberData = zinreloLoyaltyServiceHelpers.getMemberData(customer.raw.profile);
        var availablePoints = (memberData && memberData.availablePoints) || 0;

        inCartRedemptionText = inCartRedemptionText.replace(/{{AVAILABLE_POINTS}}/g, availablePoints);
        inCartRedemptionData.zinreloRewards = zinreloLoyaltyServiceHelpers.getRewards(customer.raw.profile);
        inCartRedemptionData.inCartDropdownText = zinreloPreferencesHelpers.getInCartDropdownText();
        inCartRedemptionData.inCartRedemptionText = inCartRedemptionText;
    }

    return inCartRedemptionData;
}

module.exports = {
    getInCartRedemptionData: getInCartRedemptionData
};
