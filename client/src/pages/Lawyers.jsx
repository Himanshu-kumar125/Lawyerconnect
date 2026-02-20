import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/lawyers");
    setLawyers(res.data);
  };

  const filteredLawyers = lawyers.filter((lawyer) =>
    lawyer.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Find Verified Lawyers ⚖️</h1>

      <input
        type="text"
        placeholder="Search by specialization..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          margin: "20px 0",
          width: "300px",
          borderRadius: "8px",
          border: "1px solid gray",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredLawyers.map((lawyer) => (
          <div
            key={lawyer._id}
            onClick={() => navigate(`/lawyer/${lawyer._id}`)}
            style={{
              width: "280px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer",
              background: "white",
              overflow: "hidden",
            }}
          >
            <img
              src={lawyer.photo}
              alt="lawyer"
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "15px" }}>
              <h3>{lawyer.name}</h3>
              <p>⚖️ {lawyer.specialization}</p>
              <p>📅 {lawyer.experience} years experience</p>
              <p>💰 ₹{lawyer.fees}</p>
              <p>⭐ {lawyer.avgRating || 0} ({lawyer.totalReviews || 0} reviews)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lawyers;
