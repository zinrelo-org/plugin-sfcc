'use strict';

var server = require('server');
server.extend(module.superModule);

server.append('PlaceOrder', function (req, res, next) {
    const { approveAllRewards } = require('*/cartridge/scripts/helpers/zinreloHelpers');
    const { sendOrderEventToZinrelo } = require('*/cartridge/scripts/helpers/zinreloOrderHelpers');
    const { orderStatuses } = require('*/cartridge/scripts/utils/constants');
    const { isZinreloEnabled, isZinreloOrderCreationEventEnabled, isZinreloOrderPlacedEventEnabled } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

    var viewData = res.getViewData();
    if (isZinreloEnabled && !viewData.error && viewData.orderID) {
        var orderNumber = viewData.orderID;

        // Appprove transactions
        session.custom.applicableZinreloRewards = '';
        approveAllRewards(req.currentCustomer, orderNumber);

        /**
         * Since order is created and placed in this route in SFRA, sending both order created and placed event here
         * These events can be used wherever Orders are created and placed for business specifc implementation
         * To stop these events from being fired here, set the attribute value as true for stopCreateOrderZinreloEvent and stopPlaceOrderZinreloEvent in the ViewData in prepend route
         */

        // Send created order event to zinrelo
        if (!viewData.stopCreateOrderZinreloEvent && isZinreloOrderCreationEventEnabled()) {
            sendOrderEventToZinrelo(orderNumber, orderStatuses.created);
        }

        // Send placed order event to zinrelo
        if (!viewData.stopCreateOrderZinreloEvent && isZinreloOrderPlacedEventEnabled()) {
            sendOrderEventToZinrelo(orderNumber, orderStatuses.placed);
        }
    }

    next();
});

module.exports = server.exports();
