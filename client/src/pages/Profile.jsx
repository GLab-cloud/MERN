import React from "react";
//import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
//import { request } from "express";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  console.log(filePerc);
  console.log(file);
  console.log(formData);
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  // upload profile image to firebase/storage or service cloud.firestore
  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  console.log(fileUploadError);
  //   cloud filestore
  //   rules_version = '2';

  // service cloud.firestore {
  //   match /databases/{database}/documents {
  //     match /{document=**} {
  //       allow read;
  //       allow write: if
  //       request.resource.size<2*1024*1024&&
  //       request.resource.contentType.matches('image/.*');
  //     }
  //   }
  // }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log("formData", formData);
  //     console.log("user_id", currentUser._id);

  //     dispatch(updateUserStart());
  //     const res = await fetch(
  //       `https://vvkg5d-5000.csb.app/api/user/update/${currentUser._id}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(formData),
  //       }
  //     );
  //     const data = await res.json();
  //     if (data.success === false) {
  //       dispatch(updateUserFailure(data.message));
  //       return;
  //     }
  //     dispatch(updateUserSuccess(data));
  //   } catch (error) {
  //     dispatch(updateUserFailure(error.message));
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("formData", formData);
      console.log("user_id", currentUser._id);
      dispatch(updateUserStart());
      const res = await fetch(
        `https://localhost:5000/api/user/update/${currentUser._id}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://localhost:5000/api/user/delete/${currentUser._id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("https://localhost:5000/api/auth/signout", {
        credentials: "include",
        method: "POST",
      });
      const data = await res.json(); //
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
      }
      dispatch(signOutUserSuccess(data));
      navigate("/");
      console.log("currentUser=", currentUser.user);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(
        "https://localhost:5000/api/user/listings/" + currentUser._id,
        {
          credentials: "include",
          method: "GET",
        }
      );

      // await axios
      //   .get("https://localhost:5000/api/user/listings/" + currentUser._id, {
      //     withCredentials: true, // Important for cross-origin requests with cookies
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //     const data = res.json();
      //     if (data.success === false) {
      //       setShowListingsError(true);
      //       return;
      //     }
      //   })
      //   .catch((error) => console.error("Error:", error));
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      //setShowListingsError(false);
      console.log("Error showing listing: false - no error");
      setUserListings(data);
      console.log("listings", userListings);
    } catch (error) {
      setShowListingsError(true); //Error showing listing
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `https://localhost:5000/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => {
        prev.filter((listing) => listing._id !== listingId);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          className="rounded-full w-25 h-25 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-500">
              {" "}
              Error Image Upload (image file size must less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700"> {`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700"> Image successfully loaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="p-3 border rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="p-3 border rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          //defaultValue={currentUser.password}
          className="p-3 border rounded-lg"
          id="password"
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {" "}
          Update{" "}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
          to={"/create-Listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className=" flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer text-red-700"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer text-red-700">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated sucessfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {" "}
        {showListingsError ? "Error showing listing" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            {" "}
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg flex items-center justify-between p-3 gap-4"
            >
              {" "}
              <Link to={`listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="Listing Cover"
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline flex-1 truncate"
                to={`listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
