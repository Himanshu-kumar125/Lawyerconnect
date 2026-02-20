import { useEffect, useState } from "react";
import axios from "axios";

const LawyerDashboard = () => {
  const [appointments, setAppointments] = useState([]);

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
      <h1>Lawyer Dashboard ⚖️</h1>

      {appointments.map((a) => (
        <div key={a._id} style={{ marginTop: "10px" }}>
          📅 {a.date} ⏰ {a.time}
        </div>
      ))}
    </div>
  );
};

export default LawyerDashboard;
