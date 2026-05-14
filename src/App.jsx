import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { ShoppingBag, X, MessageCircle, Search, User, ArrowRight, Globe, Plus, Minus, Trash2 } from 'lucide-react'
import allProducts from './products.json'

const WHATSAPP_NUMBER = "2348147629404";
const INSTAGRAM_URL = "https://www.instagram.com/tabirae_global/";

// --- CUSTOM CURSOR ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      <div 
        className={`cursor-ring ${isActive ? 'active' : ''}`} 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div 
        className={`cursor-dot ${isActive ? 'active' : ''}`} 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};

// --- COMPONENTS ---

const Header = ({ onFilterChange, cartCount, onOpenCart }) => (
  <header className="header">
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.05em', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        TABIRAE
      </div>
      
      <nav className="header-nav" style={{ display: 'none', gap: '2rem' }}>
        <button onClick={() => onFilterChange('All')} className="nav-link">New Arrivals</button>
        <button onClick={() => onFilterChange('Shirts')} className="nav-link">Shirts</button>
        <button onClick={() => onFilterChange('Scarves')} className="nav-link">Scarves</button>
      </nav>

      <div className="header-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Search size={18} strokeWidth={2.5} style={{ opacity: 0.4 }} />
        <User size={18} strokeWidth={2.5} style={{ opacity: 0.4 }} />
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onOpenCart}>
          <ShoppingBag size={20} strokeWidth={2.5} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#B8860B', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 800 }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </div>
  </header>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="hero">
      <motion.div className="hero-img" style={{ y: y1, opacity }}>
        <img src="/assets/tabirae_final_hero.png" alt="Tabirae Global" />
        <div className="hero-overlay" />
      </motion.div>
      <div className="hero-content container">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-meta mb-4"
          style={{ color: '#111' }}
        >
          Established 2026
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', marginBottom: '3rem' }}
        >
          The Art of <br /> <span className="italic">Excellence</span>
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <a href="#collection" className="btn btn-outline">Explore Boutique</a>
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, index, onClick, onAddToBag }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: (index % 4) * 0.1 }}
    className="card"
  >
    <div className="card-img" onClick={() => onClick(product)}>
      <img src={product.image_url} alt={product.name} />
      <div className="card-hover-overlay" style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', opacity: 0, transition: 'opacity 0.3s ease' }}>
         <button 
           onClick={(e) => { e.stopPropagation(); onAddToBag(product); }}
           className="btn btn-black" 
           style={{ width: '100%', padding: '0.8rem', fontSize: '0.6rem' }}
         >
           Add to Bag
         </button>
      </div>
    </div>
    <div className="card-info" onClick={() => onClick(product)}>
      <div>
        <h3 className="card-title">{product.name}</h3>
        <p className="text-meta" style={{ fontSize: '0.5rem', marginTop: '0.2rem', color: '#888' }}>{product.category}</p>
      </div>
      <p className="card-price">₦{product.price.toLocaleString()}</p>
    </div>
  </motion.div>
);

