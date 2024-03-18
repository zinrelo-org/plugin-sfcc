'use strict';

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
    var transactionID = couponLineItem && couponLineItem.custom.zinreloTransactionId;

    // Check if it's a zinrelo coupon or not
    if (!couponCode || !isZinreloCouponCode(couponCode) || !transactionID) {
        return next();
    }

    // Reject zinrelo transaction for the reward and remove coupon
    var transactionOptions = {
        transactionId: transactionID
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
    removeZinreloCoupon: removeZinreloCoupon
};
