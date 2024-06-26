import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';

export default function ProductDetail({ productId }) {
  const { user } = useUserAuth();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data[0]);
          setCurrentImage(data[0].image_url.split(',')[0].trim());
        } else {
          console.error('Error fetching product details:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const addToCart = async () => {
    if (!user) {
      alert('Please sign up or log in first.');
      return;
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          productId: product.product_id,
          quantity: quantity, // Include quantity in the request body
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const updatedCart = await response.json();

      const index = cart.findIndex((item) => item.product_id === updatedCart.product_id);
      if (index !== -1) {
        cart[index] = updatedCart;
      } else {
        cart.push(updatedCart);
      }

      setCart([...cart]);

      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loder />
      </div>
    );
  }

  if (!product) {
    return <div className="w-full min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const imageUrls = product.image_url.split(',');

  return (
    <div className="w-full min-h-screen text-black bg-white p-8 overflow-x-auto overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 flex flex-row items-start">
            <div className="flex flex-col items-center mr-4">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  className={`w-16 h-16 mb-2 cursor-pointer ${currentImage === url.trim() ? 'border-2 border-black' : ''}`}
                  src={url.trim()}
                  alt={`${product.product_name} thumbnail ${index + 1}`}
                  onClick={() => setCurrentImage(url.trim())}
                />
              ))}
            </div>
            <div className="border-2 border-gray-500 w-full max-w-lg h-96 flex items-center justify-center p-2">
              <img
                className="max-w-full h-full object-cover object-center"
                src={currentImage}
                alt={`${product.product_name} current`}
              />
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-3xl font-semibold mb-4">{product.product_name}</h1>
            <p className="text-lg mb-4">{product.product_description}</p>
            <p className="text-2xl font-semibold mb-4">${product.price}</p>
            

            <div className="mb-4">
              <label htmlFor="quantity" className="mr-2">Quantity:</label>
              <input
                type="number"
                id="quantity"
                className="border border-gray-300 rounded w-16"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <button
              className="px-4 py-2 bg-black text-white rounded-lg"
              onClick={() => addToCart(product)}
            >
              Add to cart
            </button>
                        {/* Display additional product details */}
                        {product.variants && (
              <p className="text-lg mb-4">Variants: {product.variants}</p>
            )}
            {product.yarn_material && (
              <p className="text-lg mb-4">Yarn Material: {product.yarn_material}</p>
            )}
            {product.fabric_print_tech && (
              <p className="text-lg mb-4">Fabric Print Technology: {product.fabric_print_tech}</p>
            )}
            {product.fabric_material && (
              <p className="text-lg mb-4">Fabric Material: {product.fabric_material}</p>
            )}

            {/* Display seller details */}
            <p className="text-lg mb-4">Seller Company: {product.seller_business_name}</p>

            <p className="text-lg mb-4">Address: {product.seller_business_address}</p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
