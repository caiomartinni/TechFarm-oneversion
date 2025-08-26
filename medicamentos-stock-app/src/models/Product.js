class Product {
    constructor(id, name, quantity, expirationDate) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
    }

    validate() {
        if (!this.name || this.name.trim() === '') {
            throw new Error('Product name is required');
        }
        if (this.quantity < 0) {
            throw new Error('Quantity cannot be negative');
        }
        if (!this.expirationDate || isNaN(new Date(this.expirationDate))) {
            throw new Error('Valid expiration date is required');
        }
    }
}

export default Product;