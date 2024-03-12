'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    const { getZinreloPDPData } = require('*/cartridge/scripts/helpers/zinreloPDPHelpers');
    var viewData = res.getViewData();
    res.setViewData({
        zinreloPDPData: getZinreloPDPData(viewData.product)
    });
    next();
});

server.append('Variation', function (req, res, next) {
    const { getZinreloPDPData } = require('*/cartridge/scripts/helpers/zinreloPDPHelpers');
    var viewData = res.getViewData();
    var { zinreloPrice } = getZinreloPDPData(viewData.product);
    res.setViewData({
        zinreloPrice: zinreloPrice
    });
    next();
});

module.exports = server.exports();
