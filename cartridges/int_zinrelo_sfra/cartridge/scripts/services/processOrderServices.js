'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const serviceName = 'int_zinrelo.http.webhook.processorder';
const zinreloPreferencesHelpers = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

/**
 * Call the zinrelo webhook
 * @param {string} method request method
 * @return {dw.svc.Service} zirelo webhook service
 */
function processOrder() {
    var callback = {
        createRequest: function (svc, params) {
            var url = zinreloPreferencesHelpers.getZinreloWebhookURL();
            svc.setURL(url);
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('x-sfcc-signature', params.signature);
            svc.addHeader('nonce', params.nonce);
            svc.setRequestMethod('post');
            return JSON.stringify(params.payload);
        },
        parseResponse: function (svc, response) {
            return response.text;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    };

    var response = LocalServiceRegistry.createService(serviceName, callback);

    return response;
}

module.exports = {
    processOrder: processOrder
};
