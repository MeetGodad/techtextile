//https://chatgpt.com/c/1594564d-c434-4e44-8cd9-e0efa34f4736 apart from the color variants i have taken a help from this webiste to make the code perfect and working
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import Ratings from '../components/Ratings';
import { useRouter } from 'next/navigation';

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
  const [currentProductId, setCurrentProductId] = useState(productId);
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);
  const [reviews, setReviews] = useState([]); 
  const [availableQuantities, setAvailableQuantities] = useState([]);
  const [Message, setMessage] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  averageRating,

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!currentProductId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${currentProductId}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data[0]);
          setCurrentImage(data[0].image_url.split(',')[0].trim());
          setAverageRating(data[0].average_rating || 0); 
        } else {
          console.error('Error fetching product details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductReviews = async () => {
      if (!currentProductId) return;
      try {
        const response = await fetch(`/api/review?product_id=${currentProductId}`);
        const data = await response.json();
        if (response.ok) {
          setReviews(data);
        } else {
          console.error('Error fetching reviews:', data.message);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProductDetails();
    fetchProductReviews();
  }, [currentProductId]);

  const renderStars = () => {
    return (
      <div className="inline-flex items-center bg-gray-200 rounded-md px-2 py-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xl ${i <= averageRating ? 'text-yellow-400' : 'text-black'
            }`}
          >     
            ★
          </span>
        ))}
      </div>
    );
  };
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentProductId) return;
      try {
        const response = await fetch(`/api/products/relatedProduct/${currentProductId}`);
        const data = await response.json();
        if (response.ok) {
          setRelatedProducts(data);
        } else {
          console.error('Error fetching related products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };-

    fetchRelatedProducts();
  }, [currentProductId]);



useEffect(() => {
  if (selectedColor && product) {
    if (product.product_type === 'yarn') {
      const deniers = product.variants
        .filter(v => v.color.split(': ')[1] === selectedColor)
        .map(v => v.denier.split(': ')[1]);
      setAvailableDeniers(deniers);

      const quantities = product.variants
        .filter(v => v.color.split(': ')[1] === selectedColor)
        .map(v => ({ denier: v.denier.split(': ')[1], quantity: v.quantity }));
      setAvailableQuantities(quantities);
    } else if (product.product_type === 'fabric') {
      const quantities = product.variants
        .filter(v => v.color.split(': ')[1] === selectedColor)
        .map(v => ({ quantity: v.quantity }));
      setAvailableQuantities(quantities);
    }
  } else {
    setAvailableDeniers([]);
    setAvailableQuantities([]);
  }
  setSelectedDenier(null);
  setSelectedVariantId(null);
}, [selectedColor, product]);


useEffect(() => {
  if (product) {
    if (product.product_type === 'yarn' && selectedColor && selectedDenier) {
      const variant = product.variants.find(
        v => v.color.split(': ')[1] === selectedColor && v.denier.split(': ')[1] === selectedDenier
      );
      console.log('Yarn variant:', variant);
      setSelectedVariantId(variant ? variant.variant_id : null);
    } else if (product.product_type === 'fabric' && selectedColor) {
      const variant = product.variants.find(
        v => v.color.split(': ')[1] === selectedColor
      );
      setSelectedVariantId(variant ? variant.variant_id : null);
    } else {
      setSelectedVariantId(null);
    }
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
        variantId: selectedVariantId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const cartItem = await response.json();
    setCart([...cart, cartItem]);
    const eventData = { productId: product.product_id, quantity: quantity };
    const event = new CustomEvent('cartUpdated', { detail: eventData });
    window.dispatchEvent(event);

    } catch (error) {
    alert(error.message);
  }
};

 const handleQuantityChange = (event) => {
    const maxQuantity = getSelectedVariantQuantity();
    const newQuantity = parseInt(event.target.value);

    if (newQuantity > maxQuantity) {
      setMessage(`You can only select up to ${maxQuantity} units.`);
      setQuantity(maxQuantity);
    } else {
      setMessage('');
      setQuantity(newQuantity);
    }
  };
  

  const handleColorSelection = (color) => {
    setSelectedColor(color);
    setSelectedDenier(null); // Reset selected denier when color changes
  };

  const handleDenierSelection = (denier) => {
  setSelectedDenier(denier);
  const selectedVariant = availableQuantities.find(v => v.denier === denier);
  setSelectedVariantId(selectedVariant ? selectedVariant.variant_id : null);
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
  const handleReviewAdd = () => {
    setIsRatingsOpen(true);
  };

  const handleCloseRatings = () => {
    setIsRatingsOpen(false);
  };

  const handleViewDetails = (newProductId) => {
    setCurrentProductId(newProductId);
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
const getSelectedVariantQuantity = () => {
  if (product.product_type === 'yarn') {
    const selectedVariant = availableQuantities.find(v => v.denier === selectedDenier);
    return selectedVariant ? selectedVariant.quantity : null;
  } else if (product.product_type === 'fabric') {
    return availableQuantities.length > 0 ? availableQuantities[0].quantity : null;
  }
};


const uniqueColors = product.variants
  ? [...new Set(product.variants.map(v => v.color.split(': ')[1]))]
  : [];

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
                  className="w-screen h-[365px] object-cover object-center"
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
            {renderStars()}
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
          <div>
              {product.product_type === 'yarn' && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Denier:</h3>
                <select
                  value={selectedDenier || ''}
                  onChange={(e) => handleDenierSelection(e.target.value)}
                  disabled={!selectedColor}
                  className="w-full p-2 border rounded">
                  <option value="">Select Denier</option>
                  {availableDeniers.map(denier => (
                    <option key={denier} value={denier}>{denier}</option>
                  ))}
                </select>
                </div>)}
              {selectedDenier && product.product_type === 'yarn' && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Available Quantity:</h3>
          <p>
            {getSelectedVariantQuantity() || 'N/A'}
          </p>
        </div>
      )}

      {selectedColor && product.product_type === 'fabric' && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Available Quantity:</h3>
          <p>
            {getSelectedVariantQuantity() || 'N/A'}
          </p>
        </div>
      )}

      {selectedDenier && product.product_type === 'yarn' && getSelectedVariantQuantity() !== null && getSelectedVariantQuantity() <= 10 && (
        <div className="mb-4">
          <p className="text-red-600">Warning: Low quantity available!</p>
        </div>
      )}

      {selectedColor && product.product_type === 'fabric' && getSelectedVariantQuantity() !== null && getSelectedVariantQuantity() <= 10 && (
        <div className="mb-4">
          <p className="text-red-600">Warning: Low quantity available!</p>
        </div>
              )}
            </div>
                  <div className="ml-4 flex flex-col">
                    <div className="flex items-center mb-4">
                      <label htmlFor="quantity" className="mr-2"><strong>Quantity:</strong></label>
                      <input
                        type="number"
                        id="quantity"
                        className="border border-gray-300 rounded w-16"
                        min="1"
                        max={getSelectedVariantQuantity()}
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
              </div>
              <>{Message && <p className="text-red-600">{Message}</p>}</>
                    <button
                      className="px-4 py-2 bg-black text-white rounded-lg"
                      onClick={() => addToCart(product)}>
                      Add to cart
                    </button>
                    <button 
                      className="px-4 py-2 bg-black text-white rounded-lg mt-4"
                      onClick={handleReviewAdd}>
                      Add Review
                    </button>
                  </div>
                </div>
              </div>
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
        {/* Related Products Section */}
        <div className="mt-8">
          <h2 className="w-auto text-3xl text-center italic font-bold font-inherit mb-5">Related Products</h2>
          {/* Scroll Container */}
          <div className="relative flex items-center">
            {/* Left Arrow Placeholder */}
            <div className="absolute left-0 z-10 bg-gray-200 rounded-full cursor-pointer">
              {/* Implement arrow icon and functionality */}
            </div>
            {/* Products Grid */}
            <div className="flex overflow-x-auto scroll-smooth scrollbar-hide">
              <div className="grid grid-flow-col auto-cols-max gap-6">
                {console.log(relatedProducts)}
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.product_id} className="border p-4 rounded-lg">
                    {console.log(relatedProduct.related_product_id)}
                    <img
                      src={relatedProduct.image_url.split(',')[0].trim()}
                      alt={relatedProduct.product_name}
                      className="w-80 h-48 object-cover mb-2 rounded-lg"
                    />
                    <h3 className="text-lg font-semibold w-80">{relatedProduct.product_name}</h3>
                    <p className="text-gray-700 mb-2">${relatedProduct.price}</p>
                    <button
                      className="px-4 py-2 bg-black text-white rounded-lg"
                      onClick={() => handleViewDetails(relatedProduct.related_product_id)}>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Arrow Placeholder */}
            <div className="absolute right-0 z-10 bg-gray-200 rounded-full cursor-pointer">
              {/* Implement arrow icon and functionality */}
            </div>
          </div>
        </div>
      {isRatingsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
            <button
              onClick={addToCart}
              className="mt-4 w-full px-4 py-2 bg-black text-white font-semibold rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        </div>)}
      </div>
  );
}
