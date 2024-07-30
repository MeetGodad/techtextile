import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import StarRating from "./starRating";
import Image from "next/image";

export default function ProductSection({
  product,
  name,
  price,
  image,
  averageRating,
}) {

  const imageUrls = image.split(',');
  const firstImageUrl = imageUrls[0];
  return (
    <div className="max-w-sm">
    <Link href={{ pathname: '/Productdetail', query: { productId: product.product_id } }} as={`/Productdetail?productId=${product.product_id}`}>
      <div className="border p-4 rounded-lg relative" style={{ height: '300px', width: '100%' }}>
        <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
          <Image
            className="object-cover"
            alt={name}
            src={firstImageUrl}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="overflow-hidden">
          <h2 className="text-2xl ml-2 font-bold truncate text-black">{name}</h2>
          <div className="text-red-600 font-semibold ml-2">${price}</div>
        </div>
        <div className="absolute bottom-2 right-3">
          <StarRating rating={averageRating} />
        </div>
      </div>
    </Link>
  </div>
  );
}