import { useMemo, useState, useRef } from "react";
import Link from "next/link";

export default function ProductSection({
  addToCartBackgroundColor = "black",
  frameDivBackgroundColor  = "#fcf1f1",
  propWidth = "100%",
  propFlex = "1",
  product,
  name,
  price,
  image,
  averageRating,
  onAddToCart,
}) {
  const productRef = useRef(null);
  const imageUrls = image.split(',');
  const firstImageUrl = imageUrls[0];
  const renderStars = () => {
    return (
      <div className="inline-flex items-center bg-gray-200 rounded-md px-2 py-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xl ${
              i <= averageRating ? 'text-yellow-400' : 'text-black'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>   
      <Link 
        href={{ 
          pathname: '/Productdetail', 
          query: { productId: product.product_id } 
        }} 
        as={`/Productdetail?productId=${product.product_id}`}>
      <div className="border p-4 rounded-lg relative " style={{ height: '300px' }}>
        <img
          ref={productRef}
          className={`w-full h-48 object-cover mb-2 rounded-lg `}
          alt={name}
          src={firstImageUrl}/> 
        <div className="overflow-hidden ">
          <h2 className="text-2xl ml-2 font-bold truncate text-black">{name}</h2>
          <div className="text-red-600 font-semibold ml-2">${price}</div>
        </div>
        <div className="absolute bottom-2 right-3">
          {renderStars()}
        </div>
      </div>
      </Link>
    </div>
  );
}