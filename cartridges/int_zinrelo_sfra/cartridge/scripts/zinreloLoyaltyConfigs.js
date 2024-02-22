'use strict';

/**
 * Generates config for fetch rewards api
 * @param {string} memberID zinrelo memebr id
 * @returns {Object} fetch rewards api configs
 */
function getRewardsAPIConfigs(memberID) {
    return {
        endpoint: 'members/' + memberID + '/rewards',
        method: 'GET'
    };
}

/**
 * Generates config for fetch member api
 * @param {string} memberID zinrelo memebr id
 * @returns {Object} fetch member api configs
 */
function getMemberAPIConfigs(memberID) {
    return {
        endpoint: 'members/' + memberID,
        method: 'GET'
    };
}

/**
 * Generates config for reward redeem api
 * @returns {Object} reward redeem api configs
 */
function getRedeemAPIConfigs() {
    return {
        endpoint: 'transactions/redeem',
        method: 'POST'
    };
}

/**
 * Generates config for approve transaction api
 * @param {string} transactionID transaction id
 * @returns {Object} approve transaction api configs
 */
function getTransactionApproveAPIConfigs(transactionID) {
    return {
        endpoint: 'transactions/' + transactionID + '/approve',
        method: 'POST'
    };
}

/**
 * Generates config for reject transaction api
 * @param {string} transactionID transaction id
 * @returns {Object} reject transaction api configs
 */
function getTransactionRejectAPIConfigs(transactionID) {
    return {
        endpoint: 'transactions/' + transactionID + '/reject',
        method: 'POST'
    };
}

module.exports = {
    getRewardsAPIConfigs: getRewardsAPIConfigs,
    getRedeemAPIConfigs: getRedeemAPIConfigs,
    getTransactionApproveAPIConfigs: getTransactionApproveAPIConfigs,
    getTransactionRejectAPIConfigs: getTransactionRejectAPIConfigs,
    getMemberAPIConfigs: getMemberAPIConfigs
};
