import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {" "}
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            placeholder="Name"
            type="text"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />

          <textarea
            placeholder="Description"
            type="text"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            placeholder="Address"
            type="text"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="">
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="sale" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="parking" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="offer" />
              <span>Offer</span>
            </div>
            <div className="">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  max="10"
                  min="1"
                  required
                  className="p-3 border rounded-lg border-gray-300"
                />
                <p> Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  max="10"
                  min="1"
                  required
                  className="p-3 border rounded-lg border-gray-300"
                />
                <p> Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  required
                  className="p-3 border rounded-lg border-gray-300"
                />
                <div className="">
                  <p> Regular Price</p>
                  <span>($/ month)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
