import PropTypes from 'prop-types';
const Foooter = ({ className = "" }) => {
    return (
      <div
        className={`w-full h-[1743px] bg-bg overflow-hidden flex flex-col items-start justify-start pt-[137px] px-0 pb-[1606px] box-border gap-[953px] leading-[normal] tracking-[normal] mq450:gap-[238px] mq825:h-auto mq825:gap-[476px] ${className}`}
      >
        <img
          className="self-stretch relative max-w-full overflow-hidden max-h-full"
          loading="lazy"
          alt=""
          src="/line-3.svg"
        />
        <section className="self-stretch flex flex-col items-start justify-start pt-[133px] px-[129px] pb-[80.9px] box-border relative gap-[84px] max-w-full text-left text-lg text-bg font-poppins mq450:gap-[21px] mq450:pl-5 mq450:pr-5 mq450:box-border mq675:pt-[86px] mq675:pb-[53px] mq675:box-border mq825:gap-[42px] mq825:pl-16 mq825:pr-16 mq825:box-border">
          <div className="w-full h-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] bg-black" />
          <div className="w-[1021.9px] flex flex-row items-start justify-between max-w-full gap-[20px] mq825:flex-wrap">
            <div className="flex flex-col items-start justify-start pt-1 px-0 pb-0">
              <b className="relative inline-block min-w-[118px] z-[1]">
                Tech Textile
              </b>
            </div>
            <div className="w-[514px] flex flex-row items-start justify-start gap-[181.7px] max-w-full mq450:gap-[45px] mq675:flex-wrap mq675:gap-[91px]">
              <div className="flex-1 flex flex-col items-start justify-start gap-[15.6px] min-w-[123px]">
                <div className="w-[94px] relative font-medium inline-block z-[1]">
                  Follow Us
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[19.1px] text-xs font-proxima-nova">
                  <div className="self-stretch relative z-[1]">
                    Since the 1500s, when an unknown printer took a galley of type
                    and scrambled.
                  </div>
                  <div className="w-[61.6px] flex flex-row items-start justify-start py-0 px-px box-border">
                    <div className="h-[14.3px] flex-1 relative">
                      <img
                        className="absolute top-[1.9px] left-[45.1px] w-3.5 h-[11.2px] z-[1]"
                        loading="lazy"
                        alt=""
                        src="/twitter.svg"
                      />
                      <img
                        className="absolute top-[0px] left-[0px] w-[7.3px] h-[14.3px] z-[1]"
                        loading="lazy"
                        alt=""
                        src="/facebook.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[142.2px] flex flex-col items-start justify-start pt-1 px-0 pb-0 box-border">
                <div className="self-stretch flex flex-col items-start justify-start gap-[15.3px] z-[1]">
                  <div className="relative font-medium inline-block min-w-[110px]">
                    Contact Us
                  </div>
                  <div className="self-stretch h-[59.6px] relative text-sm inline-block shrink-0">
                    E-Comm , 4578 Marmora Road, Glasgow D04 89GR
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1163.1px] flex flex-col items-end justify-start gap-[41.9px] max-w-full mq675:gap-[21px]">
            <div className="self-stretch flex flex-row items-start justify-end py-0 pr-2 pl-0 box-border max-w-full">
              <div className="flex-1 flex flex-row items-start justify-between shrink-0 [debug_commit:bf4bc93] max-w-full gap-[20px] z-[1] mq825:flex-wrap">
                <div className="flex flex-col items-start justify-start pt-[24.1px] pb-0 pr-[15px] pl-0">
                  <div className="h-[109.2px] flex flex-col items-start justify-start pt-0 px-0 pb-[83.7px] box-border gap-[4.3px]">
                    <div className="flex flex-row items-start justify-start shrink-0 [debug_commit:bf4bc93]">
                      <div className="relative inline-block min-w-[103.4px]">
                        Infomation
                      </div>
                    </div>
                    <div className="flex flex-row items-start justify-start py-0 pr-0 pl-px text-sm">
                      <div className="h-[79.4px] relative inline-block shrink-0 [debug_commit:bf4bc93]">
                        <p className="m-0">About Us</p>
                        <p className="m-0">{`Infomation `}</p>
                        <p className="m-0">Privacy Policy</p>
                        <p className="m-0">{`Terms & Conditions`}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start py-0 pr-[15px] pl-0">
                  <div className="flex flex-col items-start justify-start pt-0 px-0 pb-[0.1px] gap-[32.8px]">
                    <div className="flex flex-row items-start justify-start">
                      <div className="relative inline-block min-w-[73.5px]">
                        Service
                      </div>
                    </div>
                    <div className="h-[79.4px] relative text-sm inline-block shrink-0">
                      <p className="m-0">About Us</p>
                      <p className="m-0">{`Infomation `}</p>
                      <p className="m-0">Privacy Policy</p>
                      <p className="m-0">{`Terms & Conditions`}</p>
                    </div>
                  </div>
                </div>
                <div className="h-[122.8px] flex flex-col items-start justify-start pt-0 px-0 pb-[97.8px] box-border gap-[18.4px]">
                  <div className="flex flex-row items-start justify-start shrink-0 [debug_commit:bf4bc93]">
                    <div className="relative inline-block min-w-[109px]">
                      My Account
                    </div>
                  </div>
                  <div className="h-[79.4px] relative text-sm inline-block shrink-0 [debug_commit:bf4bc93]">
                    <p className="m-0">About Us</p>
                    <p className="m-0">{`Infomation `}</p>
                    <p className="m-0">Privacy Policy</p>
                    <p className="m-0">{`Terms & Conditions`}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start pt-[4.1px] px-0 pb-0">
                  <div className="flex flex-col items-start justify-start pt-0 px-0 pb-[0.1px] gap-[17.7px]">
                    <div className="relative font-medium inline-block min-w-[98px]">
                      Our Offers
                    </div>
                    <div className="flex flex-row items-start justify-start py-0 pr-0 pl-0.5 text-sm">
                      <div className="h-[79.4px] relative inline-block">
                        <p className="m-0">About Us</p>
                        <p className="m-0">{`Infomation `}</p>
                        <p className="m-0">Privacy Policy</p>
                        <p className="m-0">{`Terms & Conditions`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[1148.7px] flex flex-col items-start justify-start gap-[28.7px] shrink-0 [debug_commit:bf4bc93] max-w-full z-[1] text-sm text-silver font-proxima-nova">
              <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[15px] box-border max-w-full">
                <img
                  className="flex-1 relative max-w-full overflow-hidden max-h-full shrink-0 [debug_commit:bf4bc93]"
                  loading="lazy"
                  alt=""
                  src="/rectangle-1-copy-35.svg"
                />
              </div>
              <div className="w-[1124.2px] flex flex-row items-start justify-between shrink-0 [debug_commit:bf4bc93] gap-[20px] max-w-full mq675:flex-wrap">
                <div className="w-[298.6px] flex flex-col items-start justify-start pt-[2.9px] px-0 pb-0 box-border">
                  <div className="self-stretch h-[16.1px] relative leading-[17.04px] inline-block shrink-0">
                    © 2018 Ecommerce theme by www.bisenbaev.com
                  </div>
                </div>
                <div className="w-[203.9px] flex flex-row items-start justify-start relative gap-[19px] text-[6px] text-bg font-poppins">
                  <img
                    className="self-stretch w-[36.8px] relative max-h-full min-h-[24px]"
                    loading="lazy"
                    alt=""
                    src="/westernunion.svg"
                  />
                  <img
                    className="h-[8.2px] w-[25.2px] absolute !m-[0] right-[6.2px] bottom-[7.7px] z-[1]"
                    alt=""
                    src="/shape-328.svg"
                  />
                  <img
                    className="h-[4.5px] w-[5px] absolute !m-[0] top-[8.1px] right-[26.4px] z-[2]"
                    loading="lazy"
                    alt=""
                    src="/shape-328-1.svg"
                  />
                  <div className="h-[23.8px] flex-1 relative">
                    <img
                      className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] max-w-full overflow-hidden max-h-full"
                      alt=""
                      src="/shape-327.svg"
                    />
                    <img
                      className="absolute h-[71.43%] w-[46.74%] top-[14.29%] right-[9.51%] bottom-[14.29%] left-[43.75%] max-w-full overflow-hidden max-h-full z-[1]"
                      loading="lazy"
                      alt=""
                      src="/shape-329.svg"
                    />
                    <img
                      className="absolute h-[71.43%] w-[46.74%] top-[14.29%] right-[45.38%] bottom-[14.29%] left-[7.88%] max-w-full overflow-hidden max-h-full z-[2]"
                      alt=""
                      src="/shape-329-1.svg"
                    />
                    <div className="absolute h-[43.7%] w-[83.7%] top-[33.33%] left-[7.57%] inline-block [transform:_rotate(7.2deg)] [transform-origin:0_0]">
                      MasterCard
                    </div>
                  </div>
                  <img
                    className="self-stretch w-[36.5px] relative max-h-full min-h-[24px]"
                    loading="lazy"
                    alt=""
                    src="/paypal.svg"
                  />
                  <img
                    className="self-stretch w-[36.8px] relative max-h-full min-h-[24px]"
                    alt=""
                    src="/shape-327-1.svg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[194px] absolute !m-[0] top-[177px] left-[128px] text-xs font-semibold inline-block z-[2]">
            As a large tech company, we strive to provide our users with the best
            experience possible by offering a smooth interface, seamless
            transactions, and more. If you have any specific questions or need
            further assistance, feel free to ask! 😊
          </div>
        </section>
      </div>
    );
  };
  
  Foooter.propTypes = {
    className: PropTypes.string,
  };
  
  export default Foooter;
  
  