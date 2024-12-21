import { InferSchemaType, Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: {
        category: { type: String, enum: ['vegetable', 'fruit'], default: 'vegetable' },
        aisle: { type: String, required: true }
    },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { timestamps: true });

type ProductWithTimestamps = InferSchemaType<typeof ProductSchema>;

export type Product = Partial<ProductWithTimestamps>;
// compile schema into a model
// Models are fancy constructors compiled from Schema definitions
// An instance of a model is called a document.
export const ProductModel = model<Product>('product', ProductSchema);