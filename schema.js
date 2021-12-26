const { DateTime } = require("actions-on-google");
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required:true,
        default: 10,
    },
    color: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    clicked: {
        type: Number,
        default: 0,
    },
    
    
},
{
    timestamps:true
});

const TicketSchema = new mongoose.Schema({
    number: {
        type: Number,
    },
    
},
{
    timestamps:true
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    number:{
        type:Number
    }
},
{
    timestamps:true
});

const Product = mongoose.model("Product", ProductSchema);
const Ticket = mongoose.model("Ticket", TicketSchema);
const User = mongoose.model("User", UserSchema);
module.exports = [Product, Ticket,User];