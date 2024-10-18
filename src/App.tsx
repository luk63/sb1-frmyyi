import React, { useState } from 'react';
import { ShoppingCart, Home } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { Product } from './types';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key_here');

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity && item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as Product[])
    );
  };

  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <Home className="mr-2" /> MyShop
            </h1>
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
            >
              <ShoppingCart className="mr-2" />
              Cart ({cartItemCount})
            </button>
          </div>
        </header>
        <main className="container mx-auto mt-8">
          {showCart ? (
            <Cart cart={cart} removeFromCart={removeFromCart} />
          ) : (
            <ProductList addToCart={addToCart} />
          )}
        </main>
      </div>
    </Elements>
  );
}

export default App;