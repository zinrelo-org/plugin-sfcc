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

                    // Initialize the dashbaord widget
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
 * Handles for rewards error operations
 * @param {string} errorMessage current event
 */
function showError(errorMessage) {
    $('.reward-error').html(errorMessage);
}


/**
 * Handles for rewards operations
 * @param {Object} e current event
 */
function handleRewardAjax(e) {
    e.preventDefault();
    const url = $(this).attr('action');
    const method = $(this).attr('method');
    var data = $(this).serialize();

    // Add csrf token
    const $inCartRedemptionCsrfToken = $('.inCartRedemptionCsrfToken');
    data += '&' + $inCartRedemptionCsrfToken.attr('name') + '=' + $inCartRedemptionCsrfToken.val();

    if (!url) {
        return;
    }

    $.spinner().start();
    $.ajax({
        url: url,
        method: method,
        data: data,
        success: function (result) {
            $.spinner().stop();
            if (result.success) {
                // Refresh the in-cart redemption section
                if (result.basketModel && result.basketModel.error && result.basketModel.error === true) {
                    showError(result.basketModel.errorMessage);
                } else {
                    $('body').trigger('renderInCartRedemptionSection');
                    $('body').trigger('couponRedemption', result.basketModel.basketModel);
                }
            } else {
                showError(result.reason);
            }
        },
        error: function () {
            $.spinner().stop();
        }
    });
}

/**
 * Binds events to in-cart redemption section
 */
function bindEvents() {
    var $redeemRewardForm = $('.redeemRewardForm');
    var $cancleRewardForm = $('.cancleRewardForm');
    var $zinreloRewardsDropdown = $('.zinreloRewardsDropdown');
    var $redeemZinreloRewardBtn = $('.redeemZinreloRewardBtn');

    if (!$zinreloRewardsDropdown.val()) {
        $redeemZinreloRewardBtn.attr('disabled', true);
    }

    $zinreloRewardsDropdown.on('change', function () {
        if ($(this).val()) {
            showError('');
            $redeemZinreloRewardBtn.attr('disabled', false);
        } else {
            $redeemZinreloRewardBtn.attr('disabled', true);
        }
    });

    $redeemRewardForm.on('submit', handleRewardAjax);
    $cancleRewardForm.on('submit', handleRewardAjax);
}

/**
 * Renders in cart redemption section in checkout
 */
function renderInCartRedemptionSection() {
    $('body').on('renderInCartRedemptionSection', function () {
        var inCartRedemptionURL = $('.inCartRedemptionURL').val();
        var $inCartRedemptionContainer = $('.inCartRedemptionContainer');
        var $spinnerCard = $inCartRedemptionContainer.find('.inCartRedemptionCard');

        if ($inCartRedemptionContainer.length > 0 && inCartRedemptionURL) {
            $spinnerCard.spinner().start();
            $.ajax({
                url: inCartRedemptionURL,
                method: 'GET',
                success: function (result) {
                    $inCartRedemptionContainer.html(result);
                    bindEvents();
                    $spinnerCard.spinner().stop();
                },
                error: function () {
                    $spinnerCard.spinner().stop();
                }
            });
        }
    });

    // Initial render
    $('body').trigger('renderInCartRedemptionSection');
}

/**
 * updates the order total summary in checkout
 */
function checkoutTotalsUpdate() {
    $('body').on('couponRedemption', function (e, data) {
        $('.shipping-total-cost').empty().append(data.totals.totalShippingCost);
        $('.tax-total').empty().append(data.totals.totalTax);
        $('.grand-total-sum').empty().append(data.totals.grandTotal);
        $('.sub-total').empty().append(data.totals.subTotal);
        if (data.totals.orderLevelDiscountTotal.value > 0) {
            $('.order-discount').removeClass('hide-order-discount');
            $('.order-discount-total').empty()
                .append('- ' + data.totals.orderLevelDiscountTotal.formatted);
        } else {
            $('.order-discount').addClass('hide-order-discount');
        }

        if (data.totals.shippingLevelDiscountTotal.value > 0) {
            $('.shipping-discount').removeClass('hide-shipping-discount');
            $('.shipping-discount-total').empty().append('- '
                + data.totals.shippingLevelDiscountTotal.formatted);
        } else {
            $('.shipping-discount').addClass('hide-shipping-discount');
        }

        data.items.forEach(function (item) {
            if (data.totals.orderLevelDiscountTotal.value > 0) {
                $('.coupons-and-promos').empty().append(data.totals.discountsHtml);
            }
            if (item.renderedPromotions) {
                $('.item-' + item.UUID).empty().append(item.renderedPromotions);
            } else {
                $('.item-' + item.UUID).empty();
            }
            $('.uuid-' + item.UUID + ' .unit-price').empty().append(item.renderedPrice);
            $('.line-item-price-' + item.UUID + ' .unit-price').empty().append(item.renderedPrice);
            $('.item-total-' + item.UUID).empty().append(item.priceTotal.renderedPrice);
        });
    });
}

/**
 * Handles attribute update event on PDP
 */
function handleProductAttributeUpdate() {
    $('body').on('product:afterAttributeSelect', function (e, result) {
        var $productContainer = result.container;
        var $zinreloProductPrice = $productContainer.find('.zinreloProductPrice');
        var $zinreloPDPRewardContainer = $productContainer.find('.zinreloPDPRewardContainer');

        var product = result && result.data && result.data.product;
        var price = product && product.zinreloPrice;
        var currentPrice = $zinreloProductPrice.val() || '';
        var isSamePrice = price === parseInt(currentPrice, 10);

        // eslint-disable-next-line camelcase, no-undef
        if (isSamePrice || (typeof zrl_mi === 'undefined')) {
            return;
        }

        if (price > 0) {
            $zinreloPDPRewardContainer.removeClass('d-none');
        } else {
            $zinreloPDPRewardContainer.addClass('d-none');
        }

        // Update price and zinrelo PDP rewards
        $zinreloProductPrice.val(price);
        // eslint-disable-next-line camelcase, no-undef
        zrl_mi.replace_product_page_potential();
    });
}

/**
 * The following funtion is configured in zinrelo admin dashbaord to get the product price
 *
    zrl_mi.price_identifier = function(){
        var product = {};
        price = $('.zinreloProductPrice').val();
        if(price){
            product['price'] = price;
        }
        return product;
    }
 */

module.exports = function (currentScript) {
    script = currentScript;
    return {
        initZinreloDashboard: initZinreloDashboard,
        renderInCartRedemptionSection: renderInCartRedemptionSection,
        checkoutTotalsUpdate: checkoutTotalsUpdate,
        handleProductAttributeUpdate: handleProductAttributeUpdate
    };
};
