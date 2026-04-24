/**
 * Generate a unique SKU for a product
 */
const generateSKU = (productName, categoryId = null) => {
    // Get first 3 letters of product name (remove special chars)
    const nameCode = productName
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 3)
        .toUpperCase();

    // Pad with X if less than 3 chars
    const paddedNameCode = nameCode.padEnd(3, 'X');

    // Category code (if provided)
    let categoryCode = 'GEN';
    if (categoryId) {
        categoryCode = `CAT${categoryId}`;
    }

    // Timestamp component (last 4 digits of timestamp)
    const timestamp = Date.now().toString().slice(-4);

    // Random number (4 digits)
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Combine to create SKU
    return `${categoryCode}-${paddedNameCode}-${timestamp}-${randomNum}`;
};

/**
 * Validate SKU format
 */
const validateSKU = (sku) => {
    const skuRegex = /^[A-Z0-9]{3,6}-[A-Z0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    return skuRegex.test(sku);
};

/**
 * Generate bulk SKUs for multiple products
 */
const generateBulkSKUs = (products) => {
    return products.map(product => ({
        ...product,
        sku: generateSKU(product.name, product.categoryId)
    }));
};

module.exports = {
    generateSKU,
    validateSKU,
    generateBulkSKUs
};