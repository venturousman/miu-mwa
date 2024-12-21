import mongoose, {Types} from 'mongoose';
import dotenv from 'dotenv';
import { Product, ProductModel } from './schema/product';

dotenv.config();

main().catch(err => console.log(err));

async function addProduct(product: Product) {
    // const newProduct = new ProductModel(product);
    // return newProduct.save(); // This is also correct
    return ProductModel.create(product);
}

async function deleteProductById(id: Types.ObjectId) {
    return ProductModel.findByIdAndDelete(id);
}

async function updateProductById(id: Types.ObjectId, product: Product) {
    return ProductModel.findByIdAndUpdate(id, product, { new: true }); // { new: true } is to return the updated document
}

async function applyDiscount(category: string, discount: number) {
    return ProductModel.updateMany({ 'location.category': category }, { $mul: { price: discount } });
}

async function increasePrice(category: string, increase: number) {
    return ProductModel.updateMany({ 'location.category': category }, { $inc: { price: increase } });
}

async function findProductsByPriceRange(min: number, max: number, page: number, limit: number) {
    return ProductModel.find({ price: { $gte: min, $lte: max } }).skip((page - 1) * limit).limit(limit);
}

async function findProductsByCategory(category: string, page: number, limit: number) {
    return ProductModel.find({ 'location.category': category }).skip((page - 1) * limit).limit(limit);
}

async function findProductsByAmountLessThan(amount: number, page: number, limit: number) {
    return ProductModel.find({ amount: { $lt: amount } }).skip((page - 1) * limit).limit(limit);
}

async function main() {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error('MongoDB URL is not provided');
    }
    await mongoose.connect(mongoUrl);

    // Add a product
    const fruit1: Product = {
        name: 'Apple',
        location: {
            category: 'fruit',
            aisle: 'A1'
        },
        price: 1.99,
        amount: 100
    };
    var addedFruit1 = await addProduct(fruit1);
    console.log('Fruit 1 added:', addedFruit1);

    const fruit2: Product = {
        name: 'Banana',
        location: {
            category: 'fruit',
            aisle: 'A2'
        },
        price: 2.18,
        amount: 125
    };
    var addedFruit2 = await addProduct(fruit2);
    console.log('Fruit 2 added:', addedFruit2);

    const vegetable1: Product = {
        name: 'Carrot',
        location: {
            category: 'vegetable',
            aisle: 'B1'
        },
        price: 0.99,
        amount: 200
    };
    var addedVegetable1 = await addProduct(vegetable1);
    console.log('Vegetable 1 added:', addedVegetable1);

    const vegetable2: Product = {
        name: 'Potato',
        location: {
            category: 'vegetable',
            aisle: 'B2'
        },
        price: 1.29,
        amount: 9
    };
    var addedVegetable2 = await addProduct(vegetable2);
    console.log('Vegetable 2 added:', addedVegetable2);

    console.log('===========================================================');

    // delete a product by `_id`
    const id = addedFruit1._id;
    var deletedProduct = await deleteProductById(id);
    console.log('Product deleted:', deletedProduct);

    console.log('===========================================================');

    // update a product properties by `_id`
    const id2 = addedFruit2._id;
    const updatingProduct: Product = {
        name: 'Banana (updated)',
        location: {
            category: 'fruit',
            aisle: 'A3'
        },
        price: 2.31,
        amount: 150
    };
    var updatedProduct2 = await updateProductById(id2, updatingProduct);
    console.log('Product 2 updated:', updatedProduct2);

    console.log('===========================================================');

    // apply a discount of 10% across all fruits
    const discount = 0.9;
    var discountedProducts = await applyDiscount('fruit', discount);
    console.log('Discount applied:', discountedProducts);

    console.log('===========================================================');

    // increase the vegetables price 50 cents.
    const increase = 0.5;
    var increasedProducts = await increasePrice('vegetable', increase);
    console.log('Price increased:', increasedProducts);

    console.log('===========================================================');

    // find all products with a price between a range of minimum and maximum value, with pagination
    const minPrice = 1.0;
    const maxPrice = 2.0;
    const page = 1;
    const limit = 10;
    var productsInRange = await findProductsByPriceRange(minPrice, maxPrice, page, limit);
    console.log('Products in range:', productsInRange);

    console.log('===========================================================');

    // find all products in a specific category, with pagination.
    const category = 'fruit';
    var productsInCategory = await findProductsByCategory(category, page, limit);
    console.log('Products in category:', productsInCategory);

    console.log('===========================================================');

    // find all products with an amount less than 10, with pagination
    const amount = 10;
    var productsWithAmountLessThan = await findProductsByAmountLessThan(amount, page, limit);
    console.log('Products with amount less than:', productsWithAmountLessThan);

    console.log('===========================================================');

    mongoose.connection.close();
}