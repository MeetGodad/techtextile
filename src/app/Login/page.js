"use client";
import { useState } from 'react';
import Login from './Login';
import SignUp from '../SignUp/SignUp';
import Logo from '../components/Logo';

export default function Auth() {
  const [currentView, setCurrentView] = useState('login');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwitch = (view) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsAnimating(false);
    }, 600); // Match this with your CSS animation duration
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className={`flex w-full h-full absolute ${currentView === 'login' ? 'swap-in' : 'swap-out'}`}>
        <div className="flex w-1/2">
          <Login onSwitch={handleSwitch} />
        </div>
        <div className="flex w-1/2 bg-black">
          <Logo side="right" text="IN" />
        </div>
      </div>
      <div className={`flex w-full h-full absolute ${currentView === 'signup' ? 'swap-in' : 'swap-out'}`}>
        <div className="flex w-1/2 bg-black">
          <Logo side="left" text="SIGN" />
        </div>
        <div className="flex w-1/2">
          <SignUp onSwitch={handleSwitch} />
        </div>
      </div>
    </div>
  );
}