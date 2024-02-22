'use strict';

var server = require('server');

server.get('UserAuthData', function (req, res, next) {
    var zinreloUserAuthHelpers = require('*/cartridge/scripts/helpers/zinreloUserAuthHelpers');

    var customer = req.currentCustomer;
    var userAuthData = zinreloUserAuthHelpers.getUserAuthData(customer);

    var result = {
        success: !!(userAuthData),
        userAuthData: userAuthData
    };

    res.json(result);
    next();
});

server.get('InCartRedemption', function (req, res, next) {
    const zinreloHelpers = require('*/cartridge/scripts/helpers/zinreloHelpers');
    const inCartRedemptionData = zinreloHelpers.getInCartRedemptionData(req.currentCustomer);
    res.render('checkout/zinrelo/inCartRedemptions', inCartRedemptionData);
    next();
});

module.exports = server.exports();
