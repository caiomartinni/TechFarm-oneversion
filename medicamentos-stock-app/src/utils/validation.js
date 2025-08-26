function validateProductData(product) {
    const errors = {};

    if (!product.name || product.name.trim() === '') {
        errors.name = 'Product name is required.';
    }

    if (!product.quantity || product.quantity <= 0) {
        errors.quantity = 'Quantity must be a positive number.';
    }

    if (!product.expirationDate) {
        errors.expirationDate = 'Expiration date is required.';
    } else if (new Date(product.expirationDate) < new Date()) {
        errors.expirationDate = 'Expiration date must be in the future.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export { validateProductData };