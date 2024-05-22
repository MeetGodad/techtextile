import { useMemo } from "react";

const FrameComponent = ({
  c2ST87460010820000Ligh,
  shoppingCart,
  addToCartBackgroundColor,
  frameDivBackgroundColor,
  propWidth,
  propFlex,
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

  return (
    <div className="h-72 w-[243px] flex flex-col items-start justify-start gap-[12px] text-left text-base text-black font-title-16px-medium">
      <div className="self-stretch flex-1 flex flex-col items-end justify-start">
        <div
          className="self-stretch flex-1 rounded-mini bg-lavenderblush-100 flex flex-row items-start justify-start pt-[22.2px] px-8 pb-[22px]"
          style={frameDivStyle}
        >
          <div
            className="h-[201px] w-[242px] relative rounded-mini bg-lavenderblush-100 hidden"
            style={rectangleDivStyle}
          />
          <img
            className="h-[119.5px] flex-1 relative rounded-mini max-w-full overflow-hidden object-cover z-[1]"
            loading="lazy"
            alt=""
            src={c2ST87460010820000Ligh}
          />
        </div>
        <button className="cursor-pointer [border:none] py-1.5 px-[45px] bg-black self-stretch rounded-t-none rounded-b-mini flex flex-row items-start justify-start gap-[9px] whitespace-nowrap z-[1] mt-[-34px] hover:bg-darkslategray">
          <div className="h-[38px] w-[243px] relative rounded-t-none rounded-b-mini bg-black hidden" />
          <img
            className="h-[26px] w-[26px] relative object-cover min-h-[26px] z-[2]"
            alt=""
            src={shoppingCart}
          />
          <i
            className="w-[108px] relative text-xl inline-block font-bold font-inria-sans text-white text-center shrink-0 min-w-[108px] z-[2]"
            style={addToCartStyle}
          >
            Add to cart
          </i>
        </button>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start py-0 pr-4 pl-[17px]">
        <div className="flex-1 relative leading-[24px] font-medium">
          <p className="m-0">{`Cotton DK Yarn Box Set `}</p>
          <p className="m-0">Bundle (Taupe)</p>
          <p className="m-0 text-red">$74.95</p>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;