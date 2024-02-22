'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

const { getAPIKey, getParnerID } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
const serviceName = 'int_zinrelo.http.loyalty.service';

/**
 * Creates zinrelo loyalty service as per the provided endpoint and method
 * @param {string} endpoint zinrelo loyalty service endpoint
 * @param {string} method request method
 * @return {dw.svc.Service} zirelo loyalty service
 */
function createZinreloLoyaltyService(endpoint, method) {
    var zinreloLoyaltyService = LocalServiceRegistry.createService(serviceName, {
        createRequest: function (svc, params) {
            svc.setURL(svc.URL + endpoint);
            svc.setRequestMethod(method);
            svc.addParam('idParam', 'member_id');

            // Add authorization headers
            svc.addHeader('api-key', getAPIKey());
            svc.addHeader('partner-id', getParnerID());

            return JSON.stringify(params);
        },
        parseResponse: function (svc, response) {
            return response.text;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return zinreloLoyaltyService;
}

module.exports = {
    createZinreloLoyaltyService: createZinreloLoyaltyService
};
