import { useState } from 'react';

export default function Ratings({ productId,userId, onClose }) {
  const [headline, setHeadline] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // For hover effect
  const  handleReviewSubmit = async () => {

    const response = await fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        feedback_heading: headline,
        feedback_text: review,
        feedback_rating: rating,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok){
      console.log("Error in Adding Review")
    } else if (response.ok) {
      console.log("Review Added Successfully")
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
      <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Review The Product</h2>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Headline</label>
          <input
            type="text"
            className="w-full border-gray-300 rounded-md p-2"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Review</label>
          <textarea
            className="w-full border-gray-300 rounded-md p-2"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`cursor-pointer text-4xl ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}>
                ★
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white rounded-md py-2 px-4 mr-2"
            onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white rounded-md py-2 px-4"
            onClick={handleReviewSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
