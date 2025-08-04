import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Listing() {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        //console.log(listingId);
        const res = await fetch(
          `https://localhost:5000/api/listing/get/${listingId}`
        );
        const data = await res.json();
        if (data.successs === false) {
          console.log(data.message);
          setError(true);
          setLoading(false);
          return;
        }
        //setFormData(data);
        setListing(data);
        console.log(data);
        console.log(listing);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);
  return <div>{listing ? "Listing page - loading..." : listing.name}</div>;
}
