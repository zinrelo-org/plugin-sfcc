'use strict';

const Transaction = require('dw/system/Transaction');
/**
 * Save orders and status to update custom status of zinreloOrderStatus.
 *
 * @param {string} orders: Object
 * @param {string} status: String
 * @return {Array} list of updated order numbers
 */
function updateOrders(orders, status) {
    var updatedOrders = [];
    if (!orders) {
        return updatedOrders;
    }

    Transaction.wrap(function () {
        orders.forEach(function (order) {
            var currentZinreloOrderStatus = order.custom.zinreloOrderStatus || '';
            var statusList = currentZinreloOrderStatus ? currentZinreloOrderStatus.split(',') : [];
            statusList.push(status);
            order.custom.zinreloOrderStatus = statusList.join(',');
            updatedOrders.push(order.orderNo);
        });
    });

    return updatedOrders;
}


/**
 * Pass order to zinrelo api.
 *
 * @param {string} secret: String
 * @param {Object} orderData: The parameters defined in processOrderServices and pass orderData, secret and call zinrelo api' type
 * @return {Object} : order proceesing data
 */
function passOrderToZinreloWebhook(secret, orderData) {
    const jwtGenerator = require('*/cartridge/scripts/utils/jwtGenerator');
    const processOrderService = require('*/cartridge/scripts/services/processOrderServices');
    const constants = require('*/cartridge/scripts/utils/constants');

    var date = new Date();
    var nonce = date.getTime();
    var signatureString = JSON.stringify(orderData) + ':' + nonce;
    var signature = jwtGenerator.createSignature(signatureString, secret, constants.HS512);

    var data = {
        nonce: nonce,
        signature: signature,
        payload: orderData
    };
    return processOrderService.processOrder().call(data);
}

/**
 * Send order to zinrelo with the provided event
 * @param {string} orderNumber order number
 * @param {string} status order status
 */
function sendOrderEventToZinrelo(orderNumber, status) {
    var OrderMgr = require('dw/order/OrderMgr');
    const { getAPIKey } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

    var apiKey = getAPIKey();
    var order = OrderMgr.getOrder(orderNumber);
    var orderNumbers = [orderNumber];

    var orderEventPayload = {
        status: status,
        orderIDs: orderNumbers
    };
    var response = passOrderToZinreloWebhook(apiKey, orderEventPayload);
    if (response.status === 'OK') {
        var orders = [order];
        updateOrders(orders, status);
    }
}

module.exports = {
    updateOrders: updateOrders,
    passOrderToZinreloWebhook: passOrderToZinreloWebhook,
    sendOrderEventToZinrelo: sendOrderEventToZinrelo
};
