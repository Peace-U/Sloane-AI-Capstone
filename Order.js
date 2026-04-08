const mongoose = require("mongoose"); // import mongoose from "mongoose"

// order item schema is a sub mongoose schame that will be a piece of the orderSchema
const orderItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, { _id: false });

// shipping address schema is a sub mongoose schema that will be a piece of the orderSchema
const shippingAddressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
}, { _id: false });

// main order schema that will interact with the database and create new orders
const orderSchema = new mongoose.Schema({
    orderItems: [orderItemSchema], // list of orders structured based off orderItemSchema
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'stripe'],
        default: 'card'
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDeliver: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    stripePaymentIntentId: {
        type: String,
    },
    stripeSessionId: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// orderSchema.index({ user: 1 }); // only use this index if you are keeping track of user orders
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDeliver: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.virtual('orderNumber').get(function() {
    return `ORDER-${this._id.toString().substring(18,24).toUpperCase()}`;
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order; // export default Order;