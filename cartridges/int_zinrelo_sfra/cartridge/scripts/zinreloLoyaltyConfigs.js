'use strict';

/**
 * Generates config for fetch rewards api
 * @param {string} memberID zinrelo memebr id
 * @returns {Object} fetch rewards api configs
 */
function getRewardsAPIConfigs(memberID) {
    return {
        endpoint: 'members/' + memberID + '/rewards',
        method: 'GET',
        params: {
            idParam: 'member_id'
        }
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
        method: 'GET',
        params: {
            idParam: 'member_id'
        }
    };
}

/**
 * Generate config for get transactions api
 * @param {string} memberID zinrelo memebr id
 * @param {Object} options api options
 * @returns {Object} fetch rewards api configs
 */
function getTransactionListAPIConfigs(memberID, options) {
    var apiConfig = {
        endpoint: 'members/' + memberID + '/transactions',
        method: 'GET',
        params: {
            idParam: 'member_id'
        }
    };

    // Add options if provided
    if (options) {
        var { status } = options;
        if (status && status.length > 0) {
            apiConfig.params.status = status.length > 1 ? { in: status.join(',') } : { eq: status[0] };
        }
    }

    return apiConfig;
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
    getMemberAPIConfigs: getMemberAPIConfigs,
    getTransactionListAPIConfigs: getTransactionListAPIConfigs
};
