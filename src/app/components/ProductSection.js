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

 /* const addToCartHandler = () => {
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
  };*/

  return (
    <div>   
      <Link 
        href={{ 
          pathname: '/Productdetail', 
          query: { productId: product.product_id } 
        }} 
        as={`/Productdetail?productId=${product.product_id}`}>
      <div className="border p-4 rounded-lg">
        <img
          ref={productRef}
          className={`w-full h-48 object-cover mb-2 rounded-lg ${isAnimating ? 'animate-fly' : ''}`}
          style={flyStyle}
          alt={name}
          src={firstImageUrl}/> 
        <div className="overflow-hidden ">
          <h2 className="text-2xl text-black ml-2 font-bold truncate">{name}</h2>
          <div className="text-red-600 font-semibold ml-2">${price}</div>
        </div>
        <div className="absolute bottom-2 right-3">
          {renderStars()}
        </div>
          
        <h2 className=" text-2xl ml-2 text-black font-bold">{name}</h2>
        <div className="text-red-600 font-semibold ml-2 mb-2">${price}</div>
      </div>
      </Link>





    </div>
  );
}
      /*<button
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
      </button>*/