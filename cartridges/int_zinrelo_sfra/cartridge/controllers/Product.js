'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    const { getZinreloPDPData } = require('*/cartridge/scripts/helpers/zinreloPDPHelpers');
    res.setViewData({
        zinreloPDPData: getZinreloPDPData()
    });
    next();
});

module.exports = server.exports();
