const Header = () => {
    return (
      <div className="w-full bg-white overflow-hidden flex flex-row items-start justify-between pt-[3px] pb-[2.9px] pr-[21px] pl-2.5 box-border top-[0] z-[99] sticky leading-[normal] tracking-[normal] gap-[20px] text-left text-11xl text-black font-chango">
        <div className="w-[373px] flex flex-row items-start justify-start max-w-full">
          <div className="h-[75.1px] w-[75.1px] flex flex-col items-start justify-start relative shrink-0 [debug_commit:bf4bc93]">
            <div className="absolute !m-[0] top-[22.53px] left-[15px] tracking-[0.03em] leading-[24px] [transform:_rotate(-5.6deg)] [transform-origin:0_0] mq450:text-lg mq450:leading-[14px] mq800:text-5xl mq800:leading-[19px]">
              T
            </div>
            <div className="absolute !m-[0] right-[8.85px] bottom-[21.59px] tracking-[0.03em] leading-[24px] [transform:_rotate(5.6deg)] [transform-origin:0_0] z-[1] mq450:text-lg mq450:leading-[14px] mq800:text-5xl mq800:leading-[19px]">
              T
            </div>
            <div className="w-full h-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px]">
              <div className="absolute top-[27.5px] left-[0px] box-border w-[55px] h-[55px] [transform:_rotate(-30deg)] [transform-origin:0_0] border-[2px] border-solid border-black" />
              <div className="absolute top-[0.01px] left-[27.49px] box-border w-[55px] h-[55px] [transform:_rotate(30deg)] [transform-origin:0_0] border-[2px] border-solid border-black" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start justify-start pt-[9px] px-0 pb-0 ml-[-0.1px] text-center text-[45px] font-inria-sans">
            <h3 className="m-0 self-stretch relative text-inherit font-bold font-inherit shrink-0 [debug_commit:bf4bc93] whitespace-nowrap mq450:text-[27px] mq800:text-[36px]">
              TECH TEXTILE
            </h3>
          </div>
        </div>
        <div className="h-[62px] w-[937px] flex flex-col items-start justify-start pt-3 px-0 pb-0 box-border max-w-full text-center text-13xl font-inria-sans">
          <div className="self-stretch flex-1 flex flex-row items-start justify-start gap-[17px] max-w-full">
            <div className="w-[304px] flex flex-col items-start justify-start pt-1 pb-0 pr-[7px] pl-0 box-border text-lg text-gray">
              <div className="self-stretch rounded-mini bg-gainsboro flex flex-row items-start justify-start py-[7px] pr-[11px] pl-3 gap-[19px]">
                <div className="h-[43px] w-[297px] relative rounded-mini bg-gainsboro hidden" />
                <div className="flex-1 flex flex-col items-start justify-start pt-[3px] px-0 pb-0 mq1300:hidden">
                  <i className="self-stretch relative font-light whitespace-nowrap z-[1] mq1125:hidden">
                    What are you looking for ?
                  </i>
                </div>
                <img
                  className="self-stretch w-[47px] relative max-h-full object-cover min-h-[29px] z-[1]"
                  alt=""
                  src="/search@2x.png"
                />
              </div>
            </div>
            <div className="w-[127px] flex flex-col items-start justify-start pt-[3px] pb-0 pr-[5px] pl-0 box-border">
              <i className="self-stretch relative font-light">Home</i>
            </div>
            <div className="w-[127px] flex flex-col items-start justify-start pt-[3px] px-0 pb-0 box-border">
              <i className="self-stretch relative inline-block font-light min-w-[127px]">
                Category
              </i>
            </div>
            <div className="self-stretch flex-1 flex flex-row items-start justify-start max-w-full">
              <div className="w-[122px] flex flex-col items-start justify-start pt-[6.3px] px-0 pb-0 box-border">
                <i className="self-stretch h-8 relative inline-block font-light shrink-0">
                  About
                </i>
              </div>
              <button className="cursor-pointer [border:none] py-0 pr-1.5 pl-0 bg-[transparent] self-stretch w-[74px] flex flex-col items-start justify-start box-border">
                <img
                  className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
                  alt=""
                  src="/shopping-cart@2x.png"
                />
              </button>
              <div className="flex-1 flex flex-col items-start justify-start pt-[15px] px-0 pb-0 text-lg">
                {/* <Link to="/login" className="self-stretch relative font-bold whitespace-nowrap">
                SIGN UP/LOG IN
                </Link> */}
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Header;