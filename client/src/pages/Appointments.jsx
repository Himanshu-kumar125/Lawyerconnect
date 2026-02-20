import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/auth/appointments/demoUser123"
    );
    setAppointments(res.data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Appointments 📅</h1>

      <div style={{ marginTop: "20px" }}>
        {appointments.map((appt) => (
          <div
  key={appt._id}
  onClick={() => navigate(`/lawyer/${appt.lawyerId}`)}
  style={{
    background: "white",
    padding: "20px",
    marginTop: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "400px",
    cursor: "pointer",
  }}
>
  <h3>⚖️ View Lawyer Profile</h3>
  <p>Date: {appt.date}</p>
  <p>Time: {appt.time}</p>
</div>

        ))}
      </div>
    </div>
  );
};

export default Appointments;

