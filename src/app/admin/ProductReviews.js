// Refrence - https://chatgpt.com/c/b17460af-4df2-4623-91ff-d830dca4d51c
"use client";
import { useEffect, useState } from 'react';

const ProductReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`/api/productreviewforseller/${userId}`)
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [userId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          fill={i < rating ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`w-6 h-6 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          <path
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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Product Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex space-x-6">
              <img src={review.product_image.split(',')[0]} alt={review.product_name} className="w-80 h-80 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{review.product_name}</h2>
                  <p className="text-gray-600">Price: ${review.product_price}</p>
                  <p className="text-gray-500">Type: {review.product_type}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Buyer Info</h3>
                  <p className="text-gray-800">{review.buyer_name}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Review</h3>
                  <p className="text-gray-600">{review.feedback_heading}</p>
                  <p className="text-gray-500">{review.feedback_text}</p>
                  <div className="flex mt-2">{renderStars(review.feedback_rating)}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No reviews available.</p>
      )}
    </div>
  );
};

export default ProductReviews;
