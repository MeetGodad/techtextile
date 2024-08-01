// import './Loder.css'; // Ensure you have the necessary font and animations in this CSS

// export default function Loder() {
//     return (
//         <div className="flex justify-center items-center min-h-screen">
//         <div className="relative flex justify-center items-center w-[400px] h-[400px]">
//             <div className="absolute flex justify-center items-center w-full h-full border-4 border-black animate-rotate-clockwise"></div>
//             <div className="absolute flex justify-center items-center w-full h-full border-4 border-black animate-rotate-counterclockwise"></div>
//             <div className="absolute flex justify-center items-center">
//                 <div className="relative">
//                     <div className="font-chango text-[185px] font-normal text-black transform rotate-[-7.38deg] absolute right-[4%]">T</div>
//                     <div className="font-chango text-[185px] font-normal text-black transform rotate-[7.38deg] absolute right-16 bottom-10">T</div>
//                 </div>
//             </div>
//         </div>
//     </div>
    
//     );
// };
import './Loder.css'; // Ensure you have the necessary font and animations in this CSS

export default function Loder() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="relative flex justify-center items-center w-[400px] h-[400px]">
                <div className="absolute flex justify-center items-center w-full h-full border-4 border-black animate-rotate-clockwise"></div>
                <div className="absolute flex justify-center items-center w-full h-full border-4 border-black animate-rotate-counterclockwise"></div>
                <div className="absolute flex justify-center items-center">
                    <div className="relative">
                        <div className="font-chango text-[185px] font-normal text-black transform rotate-[7.38deg] absolute left-[1px] top-[-130px]">T</div>
                        <div className="font-chango text-[185px] font-normal text-black transform rotate-[-7.38deg] absolute right-[1px] top-[-170px] ">T</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

