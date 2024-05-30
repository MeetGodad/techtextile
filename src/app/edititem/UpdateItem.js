import Header from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const UpdateItem = () => {
  return (
    <div>
      <Header />
      <div className="w-full relative bg-white h-screen overflow-hidden text-left text-black font-inter">
        <h1 className="text-center text-3xl font-bold mt-16">Edit Item</h1>
        
        <div className="px-8 py-4 space-y-6">
          <div>
            <label className="block text-lg font-semibold">Item Name</label>
            <input type="text" className="w-full mt-2 p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label className="block text-lg font-semibold">Description</label>
            <textarea className="w-full mt-2 p-2 border border-gray-300 rounded" rows="4"></textarea>
          </div>

          <div>
            <label className="block text-lg font-semibold">Category</label>
            <select className="w-full mt-2 p-2 border border-gray-300 rounded text-gray-500">
              <option>Select Category</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold">Variant</label>
            <select className="w-full mt-2 p-2 border border-gray-300 rounded text-gray-500">
              <option>Select Condition</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold">Price</label>
            <input type="text" className="w-full mt-2 p-2 border border-gray-300 rounded" />
          </div>

          <div>
            <label className="block text-lg font-semibold">Images</label>
            <button className="w-1/3 mt-2 p-2 border border-gray-300 rounded bg-gray-100 text-center">Upload Image</button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8">Shipping Options</h2>
            
            <div>
              <label className="block text-lg font-semibold">Shipping Cost</label>
              <input type="text" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>

            <div>
              <label className="block text-lg font-semibold">Shipping Options</label>
              <select className="w-full mt-2 p-2 border border-gray-300 rounded text-gray-500">
                <option>Select Shipping Option</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-8">Additional Details</h2>
            
            <div>
              <label className="block text-lg font-semibold">Brand</label>
              <input type="text" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="p-2 bg-blue-500 text-white rounded">Update Item</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateItem;
