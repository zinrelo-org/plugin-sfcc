'use strict';

var server = require('server');

server.get('UserAuthData', function (req, res, next) {
    var zinreloUserAuthHelpers = require('*/cartridge/scripts/helpers/zinreloUserAuthHelpers');

    var result = {};
    var customer = req.currentCustomer;
    var userAuthData = zinreloUserAuthHelpers.getUserAuthData(customer);

    Object.assign(result, {
        success: !!(userAuthData),
        userAuthData: userAuthData
    });

    res.json(result);
    next();
});

module.exports = server.exports();
