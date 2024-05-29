import Header from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
const UpdateItem = () => {
    return (
      <div>
        <Header />
      <div className="w-full relative bg-white h-[1271px] overflow-hidden text-left text-mini text-black font-inter">
        <b className="absolute top-[11.57%] left-[43.44%] text-[36.4px] text-center">
          Edit Item
        </b>
        <b className="absolute top-[17.53%] left-[16.39%]">Item Name</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[19.73%] right-[18.61%] bottom-[77.28%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector.svg"
        />
        <b className="absolute top-[24.3%] left-[16.39%]">Description</b>
        <img
          className="absolute h-[6.77%] w-[65%] top-[26.5%] right-[18.61%] bottom-[66.73%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector1.svg"
        />
        <b className="absolute top-[34.84%] left-[16.39%]">Category</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[37.04%] right-[18.61%] bottom-[59.97%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector.svg"
        />
        <div className="absolute top-[37.67%] left-[16.94%] text-base text-silver">
          Select Category
        </div>
        <b className="absolute top-[41.61%] left-[16.39%]">Variant</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[43.81%] right-[18.61%] bottom-[53.2%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector.svg"
        />
        <div className="absolute top-[44.44%] left-[16.94%] text-base text-silver">
          Select Condition
        </div>
        <b className="absolute top-[48.62%] left-[16.39%]">Price</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[50.57%] right-[18.61%] bottom-[46.44%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector.svg"
        />
        <b className="absolute top-[55.14%] left-[16.39%]">Images</b>
        <img
          className="absolute h-[2.99%] w-[8.33%] top-[57.34%] right-[75.28%] bottom-[39.67%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector2.svg"
        />
        <div className="absolute top-[58.14%] left-[17.08%] text-center">
          Upload Image
        </div>
        <b className="absolute top-[62.3%] left-[16.39%] text-10xl-4">
          Shipping Options
        </b>
        <b className="absolute top-[66.03%] left-[16.39%]">Shipping Cost</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[68.24%] right-[18.61%] bottom-[28.77%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector3.svg"
        />
        <b className="absolute top-[72.8%] left-[16.39%]">Shipping Options</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[75%] right-[18.61%] bottom-[22.01%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector3.svg"
        />
        <div className="absolute top-[75.63%] left-[16.94%] text-base text-silver">
          Select Shipping Option
        </div>
        <b className="absolute top-[79.96%] left-[16.39%] text-10xl-4">
          Additional Details
        </b>
        <b className="absolute top-[84.19%] left-[16.39%]">Brand</b>
        <img
          className="absolute h-[2.99%] w-[65%] top-[85.9%] right-[18.61%] bottom-[11.11%] left-[16.39%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector.svg"
        />
        <img
          className="absolute h-[2.99%] w-[7.33%] top-[93.31%] right-[76.35%] bottom-[3.7%] left-[16.32%] max-w-full overflow-hidden max-h-full"
          alt=""
          src="/vector4.svg"
        />
        <div className="absolute top-[94.18%] left-[16.93%] text-center">
          Update Item
        </div>
      </div>
      <Footer />
      </div>
    );
  };
  
  export default UpdateItem;
  