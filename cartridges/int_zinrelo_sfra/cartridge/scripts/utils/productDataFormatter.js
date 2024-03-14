'use strict';

const collections = require('*/cartridge/scripts/util/collections');

/**
 * Gets list of category IDs from collection of categories
 * @param {dw.util.Collection | Array} categories collection of categories
 * @returns {Array} list of category IDs
 */
function getCategoryIDs(categories) {
    var categoryIDs = [];

    if (!categories) {
        return categoryIDs;
    }

    collections.forEach(categories, function (category) {
        categoryIDs.push(category.ID);
    });

    return categoryIDs;
}


module.exports = {
    getCategoryIDs: getCategoryIDs
};
