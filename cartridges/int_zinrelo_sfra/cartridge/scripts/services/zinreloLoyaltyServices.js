'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

const urlFormatter = require('*/cartridge/scripts/utils/urlFormatter');
const { getAPIKey, getParnerID } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
const serviceName = 'int_zinrelo.http.loyalty.service';

/**
 * Creates zinrelo loyalty service as per the provided endpoint and method
 * @param {Object} serviceOptions service options such as endpoint, request method etc
 * @return {dw.svc.Service} zirelo loyalty service
 */
function createZinreloLoyaltyService(serviceOptions) {
    var zinreloLoyaltyService = LocalServiceRegistry.createService(serviceName, {
        createRequest: function (svc, params) {
            svc.setURL(svc.URL + serviceOptions.endpoint);
            svc.setRequestMethod(serviceOptions.method);

            if (serviceOptions.params) {
                var finalURL = urlFormatter.addParamsToURL(svc.URL, serviceOptions.params);
                svc.setURL(finalURL);
            }

            // Add authorization headers
            svc.addHeader('api-key', getAPIKey());
            svc.addHeader('partner-id', getParnerID());
            svc.addHeader('Content-Type', 'application/json');

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
