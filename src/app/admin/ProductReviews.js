"use client";
import { useEffect, useState } from 'react';

const ProductReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/productreviewforseller/${userId}`);
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`w-6 h-6 ${i < rating ? 'text-yellow-500' : 'text-gray-300'} transition-colors duration-300`}
        >
          <defs>
            <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FFAA00', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            fill={i < rating ? 'url(#gradient-gold)' : 'none'}
            stroke={i < rating ? 'url(#gradient-gold)' : 'currentColor'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.04 6.26a1 1 0 00.95.69h6.566c.969 0 1.372 1.24.588 1.81l-5.314 3.877a1 1 0 00-.364 1.118l2.04 6.26c.3.921-.755 1.688-1.54 1.118l-5.314-3.876a1 1 0 00-1.175 0l-5.314 3.876c-.784.57-1.84-.197-1.54-1.118l2.04-6.26a1 1 0 00-.364-1.118L2.85 11.686c-.784-.57-.381-1.81.588-1.81h6.566a1 1 0 00.95-.69l2.04-6.26z"
          />
        </svg>
      );
    }
    return stars;
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setCurrentPage(1);
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.feedback_rating === parseInt(filter);
  });

  const sortedReviews = filteredReviews.sort((a, b) => {
    if (sort === 'latest') {
      return new Date(b.review_date) - new Date(a.review_date);
    }
    if (sort === 'oldest') {
      return new Date(a.review_date) - new Date(b.review_date);
    }
    if (sort === 'highest') {
      return b.feedback_rating - a.feedback_rating;
    }
    return a.feedback_rating - b.feedback_rating;
  });

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Product Reviews</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div className="flex space-x-4">
              <select onChange={handleFilterChange} className="p-2 border rounded-lg font-bold">
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <select onChange={handleSortChange} className="p-2 border rounded-lg font-bold">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
          {currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <img 
                    src={review.product_image.split(',')[0]} 
                    alt={review.product_name} 
                    className="w-full md:w-48 h-auto object-contain rounded-lg mb-4 md:mb-0"
                  />
                  <div className="flex-1">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold">{review.product_name}</h2>
                      <p className="text-gray-600">Price: ${review.product_price}</p>
                      <p className="text-gray-500">Type: {review.product_type}</p>
                      <p className="text-gray-500">Reviewed on: {new Date(review.review_date).toLocaleDateString()}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Buyer Info</h3>
                      <p className="text-gray-800">{review.buyer_name}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Review</h3>
                      <p className="text-gray-600">{review.feedback_heading}</p>
                      <p className="text-gray-500">{review.feedback_text}</p>
                      <div className="flex mt-2">{renderStars(review.feedback_rating)}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">{review.product_description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reviews available.</p>
          )}
          {/* <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {[...Array(Math.ceil(sortedReviews.length / reviewsPerPage)).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  {number + 1}
                </button>
              ))}
            </nav>
          </div> */}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
