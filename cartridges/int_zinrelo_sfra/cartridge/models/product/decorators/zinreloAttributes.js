'use strict';

/**
 * Gets price from product
 * @param {Object} product product object
 * @returns {number} price
 */
function getZinreloPrice(product) {
    var price;

    var listPrice = product && product.price && product.price.list && product.price.list.value;
    var salesPrice = product && product.price && product.price.sales && product.price.sales.value;
    price = salesPrice || listPrice;

    return price;
}

module.exports = function (object) {
    Object.defineProperty(object, 'zinreloPrice', {
        enumerable: true,
        value: getZinreloPrice(object)
    });
};
