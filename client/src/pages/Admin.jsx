import { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
  fetchPendingLawyers();
}, []);

const fetchPendingLawyers = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/auth/pending-lawyers"
  );
  setLawyers(res.data);
};


  const approveLawyer = async (id) => {
    await axios.post(
      `http://localhost:5000/api/auth/approve-lawyer/${id}`
    );
    fetchPendingLawyers();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Panel 👨‍💼</h1>

      {lawyers.map((lawyer) => (
        <div key={lawyer._id} style={{ marginTop: "20px" }}>
          <h3>{lawyer.name}</h3>
          <button onClick={() => approveLawyer(lawyer._id)}>
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
