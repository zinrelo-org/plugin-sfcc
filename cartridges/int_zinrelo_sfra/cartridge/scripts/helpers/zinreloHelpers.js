'use strict';

const Transaction = require('dw/system/Transaction');
const BasketMgr = require('dw/order/BasketMgr');
const Resource = require('dw/web/Resource');

const zinreloPreferencesHelpers = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
const zinreloLoyaltyServiceHelpers = require('*/cartridge/scripts/helpers/zinreloLoyaltyServiceHelpers');
const basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
const CartModel = require('*/cartridge/models/cart');
const { ZINRELO_REWARD_PENDING_STATUS } = require('*/cartridge/scripts/utils/constants');

/**
 * Gets pending rewards list from pending transaction list
 * @param {Array} pendingTransactionList list of pending transactions
 * @returns {Array} list of pending rewards
 */
function getPendingRewards(pendingTransactionList) {
    var pendingRewards = [];

    if (pendingTransactionList && pendingTransactionList.length) {
        pendingTransactionList.forEach(function (pendingTransaction) {
            pendingRewards.push({
                reward_id: (pendingTransaction && pendingTransaction.reward_info && pendingTransaction.reward_info.reward_id) || '',
                reward_name: (pendingTransaction && pendingTransaction.reward_info && pendingTransaction.reward_info.reward_name) || '',
                transactionId: (pendingTransaction && pendingTransaction.id) || ''
            });
        });
    }

    return pendingRewards;
}

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
        // Get loyalty points for current customer from zinrelo
        var inCartRedemptionText = zinreloPreferencesHelpers.getInCartRedemptionText();
        var memberData = zinreloLoyaltyServiceHelpers.getMemberData(customer.raw.profile);
        var availablePoints = (memberData && memberData.availablePoints) || 0;
        inCartRedemptionText = inCartRedemptionText.replace(/{{AVAILABLE_POINTS}}/g, availablePoints);

        // Get available rewards for current customer from zinrelo
        var zinreloRewards = zinreloLoyaltyServiceHelpers.getRewards(customer.raw.profile);
        inCartRedemptionData.zinreloRewards = zinreloRewards;
        inCartRedemptionData.inCartDropdownText = zinreloPreferencesHelpers.getInCartDropdownText();
        inCartRedemptionData.inCartRedemptionText = inCartRedemptionText;

        // Get pending transactions for current customer from zinrelo
        var transactionStatusList = [ZINRELO_REWARD_PENDING_STATUS];
        var pendingTransactions = zinreloLoyaltyServiceHelpers.getMemberTransactions(customer.raw.profile, transactionStatusList);
        var pendingRewards = getPendingRewards(pendingTransactions);
        inCartRedemptionData.pendingRewards = pendingRewards;

        inCartRedemptionData.showInCartSection = !!((zinreloRewards && zinreloRewards.length > 0) || (pendingRewards && pendingRewards.length > 0));
    }

    return inCartRedemptionData;
}
/**
 * Adds user in Zinrelo rewards customer group by adding reward id to session attribute
 * @param {string} rewardID reward id
 */
function addInZinreloCustomerGroup(rewardID) {
    var zinreloRewards = session.custom.applicableZinreloRewards || '';

    if (zinreloRewards) {
        zinreloRewards += ',' + rewardID;
    } else {
        zinreloRewards = rewardID;
    }

    session.custom.applicableZinreloRewards = zinreloRewards;
}

/**
 * Removes user from Zinrelo rewards customer group by removing reward id to session attribute
 * @param {string} rewardID reward id
 */
function removeFromZinreloCustomerGroup(rewardID) {
    var zinreloRewards = session.custom.applicableZinreloRewards || '';

    if (zinreloRewards) {
        var rewards = zinreloRewards.split(',');
        var currentRewardIndex = rewards.indexOf(rewardID);

        if (currentRewardIndex > -1) {
            rewards.splice(currentRewardIndex, 1);
        }
        zinreloRewards = rewards.join(',');
    }

    session.custom.applicableZinreloRewards = zinreloRewards;
}

/**
 * Applies coupon code to basket
 * @param {Object} rewardInfo reward info object
 * @param {string} rewardID reward ID
 * @returns {Object} result
 */
