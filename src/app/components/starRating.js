//Perplexity Ai
import React from 'react';

const StarRating = ({ rating }) => {
  // Ensure rating is a number
  const validRating = isNaN(rating) ? 0 : Math.max(0, Math.min(5, rating));
  const filledStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;

  return (
    <div className="inline-flex items-center">
      {[...Array(filledStars)].map((_, i) => (
        <span key={`filled-${i}`} className="text-xl text-yellow-400">★</span>
      ))}
      {halfStar && <span className="text-xl text-yellow-400">☆</span>}
      {[...Array(5 - filledStars - (halfStar ? 1 : 0))].map((_, i) => (
        <span key={`empty-${i}`} className="text-xl text-gray-300">☆</span>
      ))}
    </div>
  );
};

export default StarRating;
