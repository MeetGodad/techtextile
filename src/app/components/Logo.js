// components/Logo.js
export default function Logo({ side, text }) {
  return (
    <div className="flex items-center justify-center w-full bg-black relative p-4">
      <div className={`top-4 text-5xl font-semibold text-white absolute ${side === 'left' ? 'right-3' : 'left-3'} transition-transform duration-500`}>
        {text}
      </div>
      <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto max-w-xs md:max-w-md lg:max-w-lg transition-transform duration-500" />
    </div>
  );
}