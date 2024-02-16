'use strict';

const jwtGenerator = require('*/cartridge/scripts/utils/jwtGenerator');
const zinreloUserAuthHelpers = require('*/cartridge/scripts/helpers/zinreloAuthDataHelpers');

const {
    getParnerID,
    getAPIKey
} = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');

const {
    ZINRELO_AUTH_VERSION,
    ZINRELO_SERVER_URL
} = require('*/cartridge/scripts/utils/constants');

/**
 * Generates data for user auth for zinrelo dashboard
 * @param {Object} customer user object
 * @returns {Object | null} user auth data
 */
function getUserAuthData(customer) {
    var userAuthData = {};
    var jwtToken = '';
    if (!customer) {
        return null;
    }

    const partnerID = getParnerID();
    const secret = getAPIKey();

    if (customer.raw && customer.raw.profile) {
        try {
            // Get JWT token
            const userJWTData = zinreloUserAuthHelpers.generateUserDataForJWT(customer.raw.profile);
            jwtToken = jwtGenerator.generateJTWToken(userJWTData, secret);
        } catch (error) {
            jwtToken = '';
        }
    }

    Object.assign(userAuthData, {
        partnerID: partnerID,
        jwtToken: jwtToken,
        version: ZINRELO_AUTH_VERSION,
        server: ZINRELO_SERVER_URL
    });

    return userAuthData;
}

module.exports = {
    getUserAuthData: getUserAuthData
};
