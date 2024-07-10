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
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedDenier, setSelectedDenier] = useState(null);
  const [availableDeniers, setAvailableDeniers] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
  }, [currentProductId, user]);

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

useEffect(() => {
    if (selectedColor && product) {
      const deniers = product.variants
        .filter(v => v.color.split(': ')[1] === selectedColor)
        .map(v => v.denier.split(': ')[1]);
      setAvailableDeniers(deniers);
    } else {
      setAvailableDeniers([]);
    }
    setSelectedDenier(null);
    setSelectedVariantId(null);
  }, [selectedColor, product]);

useEffect(() => {
    if (selectedColor && selectedDenier && product) {
      const variant = product.variants.find(
        v => v.color.split(': ')[1] === selectedColor && v.denier.split(': ')[1] === selectedDenier
      );
      setSelectedVariantId(variant ? variant.variant_id : null);
    } else {
      setSelectedVariantId(null);
    }
  }, [selectedColor, selectedDenier, product]);

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

  let variantId = null;
  
  switch (product.product_type) {
    case 'yarn':
      if (selectedColor && selectedDenier) {
        // Assuming selectedColor and selectedDenier have variant_id properties
        variantId = selectedDenier.variant_id;
      } else {
        alert('Please select both color and denier for yarn products.');
        return;
      }
      break;
    case 'fabric':
      if (selectedColor) {
        // Assuming selectedColor has variant_id property
        variantId = selectedColor.variant_id;
      } else {
        alert('Please select a color for fabric products.');
        return;
      }
      break;
    default:
      alert('Product type not supported.');
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
        variantId: variantId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const eventData = { productId: product.product_id, quantity: quantity };
    const event = new CustomEvent('cartUpdated', { detail: eventData });
    window.dispatchEvent(event);

    alert('Product added to cart successfully');
  } catch (error) {
    alert(error.message);
  }
};

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
    setSelectedDenier(null); // Reset selected denier when color changes
  };

  const handleDenierSelection = (denier) => {
    setSelectedDenier(denier);
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

  
  const uniqueColors = [...new Set(product.variants.map(v => v.color.split(': ')[1]))];

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
                  <p className="text-lg mb-2"><strong>Address:</strong> {`${product.seller_address.street}, ${product.seller_address.city}, ${product.seller_address.state}, ${product.seller_address.postal_code}`}</p>
                </div>
              )}
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h1 className="text-3xl font-semibold mb-4">{product.product_name}</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">${product.price}</h2>
            <div className="mb-4">
                        <h3 className="font-semibold mb-2">Color:</h3>
                        <div className="flex space-x-2">
                          {uniqueColors.map(color => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`w-8 h-8 rounded-full ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
            {product.product_type === 'yarn' && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Denier:</h3>
                <select
                  value={selectedDenier || ''}
                  onChange={(e) => setSelectedDenier(e.target.value)}
                  disabled={!selectedColor}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Denier</option>
                  {availableDeniers.map(denier => (
                    <option key={denier} value={denier}>{denier}</option>
                  ))}
                </select>
              </div>)}
            <div className="mt-4">
              <label htmlFor="quantity" className="block font-medium mb-2">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={addToCart}
              className="mt-4 w-full px-4 py-2 bg-black text-white font-semibold rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.product_id} className="p-4 border border-gray-300 rounded-md">
                  <img
                    src={relatedProduct.image_url.split(',')[0].trim()}
                    alt={relatedProduct.product_name}
                    className="w-full h-48 object-cover object-center mb-4"
                  />
                  <h4 className="font-medium">{relatedProduct.product_name}</h4>
                  <p className="text-gray-600">${relatedProduct.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
