const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONNECT TO MONGODB 
const dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sloane_consulting';

mongoose.connect(dbUrl)
  .then(() => console.log('🟢 MongoDB Connected Successfully!'))
  .catch(err => console.log('🔴 MongoDB Connection Error:', err));

// 2. DEFINE THE PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    format: { type: String, default: "Digital E-Book" }
});

const Product = mongoose.model('Product', productSchema);

// 3. FORCE SEED DATABASE (This guarantees your grids return)
const forceSeedDatabase = async () => {
    try {
        console.log('🧹 Clearing old database state...');
        await Product.deleteMany({}); // Wipes the slate clean
        
        console.log('📦 Restocking Aorex AI Playbooks...');
        await Product.insertMany([
            {
                name: "AI Governance (GRC) Readiness Framework",
                description: "A comprehensive toolkit for assessing and implementing AI governance, featuring step-by-step compliance checklists and regulatory guidelines.",
                price: 199.00,
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
                category: "AI & GRC"
            },
            {
                name: "Ethical AI & Risk Management Toolkit",
                description: "Essential risk assessment matrices and ethical AI policy templates designed to safeguard your enterprise tech deployments.",
                price: 175.00,
                image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
                category: "Risk Management"
            },
            {
                name: "Enterprise Software Implementation Playbook",
                description: "The ultimate guide for non-coding tech professionals. Step-by-step strategies for managing stakeholder expectations, UAT (User Acceptance Testing), and successful software rollouts.",
                price: 149.50,
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Implementation Guides"
            },
            {
                name: "AI-Driven Client Success Framework",
                description: "Optimizing hospitality-level client services for the tech industry using AI tools and data insights.",
                price: 99.00,
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Client Success"
            }
        ]);
        console.log('✅ Aorex Grids Restocked successfully!');
    } catch (error) {
        console.log("Error seeding database:", error);
    }
};

// Run the force seed
forceSeedDatabase();

// 4. API ROUTES
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 5. TURN ON SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Success! Server running on port ${PORT}`);
});