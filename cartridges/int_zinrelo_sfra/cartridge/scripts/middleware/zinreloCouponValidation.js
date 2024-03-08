'use strict';

const Resource = require('dw/web/Resource');

/**
 * Zinrelo validation before applying coupon codes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function applyZinreloCoupon(req, res, next) {
    const {
        isZinreloCouponCode, checkCouponStatusInZinrelo, applyCouponToCart, isAlreadyRedeemed
    } = require('*/cartridge/scripts/helpers/zinreloHelpers');
    const couponCode = req.querystring.couponCode;

    // Check if it's a zinrelo coupon or not
    if (!couponCode || !isZinreloCouponCode(couponCode)) {
        return next();
    }

    // Check if it's already redeemed in SFCC or not
    if (isAlreadyRedeemed()) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.unable.to.add.zinrelo.coupon', 'cart', null)
        });
        return this.emit('route:Complete', req, res);
    }

    // Get transaction for the coupon code from zinrelo
    var zinreloCouponStatus = checkCouponStatusInZinrelo(couponCode, req.customer);
    if (!(zinreloCouponStatus && zinreloCouponStatus.rewardID)) {
        res.json({
            error: true,
            errorMessage: Resource.msg('error.unable.to.add.zinrelo.coupon', 'cart', null)
        });
        return this.emit('route:Complete', req, res);
    }

    // Apply coupon code
    var rewardInfo = {
        reward_id: zinreloCouponStatus.rewardID,
        coupon_code: couponCode
    };
    var { basketModel } = applyCouponToCart(rewardInfo);
    if (basketModel && basketModel.basketModel) {
        res.json(basketModel.basketModel);
    } else {
        res.json(basketModel);
    }
    return this.emit('route:Complete', req, res);
}

/**
 * Zinrelo validation before removing coupon codes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function removeZinreloCoupon(req, res, next) {
    const { getCouponByUUID, isZinreloCouponCode, rejectRewardTransaction } = require('*/cartridge/scripts/helpers/zinreloHelpers');

    var couponUUID = req.querystring.uuid;
    var couponLineItem = getCouponByUUID(couponUUID);
    var couponCode = couponLineItem && couponLineItem.couponCode;
    var currentCustomer = req.currentCustomer;

    // Check if it's a zinrelo coupon or not
    if (!couponCode || !isZinreloCouponCode(couponCode)) {
        return next();
    }

    // Reject zinrelo transaction for the reward and remove coupon
    var transactionOptions = {
        transactionId: (couponLineItem && couponLineItem.custom.zinreloTransactionId) || ''
    };

    var { basketModel } = rejectRewardTransaction(currentCustomer, transactionOptions);
    if (basketModel && basketModel.basketModel) {
        res.json(basketModel.basketModel);
    } else {
        res.json(basketModel);
    }

    return this.emit('route:Complete', req, res);
}

module.exports = {
    applyZinreloCoupon: applyZinreloCoupon,
    removeZinreloCoupon: removeZinreloCoupon
};
