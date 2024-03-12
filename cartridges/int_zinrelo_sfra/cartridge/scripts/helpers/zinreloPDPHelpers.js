'use strict';

const Resource = require('dw/web/Resource');

const { isZinreloEnabled, isZinreloRewardsEnabledOnPDP, getZinreloPDPRewardsText } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

/**
 * Gets price from product
 * @param {Object} product product object
 * @returns {number} price
 */
function getZinreloPrice(product) {
    var price;

    var listPrice = product && product.price && product.price.list && product.price.list.value;
    var salesPrice = product && product.price && product.price.sales && product.price.sales.value;
    price = salesPrice || listPrice;

    return price;
}

/**
 * Gets required data for Zinrelo PDP rewards
 * @param {Object} product product object
 * @returns {Object} Zinrelo PDP data
 */
function getZinreloPDPData(product) {
    var zinreloPDPRewardsText = getZinreloPDPRewardsText();
    zinreloPDPRewardsText = zinreloPDPRewardsText.replace(/{{EARN_POINTS}}/g, Resource.msg('zinrelo.pdp.rewards.points.html', 'zinrelo', null));
    var zinreloPrice = getZinreloPrice(product);

    return {
        isZinreloEnabled: isZinreloEnabled(),
        isZinreloRewardsEnabledOnPDP: isZinreloRewardsEnabledOnPDP(),
        zinreloPDPRewardsText: zinreloPDPRewardsText,
        zinreloPrice: zinreloPrice
    };
}

module.exports = {
    getZinreloPDPData: getZinreloPDPData
};
