import React from "react";
export default function Home() {
  return (
    <div className="text-center mt-2 bg-white-200">
      <div className="border-b p-1">
        <p className="text-3xl font-bold text-slate-600">
          Real Estate Marketplace
        </p>
        <div className="flex items-center md:items-center">
          <img
            className="rounded-full w-full mt-3 p-2 h-[450px]"
            src="../public/NFT real estate.png"
          ></img>
        </div>
      </div>
    </div>
  );
}
