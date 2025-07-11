import React from "react";
import { useSelector } from "react-redux";
import { useRef,useState, useEffect} from "react";
import {getStorage} from "firebase/storage";
import { app } from "../../firebase";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file,setFile]=useState(undefined)
  console.log(file)
  useEffect(() => {
    if(file){
      handleFileUpload();
    }
  }, [file]);
  const handleFileUpload=()=>{
      const storage =getStorage(app)
  }
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={(e)=>{setFile(e.target.files[0])}} type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="Profile"
          className="rounded-full w-25 h-25 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          className="p-3 border rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="p-3 border rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="p-3 border rounded-lg"
          id="password"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {" "}
          Update{" "}
        </button>
      </form>
      <div className=" flex justify-between mt-5">
        <span className="cursor-pointer text-red-700">Delete Account</span>
        <span className="cursor-pointer text-red-700">Sign out</span>
      </div>
    </div>
  );
}
