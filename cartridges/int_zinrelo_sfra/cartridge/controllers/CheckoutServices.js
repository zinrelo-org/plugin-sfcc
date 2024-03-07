'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('PlaceOrder', function (req, res, next) {
    const { approveAllRewards } = require('*/cartridge/scripts/helpers/zinreloHelpers');
    var viewData = res.getViewData();
    if (!viewData.error) {
        var orderNumber = viewData.orderID;

        // Appprove transactions
        session.custom.applicableZinreloRewards = '';
        approveAllRewards(req.currentCustomer, orderNumber);

        // TODO: Send placed order event to zinrelo
    }

    next();
});

module.exports = server.exports();
