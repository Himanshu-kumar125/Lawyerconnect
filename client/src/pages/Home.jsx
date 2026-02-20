import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "#f1f5f9",
      }}
    >
      <h1 style={{ fontSize: "40px" }}>
        Find Trusted Lawyers Easily ⚖️
      </h1>

      <p style={{ maxWidth: "600px", marginTop: "10px" }}>
        Connect with verified lawyers, book paid consultations,
        chat directly and get legal help from the comfort of your home.
      </p>

      <Link to="/lawyers">
        <button
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            fontSize: "18px",
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Find Lawyers
        </button>
      </Link>
    </div>
  );
};

export default Home;