function applyCouponToCart(rewardInfo) {
    var error = false;
    var errorMessage;
    var result = {};

    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket || !rewardInfo || (rewardInfo && (!rewardInfo.reward_id || !rewardInfo.coupon_code))) {
        return result;
    }

    try {
        addInZinreloCustomerGroup(rewardInfo.reward_id);
        Transaction.wrap(function () {
            var couponLineItem = currentBasket.createCouponLineItem(rewardInfo.coupon_code, true);
            couponLineItem.custom.isZinreloCoupon = true;
            couponLineItem.custom.rewardID = rewardInfo.reward_id;
        });
    } catch (e) {
        removeFromZinreloCustomerGroup(rewardInfo.reward_id);
        error = true;
        var errorCodes = {
            COUPON_CODE_ALREADY_IN_BASKET: 'error.coupon.already.in.cart',
            COUPON_ALREADY_IN_BASKET: 'error.coupon.cannot.be.combined',
            COUPON_CODE_ALREADY_REDEEMED: 'error.coupon.already.redeemed',
            COUPON_CODE_UNKNOWN: 'error.unable.to.add.coupon',
            COUPON_DISABLED: 'error.unable.to.add.coupon',
            REDEMPTION_LIMIT_EXCEEDED: 'error.unable.to.add.coupon',
            TIMEFRAME_REDEMPTION_LIMIT_EXCEEDED: 'error.unable.to.add.coupon',
            NO_ACTIVE_PROMOTION: 'error.unable.to.add.coupon',
            default: 'error.unable.to.add.coupon'
        };

        var errorMessageKey = errorCodes[e.errorCode] || errorCodes.default;
        errorMessage = Resource.msg(errorMessageKey, 'cart', null);
    }
    Transaction.wrap(function () {
        basketCalculationHelpers.calculateTotals(currentBasket);
    });

    result = {
        error: error,
        errorMessage: errorMessage,
        basketModel: new CartModel(currentBasket)

    };

    return result;
}

/**
 * Removes coupon code from basket
 * @param {Object} rewardInfo reward info object
 * @returns {Object} result
 */
function removeCouponToCart(rewardInfo) {
    var error = false;
    var errorMessage;
    var result = {};

    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket || !rewardInfo || (rewardInfo && (!rewardInfo.reward_id || !rewardInfo.coupon_code))) {
        return result;
    }
    var couponLineItem = currentBasket.getCouponLineItem(rewardInfo.coupon_code);

    if (couponLineItem) {
        removeFromZinreloCustomerGroup(rewardInfo.reward_id);
        session.custom.zinreloRewardsID = '';
        Transaction.wrap(function () {
            currentBasket.removeCouponLineItem(couponLineItem);
            basketCalculationHelpers.calculateTotals(currentBasket);
        });
    }

    result = {
        error: error,
        errorMessage: errorMessage,
        basketModel: new CartModel(currentBasket)

    };

    return result;
}

/**
 * Sends redeem request for reward
 * @param {Object} customer current customer object
 * @param {Object} rewardsForm reward details
 * @returns {Object} redeem result
 */
function redeemReward(customer, rewardsForm) {
    var rewardRedeemOptions = {
        rewardID: rewardsForm.zinreloReward,
        customer: customer && customer.raw && customer.raw.profile
    };
    var response = zinreloLoyaltyServiceHelpers.redeemZinreloReward(rewardRedeemOptions);

    // Apply coupon code received from zinrelo
    if (response && response.data && response.data.reward_info && response.data.reward_info.coupon_code) {
        response.basketModel = applyCouponToCart(response.data.reward_info);
        delete response.data;
    }

    return response;
}

/**
 * Rejects the reward transaction
 * @param {Object} customer current customer object
 * @param {Object} rewardsForm reward details
 * @returns {Object} reject result
 */
function rejectRewardTransaction(customer, rewardsForm) {
    var rewardRedeemOptions = {
        transactionId: rewardsForm.transactionId,
        customer: customer && customer.raw && customer.raw.profile
    };
    var result = zinreloLoyaltyServiceHelpers.rejectZinreloRewardTransaction(rewardRedeemOptions);

    // removing couponLineItem
    if (result && result.data && result.data.reward_info && result.data.reward_info) {
        result.basketModel = removeCouponToCart(result.data.reward_info);
        delete result.data;
    }
    return result;
}

module.exports = {
    getInCartRedemptionData: getInCartRedemptionData,
    redeemReward: redeemReward,
    rejectRewardTransaction: rejectRewardTransaction
};
