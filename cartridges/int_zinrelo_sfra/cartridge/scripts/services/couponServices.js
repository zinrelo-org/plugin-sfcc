'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const System = require('dw/system/System');
const Site = require('dw/system/Site');

const serviceName = 'https.ocapi.delete.coupon';
const version = 'v21_3';
/**
 * Geneartes delete coupon ocapi endpoint url for provided coupon
 * @param {string} couponID coupon id
 * @returns {string} url
 */
function getDeleteCouponOCAPIURL(couponID) {
    var finalURL = 'https://' + System.instanceHostname;
    const currentSiteID = Site.getCurrent().ID;

    if (couponID && currentSiteID) {
        finalURL += '/s/-/dw/data/' + version + '/sites/' + currentSiteID + '/coupons/' + couponID + '/multiple_codes?delete=true';
    }

    return finalURL;
}

/**
 * Creates service to delete coupons
 * @param {Object} serviceOptions service options
 * @returns {dw.svc.Service} delete coupon service
 */
function createDeleteCouponService(serviceOptions) {
    var deleteCouponService = LocalServiceRegistry.createService(serviceName, {
        createRequest: function (svc, params) {
            const url = getDeleteCouponOCAPIURL(serviceOptions.couponID);
            svc.setURL(url);

            svc.setRequestMethod('POST');
            svc.addHeader('Authentication', 'Bearer ' + serviceOptions.token);
            svc.addHeader('Content-Type', 'application/json');

            return JSON.stringify(params);
        },
        parseResponse: function (svc, response) {
            return response.text;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return deleteCouponService;
}

module.exports = {
    createDeleteCouponService: createDeleteCouponService
};
