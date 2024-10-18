import React, { useState } from 'react';
import { Product } from '../types';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CartProps {
  cart: Product[];
  removeFromCart: (productId: number) => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message || 'An error occurred');
        setIsProcessing(false);
      } else {
        // Here you would typically send the paymentMethod.id to your server
        // to complete the payment. For this example, we'll just simulate a successful payment.
        console.log('PaymentMethod:', paymentMethod);
        setPaymentSuccess(true);
        setIsProcessing(false);
      }
    }
  };

  if (paymentSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
        <p>Thank you for your purchase. Your order has been processed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2">{item.quantity || 1}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t pt-4">
            <p className="text-xl font-semibold mb-4">Total: ${total.toFixed(2)}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
              {paymentError && <div className="text-red-500 mb-4">{paymentError}</div>}
              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;