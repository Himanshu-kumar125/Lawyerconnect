import { useState } from "react";
import axios from "axios";

const RegisterLawyer = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    barCouncilNumber: "",
    experience: "",
    specialization: "",
    fees: "",
  });

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerLawyer = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("barCouncilNumber", form.barCouncilNumber);
      formData.append("experience", form.experience);
      formData.append("specialization", form.specialization);
      formData.append("fees", form.fees);
      formData.append("photo", photo);

      await axios.post(
  "http://localhost:5000/api/auth/register-lawyer",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);


      alert("Lawyer Registered Successfully!");
    } catch (error) {
      console.log(error);
      alert("Error registering lawyer");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Register Lawyer 🧑‍⚖️</h1>

      <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
      <input name="password" placeholder="Password" onChange={handleChange} /><br /><br />
      <input name="barCouncilNumber" placeholder="Bar Council Number" onChange={handleChange} /><br /><br />
      <input name="experience" placeholder="Experience (years)" onChange={handleChange} /><br /><br />
      <input name="specialization" placeholder="Specialization" onChange={handleChange} /><br /><br />
      <input name="fees" placeholder="Consultation Fees" onChange={handleChange} /><br /><br />

      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} /><br /><br />

      <button onClick={registerLawyer}>Register Lawyer</button>
    </div>
  );
};

export default RegisterLawyer;
