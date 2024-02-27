'use strict';

const ISML = require('dw/template/ISML');

/**
 * Implements the html head hook to allow adding global javascript for zinrelo
 */
function htmlHead() {
    const URLUtils = require('dw/web/URLUtils');
    ISML.renderTemplate('zinrelo/zinreloHeadScript', { authDataURL: URLUtils.url('Zinrelo-UserAuthData') });
}

module.exports = {
    htmlHead: htmlHead
};