const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleCheckout = () => {
    let message = "Hello Tabirae, I'd like to order the following:\n\n";
    cart.forEach(item => {
      message += `- ${item.name} x${item.quantity} (₦${(item.price * item.quantity).toLocaleString()})\n`;
    });
    message += `\nTotal: ₦${total.toLocaleString()}\n\nIs this available?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-mask"
          onClick={onClose}
          style={{ justifyContent: 'flex-end', padding: 0 }}
        >
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-drawer"
            onClick={e => e.stopPropagation()}
            style={{ 
              background: 'white', 
              width: '100%', 
              maxWidth: '450px', 
              height: '100vh', 
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem' }}>Your Bag</h2>
              <button onClick={onClose}><X size={24} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <p className="text-secondary italic">Your bag is currently empty.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '100px', background: '#f4f4f4' }}>
                        <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.name}</h4>
                        <p style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem' }}>₦{item.price.toLocaleString()}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ opacity: 0.5 }}><Minus size={14} /></button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ opacity: 0.5 }}><Plus size={14} /></button>
                          <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', opacity: 0.2 }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <span className="text-meta" style={{ color: '#111' }}>Total Investment</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>₦{total.toLocaleString()}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="btn btn-black" 
                style={{ width: '100%', gap: '1rem', padding: '1.5rem', opacity: cart.length === 0 ? 0.2 : 1 }}
              >
                <MessageCircle size={18} /> Checkout on WhatsApp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductModal = ({ product, onClose, onAddToBag }) => {
  if (!product) return null;

  const handleBuy = () => {
    const message = `Hello Tabirae, I'm interested in the ${product.name} (₦${product.price.toLocaleString()}). Is it available?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="modal-mask" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="modal-wrap"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'white', borderRadius: '50%', padding: '0.5rem', border: '1px solid #eee' }}>
          <X size={20} />
        </button>
        
        <div className="modal-side-img">
          <img src={product.image_url} alt={product.name} />
        </div>
        
        <div className="modal-side-content">
          <p className="text-meta mb-2">Authenticated Luxury</p>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{product.name}</h2>
          
          <div className="mb-8" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>₦{product.price.toLocaleString()}</span>
            <div style={{ width: '1px', height: '1.5rem', background: '#eee' }} />
            <span className="text-meta" style={{ letterSpacing: '0.1em', color: '#111' }}>{product.category}</span>
          </div>

          <p className="text-secondary mb-12" style={{ lineHeight: 1.8, fontSize: '1rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => onAddToBag(product)} className="btn btn-outline" style={{ flex: 1, padding: '1.2rem' }}>
              Add to Bag
            </button>
            <button onClick={handleBuy} className="btn btn-black" style={{ flex: 1.5, gap: '1rem', padding: '1.2rem' }}>
              <MessageCircle size={18} /> Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const [filter, setFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filtered = filter === 'All' ? allProducts : allProducts.filter(p => p.category === filter);

  const handleFilterChange = (cat) => {
    setFilter(cat);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const addToBag = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="app">
      <CustomCursor />
      <Header 
        onFilterChange={handleFilterChange} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <Hero />

      <main className="container section-padding" id="collection">
        <div className="collection-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '4rem', marginBottom: '2rem' }}
          >
            The Boutique
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="filters" 
            style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}
          >
            {['All', ...new Set(allProducts.map(p => p.category))].map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className="text-meta"
                style={{ 
                  color: filter === cat ? '#111' : '#aaa', 
                  borderBottom: filter === cat ? '2px solid #111' : '2px solid transparent',
                  paddingBottom: '0.5rem',
                  letterSpacing: '0.2em'
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="product-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={i} 
                onClick={setSelectedProduct}
                onAddToBag={addToBag}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Craftsmanship Section */}
      <section className="section-padding" style={{ background: '#000', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-meta mb-8" 
            style={{ color: '#B8860B' }}
          >
            The Art of the Knit
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '4rem', marginBottom: '4rem' }}
          >
             World-Class <br /> <span className="italic" style={{ color: '#B8860B' }}>Craftsmanship</span>
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Heritage Silk</h3>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.8 }}>Our scarves are woven from the finest ethical silk, featuring hand-drawn paisley patterns that celebrate global heritage.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Premium Knit</h3>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.8 }}>Experience the texture of our signature vertical stripe polos. Lightweight, breathable, and designed for a perfect silhouette.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Global Vision</h3>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.8 }}>From our design atelier to your wardrobe, we represent the peak of contemporary elegance for the modern pioneer.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="section-padding" style={{ background: '#fafafa', borderTop: '1px solid #eee' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>TABIRAE</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                A premier global fashion house dedicated to the pursuit of excellence in craftsmanship and contemporary style.
              </p>
            </div>
            <div>
              <h4 className="text-meta mb-4" style={{ color: '#111' }}>Atelier</h4>
              <ul className="text-secondary" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => handleFilterChange('All')}>New Arrivals</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleFilterChange('Shirts')}>Premium Shirts</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleFilterChange('Scarves')}>Silk Scarves</li>
              </ul>
            </div>
            <div>
              <h4 className="text-meta mb-4" style={{ color: '#111' }}>Support</h4>
              <ul className="text-secondary" style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank">Contact WhatsApp</a></li>
                <li>Care Guide</li>
                <li>About Us</li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
            <p className="text-meta" style={{ fontSize: '0.55rem', opacity: 0.3 }}>&copy; 2026 Tabirae Stores International</p>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <a href={INSTAGRAM_URL} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
                <Globe size={14} /> <span className="text-meta" style={{ fontSize: '0.55rem' }}>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToBag={addToBag}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
