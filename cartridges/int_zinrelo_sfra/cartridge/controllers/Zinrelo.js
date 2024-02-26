'use strict';

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

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

server.get('InCartRedemption', csrfProtection.generateToken, function (req, res, next) {
    const { getInCartRedemptionData } = require('*/cartridge/scripts/helpers/zinreloHelpers');
    const inCartRedemptionData = getInCartRedemptionData(req.currentCustomer);
    res.render('checkout/zinrelo/inCartRedemptions', inCartRedemptionData);
    next();
});

server.post('RedeemReward', csrfProtection.validateAjaxRequest, function (req, res, next) {
    const { redeemReward } = require('*/cartridge/scripts/helpers/zinreloHelpers');
    const result = redeemReward(req.currentCustomer, req.form);
    res.json(result);
    next();
});

server.post('RejectReward', csrfProtection.validateAjaxRequest, function (req, res, next) {
    const { rejectRewardTransaction } = require('*/cartridge/scripts/helpers/zinreloHelpers');
    const result = rejectRewardTransaction(req.currentCustomer, req.form);
    res.json(result);
    next();
});

module.exports = server.exports();
