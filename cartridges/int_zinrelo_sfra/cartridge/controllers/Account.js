'use strict';

var server = require('server');
server.extend(module.superModule);

server.prepend('Show', function (req, res, next) {
    var zinreloHelper = require('*/cartridge/scripts/helpers/zinreloHelpers');
    zinreloHelper.cleanUpRewards();
    next();
});

module.exports = server.exports();
