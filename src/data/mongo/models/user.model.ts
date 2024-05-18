


import mongoose from "mongoose";

const userSchema = new mongoose.Schema
(
    {
        name:{
            type: String,
            require: [true, 'Name is required']
        },
        email:{
            type: String,
            require: [true, 'Email is required'],
            unique: true
        },
        emailValidated:{
            type: Boolean,
            default: false            
        },
        password:{
            type: String,
            require: [true, 'Password is required']
        },
        img:{
            type: String            
        },
        role:{
            type: [String],
            default: ['USER_ROLE'],
            enum: ['ADMIN_ROLE', 'USER_ROLE']            
        }
    }
);

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc, ret, options) {
        delete ret._id;
        delete ret.password;
    },
});

export const UserModel = mongoose.model('Users', userSchema);