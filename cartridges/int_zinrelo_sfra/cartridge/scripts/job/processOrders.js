'use strict';

/**
 * Process order send from salesforce to zinrelo api.
 *
 * @param parameters: The parameters defined in steptypes.json, custom.processOrders' type
 */
var Status = require('dw/system/Status');
var OrderMgr = require('dw/order/OrderMgr');

/**
 * Dynamic query to get orders.
 *
 * @param {Object} queryObj: The parameters defined in constants file to dynamic get query and status' type
 * @param {string} secret: String
 * @return {Object} : order with status data
 */
function fetchOrders(queryObj) {
    const constants = require('*/cartridge/scripts/utils/constants');
    var orderNumbers = [];
    var orders = [];
    var allOrders = OrderMgr.searchOrders(queryObj.query, 'orderNo asc', constants.orderStatuses[queryObj.status], queryObj.status);

    var count = 0;
    while (allOrders.hasNext()) {
        var order = allOrders.next();
        orderNumbers.push(order.orderNo);
        orders.push(order);
        count += 1;
        if (count === constants.orderChunkSize) {
            break;
        }
    }

    var orderDataObj = {
        orderEventPayload: {
            status: queryObj.status,
            orderIDs: orderNumbers
        },
        orders: orders
    };
    return orderDataObj;
}

exports.execute = function (parameters) {
    const {
        getAPIKey
    } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

    try {
        var isStepEnabled = parameters.isStepEnabled ? parameters.isStepEnabled : false;
        if (isStepEnabled) {
            const zinreloOrderHelpers = require('*/cartridge/scripts/helpers/zinreloOrderHelpers');
            const constants = require('*/cartridge/scripts/utils/constants');
            var statusQueryMapping = constants.statusQueryMapping;
            const secret = getAPIKey();
            statusQueryMapping.forEach(function (statusObj) {
                var ordersObj = fetchOrders(statusObj);
                if (ordersObj) {
                    var { orderEventPayload } = ordersObj;
                    var response = zinreloOrderHelpers.passOrderToZinreloWebhook(secret, orderEventPayload);
                    if (response.status === 'OK') {
                        var orders = ordersObj.orders;
                        var status = ordersObj.orderEventPayload.status;
                        zinreloOrderHelpers.updateOrders(orders, status);
                    }
                }
            });
            return new Status(Status.OK);
        }
        return new Status(Status.ERROR, 'Warn', 'Job step is not enabled.');
    } catch (e) {
        return new Status(Status.ERROR, 'Error', JSON.stringify(e));
    }
};
