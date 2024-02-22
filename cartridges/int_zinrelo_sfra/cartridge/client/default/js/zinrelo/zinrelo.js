'use strict';

var script;

/**
 * Initiates Zinrelo dashboard
 */
function initZinreloDashboard() {
    var authDataURL = script.getAttribute('auth-data-url');
    if (authDataURL) {
        $.ajax({
            url: authDataURL,
            method: 'GET',
            success: async function (response) {
                if (response.success && response.userAuthData) {
                    var {
                        partnerID, jwtToken, version, server
                    } = response.userAuthData;

                    window._zrl = window._zrl || [];
                    // eslint-disable-next-line no-undef
                    _zrl.push(['init', {
                        partner_id: partnerID,
                        jwt_token: jwtToken,
                        version: version,
                        server: server
                    }]);
                }
            },
            error: function () {}
        });
    }
}

/**
 * Renders in cart redemption section in checkout
 */
function initInCartRedemption() {
    var inCartRedemptionURL = $('.inCartRedemptionURL').val();
    var $inCartRedemptionContainer = $('.inCartRedemptionContainer');

    if ($inCartRedemptionContainer.length > 0 && inCartRedemptionURL) {
        $.spinner().start();
        $.ajax({
            url: inCartRedemptionURL,
            method: 'GET',
            success: function (result) {
                $inCartRedemptionContainer.html(result);
                $.spinner().stop();
            },
            error: function () {
                $.spinner().stop();
            }
        });
    }
}


module.exports = function (currentScript) {
    script = currentScript;
    return {
        initZinreloDashboard: initZinreloDashboard,
        initInCartRedemption: initInCartRedemption
    };
};
