


import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema
(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            unique: true
        },
        available:{
            type: Boolean,
            default: false
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        }
    }
);

export const CategoryModel = mongoose.model('Categories', categorySchema);