'use strict';

var server = require('server');
server.extend(module.superModule);

var zinreloCouponValidation = require('*/cartridge/scripts/middleware/zinreloCouponValidation');

server.prepend('RemoveCouponLineItem', zinreloCouponValidation.removeZinreloCoupon);

module.exports = server.exports();
