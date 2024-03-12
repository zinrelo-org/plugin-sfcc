'use strict';

const Transaction = require('dw/system/Transaction');
const BasketMgr = require('dw/order/BasketMgr');
const Resource = require('dw/web/Resource');
const CouponMgr = require('dw/campaign/CouponMgr');
const OrderMgr = require('dw/order/OrderMgr');

const zinreloPreferencesHelpers = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
const zinreloLoyaltyServiceHelpers = require('*/cartridge/scripts/helpers/zinreloLoyaltyServiceHelpers');
const basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
const couponServiceHelpers = require('*/cartridge/scripts/helpers/couponServiceHelpers');
const collections = require('*/cartridge/scripts/util/collections');
const CartModel = require('*/cartridge/models/cart');
const { ZINRELO_REWARD_PENDING_STATUS, ZINRELO_TRANSACTION_REDEEMED_STATUS, MAX_REDEMPTIONS_PER_COUPON } = require('*/cartridge/scripts/utils/constants');

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
 * Gets coupon line item from basket using uuid
 * @param {string} couponUUID coupon uuid
 * @returns {dw.order.couponLineItem} coupon line item
 */
function getCouponByUUID(couponUUID) {
    var couponLineItem;
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        return couponLineItem;
    }

    couponLineItem = collections.find(currentBasket.couponLineItems, function (item) {
        return item.UUID === couponUUID;
    });

    return couponLineItem;
}

/**
 * Checks whether the provided coupon code is a zinrelo coupon code
 * @param {string} couponCode coupon code
 * @returns {boolean} true if the code is a zinrelo coupon code
 */
function isZinreloCouponCode(couponCode) {
    var coupon = CouponMgr.getCouponByCode(couponCode);
    return !!(coupon && coupon.promotions.length > 0 && coupon.promotions[0].custom.isZinreloPromotion);
}

/**
 * Checks whether the coupon code is already used and redeemed to its max limit
 * @param {string} couponCode coupon code
 * @returns {boolean} whether the code is redeemed
 */
function isAlreadyRedeemed(couponCode) {
    var coupon = CouponMgr.getCouponByCode(couponCode);
    var couponRedemption = CouponMgr.getRedemption(coupon.ID, couponCode);

    return (couponRedemption.length > MAX_REDEMPTIONS_PER_COUPON);
}

/**
 * Gets available transaction for the provided coupon code for current customer
 * @param {string} couponCode coupon code
 * @param {Object} customer current customer object
 * @returns {Object} available transaction for the coupon
 */
