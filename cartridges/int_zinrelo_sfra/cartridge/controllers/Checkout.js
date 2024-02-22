'use strict';

var server = require('server');
server.extend(module.superModule);

server.prepend('Begin', function (req, res, next) {
    const { isZinreloEnabled } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
    res.setViewData({
        isZinreloEnabled: isZinreloEnabled()
    });
    next();
});

module.exports = server.exports();
