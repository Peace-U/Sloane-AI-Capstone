require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User.js'); // import User from "./models/User.js";
const Order = require('./models/Order.js'); // import Order from "./models/Order.js";
const stripe = require('stripe')(process.env.STRIPE_SK); // import stripe from "stripe"
// stripe(process.env.STRIPE_SK)

const app = express();
const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL;

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('UPDATED API');    
});

app.get('/products', async (req, res) => {
    try {
        // const products = await Product.find();
        const products = [
            { id: 1, name: 'Product 1', price: 100 },
            { id: 2, name: 'Product 2', price: 200 },
            { id: 3, name: 'Product 3', price: 300 }
        ];
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const payload = {
            email: req.body.email.trim().toLowerCase(), // trimming whitespace and converting string to lowercase
            username: req.body.username.trim().toLowerCase(), // trim whitespaces and convert to lowercase
            password: req.body.password.trim(),
        }
        const newUser = new User(payload); // creates new user object to be saved in DB
        await newUser.save(); // save the object in DB
        const response = {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            login: true,
        }
        res.status(201).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
       const email = req.body.email.trim().toLowerCase(); // remove whitespace and convert to lowercase
       const password = req.body.password;
       const user = await User.findOne({ email, password }); // searches collection for email and password combination
       if(!user) { // only runs if credentials are INCORRECT
        return res.status(404).json({ error: "Invalid credentials, check your email and password combination" });
       }
       const response = {
        email: user.email,
        username: user.username,
        role: user.role,
        login: true,
       }
       res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/checkout-session", async (req, res) => {
    try {
        const { cartItems } = req.body;
        const line_items = cartItems.map((item) => ({
            price_data: {
                currency: "USD",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // converting to USD and rounding it
            },
            quantity: 1, // you would put item.quantity
        }));

        // Create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            billing_address_collection: "required",
            shipping_address_collection: {
                allowed_countries: ["US"], // where you put the allowed countries such as US, Mexico, Canada, etc.
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // reroutes to your frontend success page
            cancel_url: `${process.env.FRONTEND_URL}/cancelled`, // reroutes to frontend cancelled page
        });
        res.send({ url: session.url }); // stripe session URL sent back to client
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/order", async (req, res) => {
    try {
        const { sessionId } = req.query; // creates new order from stripe session id
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
        if(existingOrder) {
            return res.status(409).json({ message: "Order exists" });
        }
        const session = await stripe.checkout.sessions.retrieve(
            sessionId
        );
        const line_items = await stripe.checkout.sessions.listLineItems(
            sessionId
        );
        if(session && line_items) {
            const items = line_items.data;
            const address = session.collected_information.shipping_details.address;
            const paymentMethod = session.payment_method_types[0];
            const itemsPrice = session.amount_subtotal / 100; // USD currency conversion
            const taxPrice = session.total_details.amount_tax;
            const shippingPrice = session.total_details.amount_shipping;
            const isPaid = session.payment_status === "paid";
            const paidAt = session.created;
            const isDeliver = false; // hardcoded false but you will want to have a better way to determine if the order is delivery or not
            const stripePaymentIntentId = session.payment_intent;
            const totalPrice = itemsPrice + taxPrice + shippingPrice;
            const order = new Order({
                orderItems: items.map((item) => ({
                    name: item.description,
                    price: item.price.unit_amount / 100,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    address: address.line2 === null ? `${address.line1}` : `${address.line1} ${address.line2}`,
                    city: address.city,
                    postalCode: address.postal_code,
                    country: address.country,
                },
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt,
                isDeliver,
                deliveredAt: isDeliver ? new Date() : undefined,
                stripePaymentIntentId,
                stripeSessionId: sessionId,
            });
            const newOrder = await order.save();
            res.status(201).json(newOrder);
        } else {
            return res.status(400).json({ message: "Invalid session id or no order items" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
