'use strict';

var base = module.superModule || {};

/**
 * Converts a single digit number to double digit
 * @param {string | number} singleDigit number to be converted
 * @returns {string} double digit number
 */
function singleToDoubleDigit(singleDigit) {
    var doubleDigit = singleDigit;

    if ((typeof singleDigit === 'string' && singleDigit.length === 1) || (typeof singleDigit === 'number' && singleDigit < 10)) {
        doubleDigit = '0' + singleDigit;
    }

    return doubleDigit;
}

/**
 * Formats system date to the required format
 * @param {Date} date system date
 * @param {string} format required date format
 * @returns {string} formatted date
 */
function formatDate(date, format) {
    var formattedDate = '';

    if (date && date instanceof Date && format) {
        const year = date.getYear();
        const month = singleToDoubleDigit(date.getMonth() + 1);
        const day = singleToDoubleDigit(date.getDate());
        const hours = singleToDoubleDigit(date.getHours());
        const minutes = singleToDoubleDigit(date.getMinutes());
        const seconds = singleToDoubleDigit(date.getSeconds());

        formattedDate = format.toLowerCase()
            .replace('yy', year)
            .replace('mm', month)
            .replace('dd', day)
            .replace('hh', hours)
            .replace('mn', minutes)
            .replace('ss', seconds);
    }

    return formattedDate;
}

base.formatDate = formatDate;
base.singleToDoubleDigit = singleToDoubleDigit;

module.exports = base;
