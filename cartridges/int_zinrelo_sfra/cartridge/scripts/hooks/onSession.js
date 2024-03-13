'use strict';

/**
 * Clears the pending timeout rewards
 */
function onSession() {
    var zinreloHelper = require('*/cartridge/scripts/helpers/zinreloHelpers');
    zinreloHelper.cleanUpRewards();
}

module.exports = {
    onSession: onSession
};
