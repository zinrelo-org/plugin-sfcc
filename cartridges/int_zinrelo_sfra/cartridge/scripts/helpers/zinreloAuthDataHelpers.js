'use strict';

const Locale = require('dw/util/Locale');

const dateFormatter = require('*/cartridge/scripts/utils/dateFormatter');
const { getPreferredLanguages } = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
const { ZINRELO_DATE_FORMAT } = require('*/cartridge/scripts/utils/constants');

/**
 * Gets current locale language
 * @returns {string} current locale language
 */
function getCurrentLocaleLanguage() {
    var currentLanguage = '';
    const currentLocaleID = request.locale;
    const currentLocale = Locale.getLocale(currentLocaleID);

    if (currentLocale && currentLocale.language) {
        var preferredLanguages = getPreferredLanguages();
        currentLanguage = (preferredLanguages && preferredLanguages[currentLocale.language]) || '';
    }

    return currentLanguage;
}

/**
 * Gets zinrelo member id for customer
 * @param {dw.customer.Customer} customer customer
 * @returns {string} zinrelo member id
 */
function getZinreloMemberID(customer) {
    return (customer && customer.email) || '';
}

/**
 * Generates required data for JWT Token
 * @param {Object} customer user object
 * @returns {Object} user data for JWT
 */
function generateUserDataForJWT(customer) {
    var userData = {};

    if (customer) {
        userData = {
            member_id: getZinreloMemberID(customer),
            email_address: customer.email,
            first_name: customer.firstName || '',
            last_name: customer.lastName || '',
            birthdate: dateFormatter.formatDate(customer.birthday, ZINRELO_DATE_FORMAT) || '',
            anniversary_date: dateFormatter.formatDate(customer.custom.anniversaryDateZinrelo, ZINRELO_DATE_FORMAT) || '',
            preferred_language: customer.custom.zinreloPreferredLanguage || getCurrentLocaleLanguage(),
            custom_attributes: {
                last_visit_date: dateFormatter.formatDate(customer.lastLoginTime, ZINRELO_DATE_FORMAT),
                external_member_id: customer.customerNo
            }
        };

        // Add user phone number
        if (customer.custom.isdCode && customer.custom.phoneHome) {
            userData.phone_number = customer.custom.isdCode + '-' + customer.custom.phoneHome;
        }
    } else {
        userData = {
            preferred_language: getCurrentLocaleLanguage()
        };
    }

    return userData;
}

module.exports = {
    generateUserDataForJWT: generateUserDataForJWT,
    getCurrentLocaleLanguage: getCurrentLocaleLanguage,
    getZinreloMemberID: getZinreloMemberID
};
