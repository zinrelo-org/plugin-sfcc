'use strict';

/**
 * Save orders and status to update custom status of zinreloOrderStatus.
 *
 * @param {string} orders: Object
 * @param {string} status: String
 */
function updateOrders(orders, status) {
    var Transaction = require('dw/system/Transaction');

    Transaction.wrap(function () {
        orders.forEach(function (order) {
            order.custom.zinreloOrderStatus = status;
        });
    });
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

module.exports = {
    updateOrders: updateOrders,
    passOrderToZinreloWebhook: passOrderToZinreloWebhook
};
