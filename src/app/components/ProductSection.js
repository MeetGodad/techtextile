import { useMemo, useState, useRef } from "react";
import Link from "next/link";

export default function ProductSection({
  shoppingCart = "/shopping-cart.png",
  addToCartBackgroundColor = "black",
  frameDivBackgroundColor  = "#fcf1f1",
  propWidth = "100%",
  propFlex = "1",
  product,
  name,
  price,
  image,
  onAddToCart,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});
  const productRef = useRef(null);
  const imageUrls = image.split(',');
  const firstImageUrl = imageUrls[0];

  const frameDivStyle = useMemo(() => {
    return {
      backgroundColor: addToCartBackgroundColor,
    };
  }, [addToCartBackgroundColor]);

  const rectangleDivStyle = useMemo(() => {
    return {
      backgroundColor: frameDivBackgroundColor,
    };
  }, [frameDivBackgroundColor]);

  const addToCartStyle = useMemo(() => {
    return {
      width: propWidth,
      flex: propFlex,
    };
  }, [propWidth, propFlex]);

  const addToCartHandler = () => {
    const cartIcon = document.querySelector('#cart-icon');
    const productImage = productRef.current;

    if (productImage && cartIcon) {
      const productRect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const flyX = cartRect.left - productRect.left + "px";
      const flyY = cartRect.top - productRect.top + "px";

      setFlyStyle({
        '--fly-x': flyX,
        '--fly-y': flyY,
      });

      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
        onAddToCart(product);
      }, 600);
    }
  };

  return (
    <div 
      className="relative mb-0 w-[243px] flex flex-col items-center justify-start p-4 border border-black rounded-lg bg-white">
      <Link 
                href={{ 
                  pathname: '/Productdetail', 
                  query: {productId : product.product_id} 
                }} 
                as={`/Productdetail?productId=${product.product_id}`}>
      <div className="flex flex-col w-full h-48 items-center justify-center bg-lavenderblush-100" style={rectangleDivStyle}>
        <img
          ref={productRef}
          className={`h-40 w-48 object-cover ${isAnimating ? 'animate-fly' : ''}`}
          style={flyStyle}
          loading="lazy"
          alt={name}
          src={firstImageUrl}/> 
      </div>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCartHandler();
        }}
        className="flex items-center justify-center py-2 px-4 w-full bg-black text-white rounded-md hover:bg-darkslategray transition"
        style={addToCartStyle}>
        <img
          className="w-6 h-6 mr-2"
          alt="cart"
          src="/Images/white_cart.png"/>
        <span className="text-base font-bold">Add to cart</span>
      </button>
      <h2 className="text-lg font-semibold text-black text-center">{name}</h2>
      <div className="text-center text-lg font-medium text-gray-800">${price}</div>
    </div>
  );
}
