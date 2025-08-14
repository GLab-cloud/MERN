import React from "react";
export default function About() {
  return (
    <div className="text-center mt-3">
      <p className="logo ">GLab</p>
      <p className="text-green-800 font-semibold">
        We founded in 2025, a new Start-up Lab. Interesting in Research &
        Development (R&D) Software Technology.
      </p>
      <p className="font-semibold text-center text-lg"> Porfolio: </p>
      <ul class="list-disc text-blue-600 dark:text-sky-400 font-semibold text-center">
        <li className="">
          Web, Mobile App development: Real Estate Marketplace, Web - API,
          E-Commerce, Smart City,...
        </li>
        <li>Data Science </li>
        <li>AI, Machine Learning </li>
        <li>
          Game development: Web browser game, Unity 2D, 3D casual, multiplayer,
          online game{" "}
        </li>
      </ul>
    </div>
  );
}
