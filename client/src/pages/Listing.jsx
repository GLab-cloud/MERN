import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import Contact from "../components/Contact";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
export default function Listing() {
  SwiperCore.use([Navigation]);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        //setError(false);
        setLoading(true);
        const listingId = params.listingId;
        const res = await fetch(
          `https://localhost:5000/api/listing/get/${listingId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        //console.log(currentUser._id, listing.userRef);
        //life circle of this component ->listing maybe null->error=true
        console.log(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchListing();
    //console.log(currentUser._id, listing.userRef);
  }, [params.listingId]); //dependent variable's value changes

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl ">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl ">Something went wrong!!!</p>
      )}
      {listing && !loading & !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls[0] ? (
              listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))
            ) : (
              <img
                className="w-full h-[430px] flex justify-center mt-2 rounded-lg p-2 object-cover"
                src="https://rentapartment.vn/wp-content/uploads/2021/03/Real-estate-la-gi.jpg"
              />
            )}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex-wrap">
              <li className="flex gap-1 items-center whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Un Furnished"}
              </li>
            </ul>
            {/* add contact landlord */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 p-3"
              >
                {" "}
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
