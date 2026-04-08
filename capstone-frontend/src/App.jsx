import { useState, useEffect } from 'react';

function App() {
  // --- CORE STATE ---
  // --- CORE STATE ---
  const [products, setProducts] = useState([
    {
        _id: "1",
        name: "AI Governance (GRC) Readiness Framework",
        description: "A comprehensive toolkit for assessing and implementing AI governance, featuring step-by-step compliance checklists and regulatory guidelines.",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        category: "AI & GRC"
    },
    {
        _id: "2",
        name: "Ethical AI & Risk Management Toolkit",
        description: "Essential risk assessment matrices and ethical AI policy templates designed to safeguard your enterprise tech deployments.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
        category: "Risk Management"
    },
    {
        _id: "3",
        name: "Enterprise Software Implementation Playbook",
        description: "The ultimate guide for non-coding tech professionals. Step-by-step strategies for managing stakeholder expectations, UAT (User Acceptance Testing), and successful software rollouts.",
        price: 149.50,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Implementation Guides"
    },
    {
        _id: "4",
        name: "AI-Driven Client Success Framework",
        description: "Optimizing hospitality-level client services for the tech industry using AI tools and data insights.",
        price: 99.00,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Client Success"
    },
    {
        _id: "5",
        name: "Enterprise Workflow & Scaling Blueprint",
        description: "A strategic guide to mapping legacy business processes and layering AI automations to reduce manual overhead by up to 40% while scaling operations.",
        price: 249.00,
        image: "https://images.webroot.com/2021/05/Enterprise-Workflow-Automation.jpg",
        category: "Process Optimization"
    },
    {
        _id: "6",
        name: "Prompt Engineering Library for Project Managers",
        description: "A curated library of 100+ advanced AI prompts specifically designed to automate project tracking, meeting summaries, and agile sprint planning.",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
        category: "AI Toolkits"
    }
  ]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // NEW: Expanded View Modes for Navigation ('store', 'admin', 'overview', 'advisory', 'about')
  const [viewMode, setViewMode] = useState('store'); 
  
  // Checkout & Auth States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('idle');

  // Admin Form State
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', image: '' });

  // --- DATABASE & STORAGE CONNECTIONS ---
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log("Error fetching products:", err));
      
    const savedCart = localStorage.getItem('sloane_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedUser = localStorage.getItem('sloane_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('sloane_cart', JSON.stringify(cart));
  }, [cart]);

  // --- CART & PAYMENT FUNCTIONS ---
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) return prevCart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => setCart(prevCart => prevCart.filter(item => item._id !== productId));
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setCart([]);
      localStorage.removeItem('sloane_cart');
    }, 2000);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setPaymentStatus('idle');
  };

  // --- AUTH FUNCTIONS ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthStatus('processing');
    setTimeout(() => {
      const mockUser = { name: "Sloane Admin", email: "admin@sloane.com", role: "admin" };
      setUser(mockUser);
      localStorage.setItem('sloane_user', JSON.stringify(mockUser));
      setAuthStatus('idle');
      setIsAuthOpen(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    setViewMode('store'); 
    localStorage.removeItem('sloane_user');
  };

  // --- ADMIN FUNCTIONS ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = { ...newProduct, _id: Date.now().toString(), price: parseFloat(newProduct.price) };
    setProducts([...products, productToAdd]);
    setNewProduct({ name: '', description: '', price: '', category: '', image: '' });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
  };

  // Helper for Nav Link Styling
  const navStyle = (targetView) => ({
    cursor: 'pointer',
    color: viewMode === targetView ? '#0A2540' : '#666',
    fontWeight: viewMode === targetView ? 'bold' : '500',
    borderBottom: viewMode === targetView ? '2px solid #0A2540' : '2px solid transparent',
    paddingBottom: '0.25rem',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9f9f9', color: '#333' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#fff', padding: '1.5rem 2rem', borderBottom: '1px solid #eaeaea', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setViewMode('store')}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L38 11V29L20 38L2 29V11L20 2Z" fill="#F0F0F0" stroke="#0A2540" strokeWidth="1.5"/>
              <path d="M20 12L28 16V24L20 28L12 24V16L20 12Z" fill="#0A2540"/>
              <path d="M12 24V16L20 12V20L12 24Z" fill="#113A65"/>
              <path d="M20 20L28 24V16L20 20Z" fill="#1C528B"/>
              <path d="M20 20V28L28 24L20 20Z" fill="#2B6DA9"/>
            </svg>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: '#111', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>SLOANE</h1>
              <p style={{ color: '#0A2540', fontSize: '0.8rem', margin: '0 0 0 2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Enterprise AI Consulting</p>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0, fontSize: '0.95rem' }}>
              <li style={navStyle('overview')} onClick={() => setViewMode('overview')}>Firm Overview</li>
              <li style={navStyle('advisory')} onClick={() => setViewMode('advisory')}>Advisory Services</li>
              <li style={navStyle('store')} onClick={() => setViewMode('store')}>Digital Assets</li>
            </ul>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #eaeaea', paddingLeft: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Welcome, <strong style={{ color: '#111' }}>{user.name}</strong></span>
                  {user.role === 'admin' && (
                    <button onClick={() => setViewMode(viewMode === 'admin' ? 'store' : 'admin')} style={{ background: '#e2e8f0', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a' }}>
                      {viewMode === 'admin' ? 'Exit Admin' : 'Admin Dashboard'}
                    </button>
                  )}
                  <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ccc', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
                </div>
              ) : (
                <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} style={{ background: 'none', border: 'none', fontWeight: 'bold', color: '#0A2540', cursor: 'pointer' }}>Client Login</button>
              )}

              {/* Show Cart button only if not in Admin view */}
              {viewMode !== 'admin' && (
                <button onClick={() => setIsCartOpen(!isCartOpen)} style={{ background: '#0A2540', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cart ({cartItemCount})
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* --- DYNAMIC MAIN CONTENT VIEW --- */}
      <main style={{ padding: '3rem 2rem', flexGrow: 1, transition: 'margin-right 0.3s', marginRight: isCartOpen && viewMode !== 'admin' ? '350px' : '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* VIEW: OVERVIEW */}
          {viewMode === 'overview' && (
            <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: 0, textAlign: 'center' }}>Elevating Enterprises Through AI, Governance & Optimization</h2>
              
              <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: '1.7', marginBottom: '2rem' }}>
                Sloane Consulting Group (a division of SACIMAC Group LLC) is a premier advisory firm empowering enterprises through strategic AI implementation, robust GRC (Governance, Risk, and Compliance) readiness, high-touch client success frameworks, and intelligent process optimization designed to drive operational efficiency and ROI.
              </p>
              
              <h3 style={{ fontSize: '1.5rem', color: '#0A2540' }}>Our Approach</h3>
              <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.7' }}>
                We believe that the best technical deployments fail without equally robust human implementations. By leveraging decades of combined experience in team leadership, community engagement, and technical operations, we bridge the gap between complex software rollouts and end-user adoption. From managing stakeholder expectations during UAT to deploying cost-saving automations and crafting ethical AI policies, Sloane ensures your organization scales safely, securely, and efficiently.
              </p>
            </div>
          )}
                {/* VIEW: ADVISORY SERVICES */}
          {viewMode === 'advisory' && (
            <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#111', center: 0 }}>Our Advisory Pillars</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                
                <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', background: '#f8fafc' }}>
                  <h3 style={{ color: '#0A2540', marginTop: 0 }}>AI GRC Readiness</h3>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>Comprehensive auditing and framework development for AI compliance, ensuring your digital deployments meet regulatory standards and ethical guidelines.</p>
                </div>

                <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', background: '#f8fafc' }}>
                  <h3 style={{ color: '#0A2540', marginTop: 0 }}>Implementation Support</h3>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>Strategic oversight for non-coding technical operations, focusing on User Acceptance Testing (UAT), workflow documentation, and seamless software integration.</p>
                </div>

                <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', background: '#f8fafc' }}>
                  <h3 style={{ color: '#0A2540', marginTop: 0 }}>Client Success Operations</h3>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>Applying elite hospitality management principles to the tech sector, creating high-touch, AI-driven client retention models and vibrant digital communities.</p>
                </div>

                {/* YOUR NEW PILLAR */}
                <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '12px', background: '#f8fafc' }}>
                  <h3 style={{ color: '#0A2540', marginTop: 0 }}>AI Process Optimization</h3>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>Deploying intelligent automations to streamline legacy workflows. We help organizations save thousands of dollars annually by implementing effective AI systems that reduce cost overhead and drive unprecedented operational efficiency.</p>
                </div>

              </div>
            </div>
          )}
          {/* VIEW: DIGITAL ASSETS (STORE) */}
          {viewMode === 'store' && (
            <>
              <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.4rem', color: '#111', marginBottom: '0.5rem' }}>Strategic AI Frameworks</h2>
                <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '650px', margin: '0.5rem auto 0 auto', lineHeight: '1.6' }}>Leverage our expert-curated playbooks to scale Artificial Intelligence safely across your enterprise.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                {products.map(product => (
                  <div key={product._id} style={{ backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.25rem' }} />
                    <span style={{ fontSize: '0.8rem', color: '#0A2540', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                    <h3 style={{ fontSize: '1.3rem', margin: '0.5rem 0', color: '#222' }}>{product.name}</h3>
                    <p style={{ color: '#555', fontSize: '0.95rem', flexGrow: 1, marginBottom: '1.5rem' }}>{product.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#28a745' }}>${parseFloat(product.price).toFixed(2)}</span>
                      <button onClick={() => addToCart(product)} style={{ background: '#111', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VIEW: ADMIN DASHBOARD */}
          {viewMode === 'admin' && (
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 350px', backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <h2 style={{ marginTop: 0, color: '#111', borderBottom: '2px solid #0A2540', paddingBottom: '0.5rem', display: 'inline-block' }}>Add New Framework</h2>
                <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Product Name</label>
                    <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Category</label>
                      <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Price ($)</label>
                      <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Image URL (Unsplash)</label>
                    <input type="url" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Description</label>
                    <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows="3" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Publish Product</button>
                </form>
              </div>

              <div style={{ flex: '2 1 500px', backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <h2 style={{ marginTop: 0, color: '#111', borderBottom: '2px solid #0A2540', paddingBottom: '0.5rem', display: 'inline-block' }}>Manage Inventory</h2>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {products.length === 0 ? <p>No products available.</p> : products.map(product => (
                    <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0' }}>{product.name}</h4>
                          <span style={{ fontSize: '0.85rem', color: '#666', background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{product.category}</span>
                          <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 'bold', marginLeft: '0.5rem' }}>${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(product._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SHOPPING CART OVERLAY */}
      {isCartOpen && viewMode !== 'admin' && (
        <div style={{ position: 'fixed', top: '88px', right: 0, bottom: 0, width: '350px', backgroundColor: '#fff', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)', padding: '2rem', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>Your cart is empty.</p> : cart.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '2px solid #111', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total:</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} disabled={cart.length === 0} style={{ width: '100%', background: cart.length === 0 ? '#ccc' : '#28a745', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* STRIPE CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            {paymentStatus === 'idle' && (
              <form onSubmit={handlePayment}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111' }}>Secure Checkout</h2>
                  <button type="button" onClick={closeCheckout} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>×</button>
                </div>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Amount due: <strong style={{ color: '#111', fontSize: '1.2rem' }}>${cartTotal.toFixed(2)}</strong></p>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" required placeholder="you@company.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Card Information (Stripe Test)</label>
                  <input type="text" required placeholder="4242 4242 4242 4242" maxLength="16" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" required placeholder="MM/YY" maxLength="5" style={{ width: '50%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                    <input type="text" required placeholder="CVC" maxLength="3" style={{ width: '50%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <button type="submit" style={{ width: '100%', background: '#0A2540', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>Pay ${cartTotal.toFixed(2)}</button>
              </form>
            )}
            {paymentStatus === 'processing' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h2 style={{ color: '#0A2540', marginBottom: '1rem' }}>Processing Payment...</h2>
              </div>
            )}
            {paymentStatus === 'success' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#28a745', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>✓</div>
                <h2 style={{ color: '#111', marginBottom: '0.5rem' }}>Payment Successful!</h2>
                <button onClick={closeCheckout} style={{ width: '100%', background: '#f0f0f0', color: '#333', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>Return to Store</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTHENTICATION MODAL */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            {authStatus === 'idle' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111' }}>{authMode === 'login' ? 'Client Login' : 'Create Account'}</h2>
                  <button onClick={() => setIsAuthOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>×</button>
                </div>
                <form onSubmit={handleAuthSubmit}>
                  {authMode === 'signup' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Full Name</label>
                      <input type="text" required placeholder="Jane Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                    </div>
                  )}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Email Address</label>
                    <input type="email" required placeholder="admin@sloane.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Password</label>
                    <input type="password" required placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', background: '#0A2540', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h2 style={{ color: '#0A2540', marginBottom: '1rem' }}>Authenticating...</h2>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0A2540', color: '#ccc', padding: '2rem', marginTop: 'auto', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 'bold' }}>SLOANE</p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>© 2026 Sloane Consulting Group. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;