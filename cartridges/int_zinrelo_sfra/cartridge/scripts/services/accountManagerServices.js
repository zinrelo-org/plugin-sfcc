'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

const serviceName = 'account.manager.generate.token';

/**
 * Creates token service to generate access token
 * @returns {dw.svc.Service} generate token service
 */
function createTokenService() {
    var generateTokenService = LocalServiceRegistry.createService(serviceName, {
        createRequest: function (svc) {
            svc.setRequestMethod('POST');
            svc.setAuthentication('BASIC');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');

            return 'grant_type=client_credentials';
        },
        parseResponse: function (svc, response) {
            return response.text;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return generateTokenService;
}

module.exports = {
    createTokenService: createTokenService
};
