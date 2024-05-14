'use strict';

const Resource = require('dw/web/Resource');

const { isZinreloEnabled, isZinreloRewardsEnabledOnPDP, getZinreloPDPRewardsText } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

/**
 * Gets required data for Zinrelo PDP rewards
 * @returns {Object} Zinrelo PDP data
 */
function getZinreloPDPData() {
    var zinreloPDPRewardsText = getZinreloPDPRewardsText();
    zinreloPDPRewardsText = zinreloPDPRewardsText.replace(/{{EARN_POINTS}}/g, Resource.msg('zinrelo.pdp.rewards.points.html', 'zinrelo', null));

    return {
        isZinreloEnabled: isZinreloEnabled(),
        isZinreloRewardsEnabledOnPDP: isZinreloRewardsEnabledOnPDP(),
        zinreloPDPRewardsText: zinreloPDPRewardsText
    };
}

module.exports = {
    getZinreloPDPData: getZinreloPDPData
};
