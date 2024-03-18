'use strict';

const ProductMgr = require('dw/catalog/ProductMgr');

const { getCategoryIDs } = require('*/cartridge/scripts/utils/productDataFormatter');
const collections = require('*/cartridge/scripts/util/collections');

/**
 * Modifies order search response to add product items categories for zinrelo
 * @param {Object} orderSearchResponse response object
 */
function modifyPOSTResponse(orderSearchResponse) {
    var orders = orderSearchResponse && orderSearchResponse.hits;

    if (!orders) {
        return;
    }

    // Add categories for product items in the response
    collections.forEach(orders, function (order) {
        var productLineItems = order.data && order.data.productItems;
        collections.forEach(productLineItems, function (productLineItem) {
            var productID = productLineItem && productLineItem.productId;
            var product = ProductMgr.getProduct(productID);
            var categoryIDs = getCategoryIDs(product.categories);
            productLineItem.c_categories = categoryIDs;
        });
    });
}

module.exports = {
    modifyPOSTResponse: modifyPOSTResponse
};
