//https://chatgpt.com/c/1594564d-c434-4e44-8cd9-e0efa34f4736 apart from teh color variants i have taken a help from this webiste to make the code perfect and working
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';

export default function ProductDetail({ productId }) {
  const { user } = useUserAuth();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(productId); // Add currentProductId state

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!currentProductId) return;
      try {
        const response = await fetch(`/api/products/${currentProductId}`);
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
  }, [currentProductId, user]); // Update dependencies to currentProductId

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      try {
        const response = await fetch(`/api/products?material=${product.fabric_material}`);
        const data = await response.json();
        if (response.ok) {
          setRelatedProducts(data);
        } else {
          console.error('Error fetching related products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [product]);

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
          quantity: quantity,
          variant: selectedVariant,
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

  const handleVariantSelection = (variantName, variantValue, variantId) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [variantName]: { value: variantValue, id: variantId },
    }));
    console.log(selectedVariant);
  };

  const handleNextImage = () => {
    if (product) {
      const imageUrls = product.image_url.split(',');
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      setCurrentImage(imageUrls[(currentImageIndex + 1) % imageUrls.length].trim());
    }
  };

  const handlePrevImage = () => {
    if (product) {
      const imageUrls = product.image_url.split(',');
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
      setCurrentImage(imageUrls[(currentImageIndex - 1 + imageUrls.length) % imageUrls.length].trim());
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
          <div className="md:w-1/2 flex flex-col items-start relative">
            <div className="flex flex-row items-start">
              <div className="flex flex-col items-center relative">
                <button
                  onClick={handlePrevImage}
                  className="flex bg-gray-200 p-2 rounded-full"
                  style={{ top: `${Math.max(0, (imageUrls.length * 20) / 2 - 20)}px` }}>
                  &uarr;
                </button>
                <div className="flex flex-col items-center mt-2 p-2 rounded-lg" style={{ borderRadius: '20px' }}>
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      className={`w-16 h-16 mb-2 cursor-pointer ${currentImage === url.trim() ? 'border-2 border-black' : ''}`}
                      style={{ borderRadius: '20px' }}
                      src={url.trim()}
                      alt={`${product.product_name} thumbnail ${index + 1}`}
                      onClick={() => setCurrentImage(url.trim())}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNextImage}
                  className="flex bg-gray-200 p-2 rounded-full"
                  style={{ bottom: `${Math.max(0, (imageUrls.length * 20) / 2 - 20)}px` }}>
                  &darr;
                </button>
              </div>
              <div className="border-2 border-gray-500 ml-10 w-full max-w-lg h-96 flex items-center justify-center p-2 rounded-lg" style={{ borderRadius: '20px' }}>
                <img
                  className="max-w-full h-full object-cover object-center"
                  style={{ borderRadius: '20px' }}
                  src={currentImage}
                  alt={`${product.product_name} current`}
                />
              </div>
            </div>
            {/* Display seller details in a dropdown */}
            <div className="mt-4 w-full">
              <button
                className="px-1 py-2 bg-white border-2 border-black text-black rounded-lg mb-2 ml-28 h-11 w-48"
                onClick={() => setShowSellerDetails(!showSellerDetails)}>
                Seller Details {showSellerDetails ? '▲' : '▼'}
              </button>
              {showSellerDetails && (
                <div className="p-4 border border-gray-300 rounded-lg ml-28">
                  <p className="text-lg mb-2"><strong>Seller Company:</strong> {product.seller_business_name}</p>
                  <p className="text-lg mb-2"><strong>Phone :</strong>{product.seller_phone_num}</p>
                  <p className="text-lg mb-2"><strong>
                    Address:</strong> {`${product.seller_address.street}, ${product.seller_address.city}, ${product.seller_address.state}, ${product.seller_address.postal_code}`}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-3xl font-semibold mb-4">{product.product_name}</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">${product.price}</h2>
            {Object.keys(product.variants).length > 0 && (
              <div>
                <div className="flex items-start">
                  <div className="flex-grow">
                    {Object.keys(product.variants).map((variantName, index) => (
                      <div key={index} className="mb-4">
                        <p className="font-medium text-xlg mb-2">{variantName.charAt(0).toUpperCase() + variantName.slice(1)}</p>
                        <div className="flex flex-wrap gap-4">
                          {product.variants[variantName].map((variant, variantIndex) => (
                            <div
                              key={variantIndex}
                              className={`cursor-pointer p-2 border rounded-md transition-colors duration-200 ease-in-out ${
                                selectedVariant[variantName]?.value === variant.variant_value
                                  ? 'bg-black text-white border-black ring-2 ring-white'
                                  : 'bg-white text-black border-gray-300'
                              }`}
                              style={
                                variantName === 'color'
                                  ? { backgroundColor: variant.variant_value, width: '60px', height: '60px' }
                                  : { padding: '10px 16px' }
                              }
                              onClick={() => handleVariantSelection(variantName, variant.variant_value, variant.variant_id)}>
                              {variantName === 'color' ? '' : variant.variant_value}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-4 flex flex-col">
                    <div className="flex items-center mb-4">
                      <label htmlFor="quantity" className="mr-2"><strong>Quantity:</strong></label>
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
                      onClick={() => addToCart(product)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            {/* Display additional product details */}
            {product.yarn_material && (
              <p className="text-lg mb-4"><strong>Yarn Material: </strong> {product.yarn_material}</p>
            )}
            {product.fabric_print_tech && (
              <p className="text-lg mb-4"> <strong>Fabric Print Technology: </strong>  {product.fabric_print_tech}</p>
            )}
            {product.fabric_material && (
              <p className="text-lg mb-4"> <strong>Fabric Material: </strong> {product.fabric_material}</p>
            )}
          </div>
        </div>
        {/* Related Products Section */}
        <div className="mt-8">
          <h2 className="w-auto text-2xl text-center relative text-inherit inline-block italic font-bold font-inherit shrink-0 ">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.product_id} className="border p-4 rounded-lg">
                <img
                  src={relatedProduct.image_url.split(',')[0].trim()}
                  alt={relatedProduct.product_name}
                  className="w-full h-48 object-cover mb-2 rounded-lg"
                />
                <h3 className="text-lg font-semibold">{relatedProduct.product_name}</h3>
                <p className="text-gray-700 mb-2">${relatedProduct.price}</p>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => {
                    // Update the currentProductId state to the related product's ID
                    setCurrentProductId(relatedProduct.product_id);
                  }}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
