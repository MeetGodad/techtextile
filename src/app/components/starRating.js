import React from "react";
export default function StarRating({ rating }) {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);
  
    return (
      <div className="inline-flex items-center">
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="text-xl text-yellow-400">★</span>
        ))}
        {halfStar && <span className="text-xl text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-xl text-black">★</span>
        ))}
      </div>
    );
  }
  