function checkCouponStatusInZinrelo(couponCode, customer) {
    var result;

    if (couponCode && customer && customer.raw && customer.raw.profile) {
        // TODO: Check coupon status
        result = {
            status: ZINRELO_TRANSACTION_REDEEMED_STATUS,
            rewardID: ''
        };
    }

    return result;
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
 * Gets applicable zinrelo rewards from current session
 * @returns {Array} list of applicable zinrelo rewards
 */
function getApplicableZinreloRewards() {
    var zinreloRewards = session.custom.applicableZinreloRewards ? session.custom.applicableZinreloRewards.split(',') : [];
    return zinreloRewards;
}

/**
 * Sets applicable zinrelo rewards to current session
 * @param {Array} rewards list of rewards
 */
function setApplicableZinreloRewards(rewards) {
    session.custom.applicableZinreloRewards = rewards && rewards.length > 0 ? rewards.join(',') : '';
}

/**
 * Adds user in Zinrelo rewards customer group by adding reward id to session attribute
 * @param {string} rewardID reward id
 */
function addInZinreloCustomerGroup(rewardID) {
    // Get rewards from session
    var zinreloRewards = getApplicableZinreloRewards();

    // Add the current rewards
    zinreloRewards.push(rewardID);

    // Set the updated list back to session
    setApplicableZinreloRewards(zinreloRewards);
}

/**
 * Removes user from Zinrelo rewards customer group by removing reward id to session attribute
 * @param {string} rewardID reward id
 */
function removeFromZinreloCustomerGroup(rewardID) {
    // Get rewards from session
    var zinreloRewards = getApplicableZinreloRewards();

    // Remove the current rewards
    var currentRewardIndex = zinreloRewards.indexOf(rewardID);
    if (currentRewardIndex > -1) {
        zinreloRewards.splice(currentRewardIndex, 1);
    }

    // Set the updated list back to session
    setApplicableZinreloRewards(zinreloRewards);
}

/**
 * Applies coupon code to basket
 * @param {Object} rewardInfo reward info object
 * @param {string} transactionId zinrelo transaction id
 * @returns {Object} result
 */
function applyCouponToCart(rewardInfo, transactionId) {
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
            couponLineItem.custom.zinreloRewardID = rewardInfo.reward_id;
            couponLineItem.custom.zinreloTransactionId = transactionId || '';
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

    removeFromZinreloCustomerGroup(rewardInfo.reward_id);
    var couponLineItem = currentBasket.getCouponLineItem(rewardInfo.coupon_code);

    if (couponLineItem) {
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
        response.basketModel = applyCouponToCart(response.data.reward_info, response.data.id);

        if (response && response.basketModel && response.basketModel.error) {
            // TODO: reject reward in zinrelo
        }

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
    if (result && result.data && result.data.reward_info && result.data.reward_info.coupon_code) {
        result.basketModel = removeCouponToCart(result.data.reward_info);

        // Delete coupon from BM
        var couponList = [result.data.reward_info.coupon_code];
        couponServiceHelpers.deleteCoupon(couponList);

        // Remove data from the reponse
        delete result.data;
    }
    return result;
}


/**
 * Filters transaction list based on applied rewards in basket
 * @param {Array} transactions list of transaction
 * @param {dw.order.Order} order order object
 * @returns {Array} filtered list of transaction
 */
function filterTransactionsForBasketRewards(transactions, order) {
    var couponCodesInBasket = [];

    if (!transactions || !order) {
        return [];
    }

    collections.forEach(order.couponLineItems, function (couponLineItem) {
        if (couponLineItem.custom.isZinreloCoupon) {
            couponCodesInBasket.push(couponLineItem.couponCode);
        }
    });

    return transactions.filter(function (transaction) {
        return !!(transaction && transaction.reward_info && couponCodesInBasket.indexOf(transaction.reward_info.coupon_code) > -1);
    });
}

/**
 * Approves all rewards for the order
 * @param {Object} customer current customer object
 * @param {string} orderNumber order number
 */
function approveAllRewards(customer, orderNumber) {
    if (!customer || (customer && !customer.raw.profile)) {
        return;
    }

    var order = OrderMgr.getOrder(orderNumber);
    var transactionOptions = {
        customer: customer && customer.raw && customer.raw.profile
    };

    // Get pending transactions for current customer from zinrelo
    var transactionStatusList = [ZINRELO_REWARD_PENDING_STATUS];
    var pendingTransactions = zinreloLoyaltyServiceHelpers.getMemberTransactions(customer.raw.profile, transactionStatusList);
    var appliedRewardsInBasket = filterTransactionsForBasketRewards(pendingTransactions, order);
    appliedRewardsInBasket.forEach(function (transaction) {
        transactionOptions.transactionId = transaction.id;
        var result = zinreloLoyaltyServiceHelpers.approveZinreloRewardTransaction(transactionOptions);

        if (result && result.success) {
            // Remove this reward from user's profile
        }
    });
}

module.exports = {
    getInCartRedemptionData: getInCartRedemptionData,
    redeemReward: redeemReward,
    rejectRewardTransaction: rejectRewardTransaction,
    approveAllRewards: approveAllRewards,
    isZinreloCouponCode: isZinreloCouponCode,
    checkCouponStatusInZinrelo: checkCouponStatusInZinrelo,
    applyCouponToCart: applyCouponToCart,
    isAlreadyRedeemed: isAlreadyRedeemed,
    getCouponByUUID: getCouponByUUID
};
