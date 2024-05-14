'use strict';

const { getCategoryIDs } = require('*/cartridge/scripts/utils/productDataFormatter');

/**
 * Gets price from product
 * @param {Object} product product object
 * @returns {number} price
 */
function getZinreloPrice(product) {
    var price;
    var totalPrice;
    var productPrice = product && product.price;
    var productQuantity = (product && product.selectedQuantity) || 1;

    if (productPrice && productPrice.type === 'range') {
        productPrice = productPrice.min;
    }

    var listPrice = productPrice && productPrice.list && productPrice.list.value;
    var salesPrice = productPrice && productPrice.sales && productPrice.sales.value;
    price = salesPrice || listPrice || 0;
    totalPrice = price * productQuantity;

    return totalPrice;
}

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'zinreloPrice', {
        enumerable: true,
        value: getZinreloPrice(object)
    });

    Object.defineProperty(object, 'productCategories', {
        enumerable: true,
        value: getCategoryIDs(apiProduct && apiProduct.categories)
    });
};
