'use strict';

const URLUtils = require('dw/web/URLUtils');
const BasketMgr = require('dw/order/BasketMgr');

const collections = require('*/cartridge/scripts/util/collections');
const zinreloUserAuthHelpers = require('*/cartridge/scripts/helpers/zinreloAuthDataHelpers');
const { createZinreloLoyaltyService } = require('*/cartridge/scripts/services/zinreloLoyaltyServices');
const { ZINRELO_REWARD_PENDING_STATUS } = require('*/cartridge/scripts/utils/constants');
const {
    getRewardsAPIConfigs, getMemberAPIConfigs, getRedeemAPIConfigs, getTransactionListAPIConfigs, getTransactionRejectAPIConfigs
} = require('*/cartridge/scripts/zinreloLoyaltyConfigs');

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
        var zinreloMemberID = zinreloUserAuthHelpers.getZinreloMemberID(customer);
        var rewardsAPIConfig = getRewardsAPIConfigs(zinreloMemberID);
        var loyaltyRewardsService = createZinreloLoyaltyService(rewardsAPIConfig);

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
        var zinreloMemberID = zinreloUserAuthHelpers.getZinreloMemberID(customer);
        var memberAPIConfig = getMemberAPIConfigs(zinreloMemberID);
        var loyaltyMemberService = createZinreloLoyaltyService(memberAPIConfig);
        var response = loyaltyMemberService.call();
        if (response && response.object) {
            var { data } = JSON.parse(response.object);
            memberData.availablePoints = data.available_points;
        }
    }

    return memberData;
}

/**
 * Reward redeem request to zinrelo
 * @param {Object} redemptionOptions redemption options
 * @returns {Object} result
 */
function redeemZinreloReward(redemptionOptions) {
    var { customer, rewardID } = redemptionOptions;
    var result = {};

    if (customer && customer.email) {
        var memberAPIConfig = getRedeemAPIConfigs();
        var loyaltyMemberService = createZinreloLoyaltyService(memberAPIConfig);
        var zinreloMemberID = zinreloUserAuthHelpers.getZinreloMemberID(customer);

        // Prepare payload
        var body = {
            reward_id: rewardID,
            member_id: zinreloMemberID,
            status: ZINRELO_REWARD_PENDING_STATUS
        };

        var response = loyaltyMemberService.call(body);

        if (response && response.object) {
            result = JSON.parse(response.object);
        }
    }

    return result;
}

/**
 * Fetches list of transactions for a member
 * @param {dw.customer.Profile} customer customer for which transactions needs to be fetched
 * @param {Array} transationStatusList list of transaction status for api
 * @returns {Array} list of transactions
 */
function getMemberTransactions(customer, transationStatusList) {
    var transactions = [];

    if (customer && customer.email) {
        var options = { status: transationStatusList };
        var zinreloMemberID = zinreloUserAuthHelpers.getZinreloMemberID(customer);
        var transactionListAPIConfigs = getTransactionListAPIConfigs(zinreloMemberID, options);
        var transactionListService = createZinreloLoyaltyService(transactionListAPIConfigs);
        var response = transactionListService.call();

        if (response && response.object) {
            var { data } = JSON.parse(response.object);
            transactions = data.transactions;
        }
    }

    return transactions;
}

/**
 * Reward reject request to zinrelo
 * @param {Object} rejecttionOptions rejection options
 * @returns {Object} result
 */
function rejectZinreloRewardTransaction(rejecttionOptions) {
    var result = {};
    var { customer, transactionId } = rejecttionOptions;

    if (customer && customer.email) {
        var memberAPIConfig = getTransactionRejectAPIConfigs(transactionId);
        var rejectTransactionService = createZinreloLoyaltyService(memberAPIConfig);

        var response = rejectTransactionService.call();
        if (response && response.object) {
            result = JSON.parse(response.object);
        }
    }

    return result;
}

module.exports = {
    getRewards: getRewards,
    getMemberData: getMemberData,
    redeemZinreloReward: redeemZinreloReward,
    getMemberTransactions: getMemberTransactions,
    rejectZinreloRewardTransaction: rejectZinreloRewardTransaction
};
