import React, { useState } from "react";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ imageUrls: [] });
  const [imageUploadError, setImageUploadError] = useState(false);

  const [uploading, setUploading] = useState(false);
  console.log(files);
  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((err) => {
          setUploading(false);
          setImageUploadError("Image upload error (2 MB max - per image");
        });
    } else {
      setImageUploadError("you can only upload 6 image per listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {" "}
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 gap-4 ">
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
        </div>
        <div className="flex gap-6 flex-wrap mt-3">
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
        </div>
        <div className="flex flex-wrap gap-6 mt-3">
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
            <div className="flex flex-col items-center">
              <p> Regular Price</p>
              <span className="text-xs">($/ month)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="discountPrice"
              required
              className="p-3 border rounded-lg border-gray-300"
            />
            <div className="flex flex-col items-center">
              <p> Discount Price</p>
              <span className="text-xs">($/ month)</span>
            </div>
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            {" "}
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              {" "}
              The first image will be the cover (max - 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              type="file"
              accept="image/*"
              multiple
              id="images"
              className="p-3 border border-gray-300 rounded-w-full "
            />
            <button
              onClick={handleImageSubmit}
              className=" p-3 text-green-700 border-green-700 rounded uppercase hover: shadow-lg disabled: opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text:sm">
            {imageUploadError && imageUploadError}
          </p>
          <button
            disabled={uploading}
            className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-80"
          >
            {" "}
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
