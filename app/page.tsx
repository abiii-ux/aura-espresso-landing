import React from "react";
import CoffeeSequence from "./CoffeeSequence";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Premium Title Section */}
      <div className="absolute top-10 text-center z-10 pointer-events-none">
        <h1 className="text-5xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          Aura Espresso
        </h1>
        <p className="text-gray-400 text-sm mt-2 tracking-widest">
          CRAFTED BY MADMAX
        </p>
      </div>

      {/* 3D Coffee Animation Container */}
      <div className="w-full h-screen sticky top-0 flex items-center justify-center">
        <CoffeeSequence />
      </div>
    </main>
  );
}
