import { useMemo } from "react";

const FrameComponent = ({
  shoppingCart,
  addToCartBackgroundColor,
  frameDivBackgroundColor,
  propWidth,
  propFlex,
  product,
  name,
  price,
  image,
  onAddToCart,
}) => {
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
    onAddToCart(product);
  };

  return (
    <div className="h-72 w-[243px] flex flex-col items-start justify-start gap-[12px] text-left text-base text-black font-title-16px-medium">
      <div className="self-stretch flex-1 flex flex-col items-end justify-start">
        <div
          className="self-stretch flex-1 rounded-mini bg-lavenderblush-100 flex flex-row items-start justify-start pt-[22.2px] px-8 pb-[22px]"
          style={frameDivStyle}
        >
          <img
            className="h-[119.5px] flex-1 relative rounded-mini max-w-full overflow-hidden object-cover z-[1]"
            loading="lazy"
            alt={name}
            src={image}
          />
        </div>
        <button
          onClick={addToCartHandler}
          className="[border:none] cursor-pointer py-1.5 px-[45px] bg-black self-stretch rounded-t-none rounded-b-mini flex flex-row items-start justify-start gap-[9px] whitespace-nowrap z-[1] mt-[-34px] hover:bg-darkslategray"
          style={addToCartStyle}
        >
          <img
            className="h-[26px] w-[26px] relative object-cover min-h-[26px] z-[2]"
            alt="Shopping Cart"
            src={shoppingCart}
          />
          <i className="w-[108px] relative text-xl inline-block font-bold font-inria-sans text-white text-center shrink-0 min-w-[108px] z-[2]">
            Add to cart
          </i>
        </button>
      </div>
      <div className="flex-1 min-w-[calc(25%-32px)] max-w-[calc(25%-32px)] p-4 box-border" style={{ backgroundColor: '#fcf1f1' }}>
        <h2 className="mt-2 text-lg font-semibold">{name}</h2>
        <div className="mt-2 p-2" style={{ backgroundColor: '#fcf1f1' }}>
          ${price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;

