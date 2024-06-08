import PropTypes from 'prop-types';

const Footer = ({ className = "" }) => {
  return (
    <footer className={`w-full bg-bg overflow-hidden flex flex-col items-start justify-start px-0 ${className}`}>
      <img
        className="self-stretch relative max-w-full overflow-hidden max-h-full"
        loading="lazy"
        alt=""
        src="/line-3.svg"
      />
      <section className="self-stretch flex flex-col items-start justify-start pt-10 px-10 pb-5 box-border relative gap-5 text-left text-lg text-bg font-poppins">
        <div className="w-full h-full absolute inset-0 bg-black" />
        <div className="w-full flex flex-col items-start justify-start gap-5 z-10">
          <b className="relative inline-block min-w-[118px] text-white">
            Tech Textile
          </b>
          <div className="flex flex-wrap justify-between w-full gap-10 text-white">
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="text-xs font-proxima-nova">
              As a large tech company, we strive to provide our users with the best
            experience possible by offering a smooth interface, seamless
            transactions, and more. If you have any specific questions or need
            further assistance, feel free to ask! 😊
                
              </div>
              <div className="flex gap-3">
                <img className="w-4 h-4" loading="lazy" alt="Twitter" src="/Images/twitter.png" />
                <img className="w-4 h-4" loading="lazy" alt="Facebook" src="/Images/facebook.png" />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="relative font-medium">Contact Us</div>
              <div className="text-sm">
                E-Comm, 4578 Marmora Road, Glasgow D04 89GR
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="relative font-medium">Information</div>
              <div className="text-sm">
                <p className="m-0">About Us</p>
                <p className="m-0">Information</p>
                <p className="m-0">Privacy Policy</p>
                <p className="m-0">Terms & Conditions</p>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="relative font-medium">Service</div>
              <div className="text-sm">
                <p className="m-0">About Us</p>
                <p className="m-0">Information</p>
                <p className="m-0">Privacy Policy</p>
                <p className="m-0">Terms & Conditions</p>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="relative font-medium">My Account</div>
              <div className="text-sm">
                <p className="m-0">About Us</p>
                <p className="m-0">Information</p>
                <p className="m-0">Privacy Policy</p>
                <p className="m-0">Terms & Conditions</p>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="relative font-medium">Our Offers</div>
              <div className="text-sm">
                <p className="m-0">About Us</p>
                <p className="m-0">Information</p>
                <p className="m-0">Privacy Policy</p>
                <p className="m-0">Terms & Conditions</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center text-xs font-semibold text-silver z-10">
          <img
            className="w-[100px] max-h-full"
            loading="lazy"
            alt="Payment Methods"
            src="/Images/Brands.png"
          />
          <div className="absolute h-[29.93%] w-[25.99%] text-sm font-proxima-nova text-white">
          © 2018 Ecommerce theme by www.bisenbaev.com
          </div>
          <div>
            &copy; 2024 Your Company. All rights reserved.
          </div>
        </div>
      </section>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
