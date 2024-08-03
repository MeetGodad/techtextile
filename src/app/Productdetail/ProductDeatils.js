//https://chatgpt.com/c/1594564d-c434-4e44-8cd9-e0efa34f4736 apart from the color variants i have taken a help from this webiste to make the code perfect and working
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import Ratings from '../components/Ratings';
import { FiCopy } from 'react-icons/fi';
import { TbWorldShare } from "react-icons/tb";
import { useRouter } from 'next/navigation';

import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton
} from 'next-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import StarRating from '../components/starRating';

export default function ProductDetail({ productId }) {
  const { user } = useUserAuth();
  const [isShareIconsVisible, setIsShareIconsVisible] = useState(false);
  const [product, setProduct] = useState(null);
  const [productUrl, setProductUrl] = useState('');
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
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [availableQuantities, setAvailableQuantities] = useState([]);
  const [Message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Function to hide share icons when clicking outside
    const handleClickOutside = (event) => {
      if (event.target.closest('.share-button, .share-dropdown')) return;
      setIsShareIconsVisible(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  // Function to toggle share icons visibility
  const toggleShareIcons = () => {
    setIsShareDropdownOpen(!isShareDropdownOpen);
    setIsShareIconsVisible((prev) => !prev);
  };
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
          setAverageRating(parseFloat(data[0].average_rating) || 0);
          setProductUrl(`${window.location.origin}/Productdetail?productId=${currentProductId}`);
        } else {
          setError('Error fetching product details');
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
  
  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = getSelectedVariantQuantity();
    
    if (newQuantity > maxQuantity) {
      setQuantity(maxQuantity);
    } else if (newQuantity < 1) {
      setMessage(`Quantity cannot be less than 1.`);
      setQuantity(1);
    } else {
      setMessage('');
      setQuantity(newQuantity);
    }
  };
  const handleQuantityIncrease = () => {
    const maxQuantity = getSelectedVariantQuantity();
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
      setMessage('');
    } else {
      setMessage(`Product quantity cannot exceed ${maxQuantity}.`);
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
useEffect(() => {
  if (typeof window !== 'undefined') {
    setProductUrl(`${window.location.origin}/Productdetail?productId=${currentProductId}`);
  }
}, [currentProductId]);
useEffect(() => {
  if (copied) {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 3000); // Reset after 3 seconds
    return () => clearTimeout(timer);
  }
}, [copied]);

  if (loading) return <Loder />;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const handlePrevImage = () => {
    if (product) {
      const imageUrls = product.image_url.split(',');
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
      setCurrentImage(imageUrls[(currentImageIndex - 1 + imageUrls.length) % imageUrls.length].trim());
    }
  };
  const handleReviewAdd = () => {
    if (!user || !user.uid) {
      alert('Please sign in to add a review.');
      return;
    }
    setIsRatingsOpen(true);
  };
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };
  const handleCloseRatings = () => {
    setIsRatingsOpen(false);
  };
  const handleViewDetails = (productId) => {
    setCurrentProductId(productId);
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
    <main className="pt-20">
      <div className="w-full min-h-screen text-black bg-white p-4 md:p-8 overflow-x-auto overflow-hidden">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 flex flex-col items-start relative">
              <div className="flex flex-col items-start">
                <div className="border-2 border-gray-500 w-[650px] h-96 flex items-center justify-center p-2 rounded-lg overflow-hidden mb-4">
                  <img
                    className="w-[600px] h-[365px] object-cover object-center transition-opacity duration-300"
                    style={{ borderRadius: '20px' }}
                    src={currentImage}
                    alt={`${product.product_name} current`}
                  />
                </div>
                <div className="flex flex-row items-center relative mb-4 md:mb-0">
                  <button
                    onClick={handlePrevImage}
                    className="flex bg-black hover:bg-gray-300 p-2 rounded-full transition-colors duration-300 mb-2 md:mb-0"
                    style={{ top: `${Math.max(0, (imageUrls.length * 20) / 2 - 20)}px` }}>
                    <span className="transform rotate-180 text-white text-2xl group-hover:animate-bounce">➤</span>
                  </button>
                  <div className="flex flex-row items-center mt-2 p-2 rounded-lg overflow-x-auto scrollbar-hide">
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        className={`w-16 h-16 mb-0 mr-2 cursor-pointer transition-transform duration-300 hover:scale-110 ${currentImage === url.trim() ? 'border-2 border-black' : ''}`}
                        style={{ borderRadius: '20px' }}
                        src={url.trim()}
                        alt={`${product.product_name} thumbnail ${index + 1}`}
                        onClick={() => setCurrentImage(url.trim())}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNextImage}
                    className="flex bg-black hover:bg-gray-300 p-2 rounded-full transition-colors duration-300 mt-2 md:mt-0"
                    style={{ bottom: `${Math.max(0, (imageUrls.length * 20) / 2 - 20)}px` }}>
                    <span className="text-white text-2xl group-hover:animate-bounce">➤</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">{product.product_name}</h1>
                <div 
                  className="relative"
                  onMouseEnter={() => setIsHovering(true)}>
                  <button 
                    className="share-button p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => setIsHovering(!isHovering)}>
                    <TbWorldShare size={32} className="text-gray-600 hover:text-gray-800 transition-colors duration-300" />
                  </button>
                  {isHovering && (
                    <div className="absolute top-full right-0 mt-1 z-10">
                      <div className="bg-white shadow-lg rounded-lg p-3 flex flex-col items-center space-y-2 border border-gray-200">
                        <FacebookShareButton url={productUrl} className="transition-transform duration-300 hover:scale-110">
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={productUrl} className="transition-transform duration-300 hover:scale-110">
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={productUrl} className="transition-transform duration-300 hover:scale-110">
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <CopyToClipboard text={productUrl} onCopy={() => setCopied(true)}>
                          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                            <FiCopy size={20} color={copied ? 'green' : 'black'} />
                          </button>
                        </CopyToClipboard>
                        {copied && (
                          <span className="text-sm text-green-600 font-medium animate-fade-in-down">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <StarRating rating={averageRating} />
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 my-4">${product.price}</h2>
              <div className="flex space-x-5">
                <div className="flex-grow">
                  <div className="mb-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold mb-2">Color:</h3>
                      <div className="flex space-x-2 ml-4">
                        {uniqueColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-6 h-6 rounded-full transition-transform duration-300 hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                    {product.product_type === 'yarn' && (
                    <div className="flex-col">
                      <h3 className="font-semibold mb-2">Denier:</h3>
                      <div className="flex space-x-2">
                        {availableDeniers.slice(0, 5).map(denier => (
                          <button
                            key={denier}
                            onClick={() => handleDenierSelection(denier)}
                            className={`px-4 py-2 border rounded transition-transform duration-300 ${selectedDenier === denier ? 'bg-black text-white border-white' : 'bg-transparent text-black border-black hover:bg-black hover:text-white'}`}
                            >
                            {denier}
                          </button>
                        ))}
                      </div>
                    </div>
                    )}
                    <div>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                          {/* Quantity Label and Input */}
                          <label htmlFor="quantity" className="font-semibold mr-1">Quantity:</label>
                          <div className="relative">
                            <input
                              type="number"
                              id="quantity"
                              className="bg-white border-2 border-gray-300 rounded-full py-2 px-12 text-gray-800 text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none fixed-width"
                              min="1"
                              max={getSelectedVariantQuantity()}
                              value={quantity}
                              onChange={handleQuantityChange}
                              disabled={!selectedColor || parseInt(getSelectedVariantQuantity()) === 0}/>
                            <button
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                              onClick={() => handleQuantityChange(quantity - 1)}
                              disabled={quantity <= 1}>
                              <span className="text-xl font-semibold">−</span>
                            </button>
                            <button
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                              onClick={() => handleQuantityIncrease()}
                              disabled={!selectedColor || parseInt(getSelectedVariantQuantity()) === 0}
                            >
                              <span className="text-xl font-semibold">+</span>
                            </button>
                          </div>
                          {Message && <p className="text-red-600">{Message}</p>} 
                          {/* Add to Cart and Add Review Buttons */}
                          <div className="flex flex-col space-y-4 ml-60"> {/* Adjust ml-8 to increase or decrease spacing */}
                            <button
                              className="px-20 py-2 bg-black rounded-full text-white hover:bg-gray-800 transition-colors duration-300 ml-10"
                              onClick={() => addToCart(product)}
                            >
                              Add to cart
                            </button>
                            <button
                              className="px-20 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-300 ml-10"
                              onClick={handleReviewAdd}
                            >
                              Add Review
                            </button>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    {product.yarn_material && (
                      <p className="text-lg mt-1"><strong>Yarn Material: </strong> {product.yarn_material}</p>
                    )}
                    {product.fabric_print_tech && (
                      <p className="text-lg mt-1"> <strong>Fabric Print Technology: </strong>  {product.fabric_print_tech}</p>
                    )}
                    {product.fabric_material && (
                      <p className="text-lg mt-1"> <strong>Fabric Material: </strong>  {product.fabric_material}</p>
                    )}
                </div>
              </div>
              </div>
            </div> 
                  {/* Seller Details and Description Sections */}
              <div className="flex mt-16">
                <div className="w-1/2 pr-4">
                  <h2 className="text-xl font-bold mb-2">Seller Details</h2>
                  <p className="text-lg mb-2"><strong>Seller Company:</strong> {product.seller_business_name}</p>
                  <p className="text-lg mb-2"><strong>Phone:</strong> {product.seller_phone_num}</p>
                  <p className="text-lg mb-2"><strong>Address:</strong> {`${product.seller_address.street}, ${product.seller_address.city}, ${product.seller_address.state}, ${product.seller_address.postal_code}`}</p>
                </div>
                <div className="border-l border-black h-auto mx-4"></div> {/* Thin black line */}
                <div className="w-1/2 pl-4">
                  <h2 className="text-xl font-bold mb-2">Description</h2>
                  <p className="text-lg">{product.product_description}</p>
                </div>
              </div>
              {/* Related Products Section */}
              <h2 className="text-3xl text-center italic font-bold mb-8">Related Products</h2>
                <div className="mt-16 relative">
                  <div className="flex overflow-x-auto scroll-smooth scrollbar-hide space-x-6 pb-4">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.product_id} className="flex-none w-64 border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={relatedProduct.image_url.split(',')[0].trim()}
                          alt={relatedProduct.product_name}
                          className="w-full h-48 object-cover mb-4 rounded-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2 truncate">{relatedProduct.product_name}</h3>
                        <p className="text-gray-700 mb-4">${relatedProduct.price}</p>
                        <button
                          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
                          onClick={() => handleViewDetails(relatedProduct.related_product_id)}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {isRatingsOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={handleCloseRatings}>
                        &times;
                      </button>
                      <Ratings productId={productId} userId={user.uid} productName={product.product_name} onClose={handleCloseRatings}  />
                    </div>
                  </div>
                )}
                {/* Display reviews */}
                  <div className="mt-16">
                  <h2 className="text-3xl font-bold mb-8">Reviews</h2>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 mb-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">{review.feedback_heading}</h3>
                          <div className="text-yellow-400">
                            {'★'.repeat(review.feedback_rating)}{'☆'.repeat(5 - review.feedback_rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.feedback_text}</p>
                        <p className="text-gray-500 text-sm">Reviewed by: {review.first_name} {review.last_name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 italic">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
        </div>
      </div>
    </main>
  );
}