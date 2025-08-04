import React, { useEffect, useState } from "react";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    offer: false,
    furnished: false,
    regularPrice: 50,
    discountPrice: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      console.log(listingId);
      const res = await fetch(
        `https://localhost:5000/api/listing/get/${listingId}`
      );
      const data = await res.json();
      if (data.successs === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

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
            //imageUrls: [
            //"https://media.istockphoto.com/id/2175973016/photo/modern-luxury-home-exterior-at-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=B2e-gEujpM7UNHX3uMHqvyh_bHC5sHFYfxf0ldEc6R0=",
            //"https://media.istockphoto.com/id/2196462912/photo/detail-of-real-estate-agents-hands-handing-over-keys.webp?a=1&b=1&s=612x612&w=0&k=20&c=v2pdUnS7n07w7-GFvztlN6fdy6g0DtIzrW_uetWFsws=",
            //"https://media.istockphoto.com/id/2148548224/photo/suburban-dallas-housing-development.webp?a=1&b=1&s=612x612&w=0&k=20&c=BtiVh_IPqQfOrPwrDJYCmIc4s1cjcK_ZC2rHtmO1cEI=",
            //],
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((err) => {
          setUploading(false);
          setImageUploadError("Image upload error (2 MB max - per image");
        });
    } else if (files.length === 0) {
      console.log("files.length = 0");
      setUploading(true);
      setImageUploadError(false);
      setFormData({
        ...formData,
        imageUrls: [
          "https://media.istockphoto.com/id/2175973016/photo/modern-luxury-home-exterior-at-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=B2e-gEujpM7UNHX3uMHqvyh_bHC5sHFYfxf0ldEc6R0=",
          "https://media.istockphoto.com/id/2196462912/photo/detail-of-real-estate-agents-hands-handing-over-keys.webp?a=1&b=1&s=612x612&w=0&k=20&c=v2pdUnS7n07w7-GFvztlN6fdy6g0DtIzrW_uetWFsws=",
          "https://media.istockphoto.com/id/2148548224/photo/suburban-dallas-housing-development.webp?a=1&b=1&s=612x612&w=0&k=20&c=BtiVh_IPqQfOrPwrDJYCmIc4s1cjcK_ZC2rHtmO1cEI=",
        ],
      });
      setUploading(false);
      setImageUploadError(false);
      setImageUploadError(
        "Test create new listing with 3 default images - not uploading to firebase storage Url"
      );
    } else {
      setImageUploadError("You can only upload 6 images/per a listing");
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
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "offer" ||
      e.target.id === "furnished" ||
      e.target.id === "parking"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(false);
      // if (formData.imageUrls.length < 1)
      //   return setError("You must upload at least 1 image");
      if (formData.regularPrice < formData.discountPrice)
        return setError("Discount Price must be lower than regular Price 1");
      setLoading(true);
      setError(false);
      const res = await fetch(
        `https://localhost:5000/api/listing/update/${params.listingId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userRef: currentUser._id }),
        }
      );
      const data = await res.json();

      if (data.successs === false) {
        setError(data.message);
      }
      setLoading(false);
      setCreateSuccess(true);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {" "}
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 gap-4 ">
          <input
            placeholder="Name"
            type="text"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            placeholder="Description"
            type="text"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            placeholder="Address"
            type="text"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>
        <div className="flex gap-6 flex-wrap mt-3">
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="sale"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="rent"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="parking"
              onChange={handleChange}
              checked={formData.parking}
            />
            <span>Parking spot</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="furnished"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="offer"
              onChange={handleChange}
              checked={formData.offer}
            />
            <span>Offer</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bedrooms"
              max={10}
              min={1}
              required
              className="p-3 border rounded-lg border-gray-300"
              value={formData.bedrooms}
              onChange={handleChange}
            />
            <p> Beds</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bathrooms"
              max={10}
              min={1}
              required
              className="p-3 border rounded-lg border-gray-300"
              value={formData.bathrooms}
              onChange={handleChange}
            />
            <p> Baths</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              id="regularPrice"
              max={10000000}
              min={100}
              required
              className="p-3 border rounded-lg border-gray-300"
              value={formData.regularPrice}
              onChange={handleChange}
            />
            <div className="flex flex-col items-center">
              <p> Regular Price</p>
              <span className="text-xs">($/ month)</span>
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                max={10000000}
                min={0}
                required
                className="p-3 border rounded-lg border-gray-300"
                value={formData.discountPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p> Discounted Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($/ month)</span>
                )}
              </div>
            </div>
          )}
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
              type="button"
              disabled={uploading}
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
            disabled={loading || uploading}
            className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm"> {error} </p>}
          <p className="text-green-700 mt-5">
            {createSuccess ? " New List created sucessfully!" : ""}
          </p>
        </div>
      </form>
    </main>
  );
}
