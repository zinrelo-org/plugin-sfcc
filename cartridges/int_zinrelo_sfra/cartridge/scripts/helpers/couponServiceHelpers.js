'use strict';

const CacheMgr = require('dw/system/CacheMgr');
const CouponMgr = require('dw/campaign/CouponMgr');

const { createTokenService } = require('*/cartridge/scripts/services/accountManagerServices');
const { createDeleteCouponService } = require('*/cartridge/scripts/services/couponServices');

/**
 * Gets token from the create token service
 * @returns {string} account manager token
 */
function getToken() {
    var token;
    var generateTokenService = createTokenService();
    var response = generateTokenService.call();

    if (response.ok && response.object) {
        try {
            var data = JSON.parse(response.object);
            token = data.access_token;
        } catch (error) {
            token = undefined;
        }
    }

    return token;
}

/**
 * Generates account manager token
 * @returns {string} account manager token
 */
function generateAMToken() {
    // Get token from the custom cache, get it from the service if it's expired
    var amToken = CacheMgr.getCache('amToken').get('amToken', getToken);
    return amToken;
}

/**
 * Deletes the provide coupon code from BM
 * @param {Array} couponCodeList coupon code to be deleted (Should belong to the same coupon)
 * @returns {Object} result
 */
function deleteCoupon(couponCodeList) {
    var result = {};

    if (!(couponCodeList && typeof couponCodeList !== 'string' && couponCodeList.length > 0)) {
        return result;
    }

    // Get the coupon
    var coupon = CouponMgr.getCouponByCode(couponCodeList[0]);
    var couponID = coupon.ID;

    // Get the account manager bearer token
    var token = generateAMToken();
    if (!token) {
        return result;
    }

    // Create service
    var serviceConfig = {
        token: token,
        couponID: couponID
    };
    var deleteCouponService = createDeleteCouponService(serviceConfig);

    // Call the service and get result
    var body = {
        codes: couponCodeList
    };
    var response = deleteCouponService.call(body);

    if (response && response.ok) {
        result.success = true;
    }

    return result;
}

module.exports = {
    generateAMToken: generateAMToken,
    deleteCoupon: deleteCoupon
};
