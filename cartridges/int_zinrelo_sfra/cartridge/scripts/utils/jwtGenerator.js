'use strict';

var base = module.superModule || {};

const Mac = require('dw/crypto/Mac');
const Encoding = require('dw/crypto/Encoding');
const Bytes = require('dw/util/Bytes');
const jwtValidityInSeconds = 3600;


/**
 * Converts to base64 url encoded format
 * @param {string} string string to be converted
 * @returns {string} converted string
 */
function convertToBase64UrlEncoded(string) {
    // eslint-disable-next-line no-useless-escape
    return string.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/m, '');
}

/**
 * Converts a string to base64
 * @param {string | dw.utils.Bytes} string text to be converted
 * @returns {string} converted string
 */
function convertToBase64(string) {
    var base64String = '';

    if (string instanceof require('dw/util/Bytes')) {
        base64String = Encoding.toBase64(string);
    } else {
        var stringToBytes = new Bytes(string, 'UTF8');
        base64String = Encoding.toBase64(stringToBytes);
    }

    return convertToBase64UrlEncoded(base64String);
}

/**
 * Generates JWT token
 * @param {Object} data payload data for jwt
 * @param {string} secret secret to sign the token
 * @returns {string} JWT Token
 */
function generateJTWToken(data, secret) {
    const currentTime = new Date();
    const currentTimeInSeconds = parseInt(currentTime.getTime() / 1000, 10);
    const signWithHMACSHA256 = new Mac(Mac.HMAC_SHA_256);

    // Encrypt headers
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const encodedHeaders = convertToBase64(JSON.stringify(header));

    // Get the payload ready
    var payload = data || {};
    var expirationTime = currentTimeInSeconds + jwtValidityInSeconds;
    payload.exp = expirationTime;
    const encodedPlayload = convertToBase64(JSON.stringify(payload));

    // Create signature
    const signature = signWithHMACSHA256.digest(`${encodedHeaders}.${encodedPlayload}`, secret);
    const encodedSignature = convertToBase64(signature);

    // Add them all to create jwt
    const jwt = `${encodedHeaders}.${encodedPlayload}.${encodedSignature}`;
    return jwt;
}

Object.assign(base, {
    generateJTWToken: generateJTWToken
});

module.exports = base;
