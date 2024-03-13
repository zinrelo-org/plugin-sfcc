'use strict';

var constants = module.superModule || {};
var Order = require('dw/order/Order');

constants.ZINRELO_AUTH_VERSION = 'v2';
constants.ZINRELO_SERVER_URL = 'https://app.zinrelo.com';
constants.ZINRELO_DATE_FORMAT = 'mm/dd/yy';
constants.ZINRELO_REWARD_PENDING_STATUS = 'pending';
constants.ZINRELO_TRANSACTION_REDEEMED_STATUS = 'Redeemed';
constants.MAX_REDEMPTIONS_PER_COUPON = 1;
constants.HS512 = {
    algorthimName: 'HS512',
    algorthimCode: 'HMAC_SHA_512'
};
constants.HS256 = {
    algorthimName: 'HS256',
    algorthimCode: 'HMAC_SHA_256'
};
constants.orderStatuses = {
    shipped: 'shipped',
    returned: 'returned',
    partiallyReturned: 'partiallyReturned',
    cancelled: Order.ORDER_STATUS_CANCELLED,
    paid: Order.PAYMENT_STATUS_PAID,
    placed: 'placed',
    created: 'created'
};
constants.orderChunkSize = 200;

module.exports = constants;
