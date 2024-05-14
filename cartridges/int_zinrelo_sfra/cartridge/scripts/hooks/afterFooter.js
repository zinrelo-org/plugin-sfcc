'use strict';

const ISML = require('dw/template/ISML');
const URLUtils = require('dw/web/URLUtils');

/**
 * Implements the html head hook to allow adding global javascript for zinrelo
 */
function afterFooter() {
    const zinreloPreferencesHelpers = require('*/cartridge/scripts/helpers/zinreloPreferencesHelpers');
    if (zinreloPreferencesHelpers.isZinreloEnabled()) {
        ISML.renderTemplate('zinrelo/zinreloScript', { authDataURL: URLUtils.url('Zinrelo-UserAuthData') });
    }
}

module.exports = {
    afterFooter: afterFooter
};
