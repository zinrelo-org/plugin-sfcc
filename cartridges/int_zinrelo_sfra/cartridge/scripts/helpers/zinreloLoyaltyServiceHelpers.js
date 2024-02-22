'use strict';

const URLUtils = require('dw/web/URLUtils');
const BasketMgr = require('dw/order/BasketMgr');

const collections = require('*/cartridge/scripts/util/collections');
const { getRewardsAPIConfigs, getMemberAPIConfigs } = require('*/cartridge/scripts/zinreloLoyaltyConfigs');
const { createZinreloLoyaltyService } = require('*/cartridge/scripts/services/zinreloLoyaltyServices');

/**
 * Fetches the list of products ids for current product line items in cart
 * @returns {Array} list of product ids
 */
function getCurrentProductLineItemsIDs() {
    var productIDs = [];

    var currentBasket = BasketMgr.getCurrentBasket();
    if (currentBasket) {
        var productLineItems = currentBasket.getAllProductLineItems();
        collections.forEach(productLineItems, function (productLineItem) {
            productIDs.push(productLineItem.productID);
        });
    }

    return productIDs;
}

/**
 * Gets available rewards for customer
 * @param {dw.customer.Profile} customer customer for which rewards needs to be fetched
 * @returns {Array} list of rewards
 */
function getRewards(customer) {
    var rewards = [];

    if (customer && customer.email) {
        var rewardsAPIConfig = getRewardsAPIConfigs(customer.email);
        var loyaltyRewardsService = createZinreloLoyaltyService(rewardsAPIConfig.endpoint, rewardsAPIConfig.method);

        // Prepare payload
        var body = {
            transaction_attributes: {
                transaction_source: URLUtils.httpsHome().toString(),
                product_ids: getCurrentProductLineItemsIDs()
            }
        };

        var response = loyaltyRewardsService.call(body);
        if (response && response.object) {
            var { data } = JSON.parse(response.object);
            rewards = data.rewards;
        }
    }

    return rewards;
}

/**
 * Gets zinrelo member data for customer
 * @param {dw.customer.Profile} customer customer for which member data needs to be fetched
 * @returns {Object} member data
 */
function getMemberData(customer) {
    var memberData = {};

    if (customer && customer.email) {
        var memberAPIConfig = getMemberAPIConfigs(customer.email);
        var loyaltyMemberService = createZinreloLoyaltyService(memberAPIConfig.endpoint, memberAPIConfig.method);
        var response = loyaltyMemberService.call();
        if (response && response.object) {
            var { data } = JSON.parse(response.object);
            memberData.availablePoints = data.available_points;
        }
    }

    return memberData;
}

module.exports = {
    getRewards: getRewards,
    getMemberData: getMemberData
};
