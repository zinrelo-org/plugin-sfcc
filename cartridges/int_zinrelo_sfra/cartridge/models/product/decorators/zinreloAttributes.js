'use strict';

/**
 * Gets price from product
 * @param {Object} product product object
 * @returns {number} price
 */
function getZinreloPrice(product) {
    var price;
    var productPrice = product && product.price;

    if (productPrice && productPrice.type === 'range') {
        productPrice = productPrice.min;
    }

    var listPrice = productPrice && productPrice.list && productPrice.list.value;
    var salesPrice = productPrice && productPrice.sales && productPrice.sales.value;
    price = salesPrice || listPrice || 0;

    return price;
}

module.exports = function (object) {
    Object.defineProperty(object, 'zinreloPrice', {
        enumerable: true,
        value: getZinreloPrice(object)
    });
};
