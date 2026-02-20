import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LawyerDetails = () => {
  const { id } = useParams();

  const [lawyer, setLawyer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [messageText, setMessageText] = useState("");

  // ================= FETCH FUNCTIONS =================
  const fetchLawyer = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/lawyer/${id}`
      );
      setLawyer(res.data);
    } catch (error) {
      console.log("Error fetching lawyer:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/reviews/${id}`
      );
      setReviews(res.data);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/messages/${id}`
      );
      setMessages(res.data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLawyer();
      fetchReviews();
      fetchMessages();

      // auto refresh chat
      const interval = setInterval(() => {
        fetchMessages();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [id]);

  // ================= PAYMENT =================
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const bookAppointment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) return alert("Razorpay failed to load");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/create-order"
      );

      const options = {
        key: "rzp_test_SGUYXMy2iXu61V",
        amount: data.amount,
        currency: data.currency,
        name: "LawyerConnect",

        handler: async function (response) {
          await axios.post("http://localhost:5000/api/auth/book-appointment", {
            userId: "demoUser123",
            lawyerId: id,
            date: "2026-02-20",
            time: "10:00 AM",
            paymentId: response.razorpay_payment_id,
          });

          alert("Appointment Booked Successfully ✅");
        },

        modal: {
          ondismiss: () => {
            alert("Payment Cancelled ❌");
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.log("Error booking appointment:", error);
    }
  };

  // ================= ADD REVIEW =================
  const addReview = async () => {
    try {
      if (!comment.trim()) return alert("Please write a review");

      await axios.post("http://localhost:5000/api/auth/add-review", {
        lawyerId: id,
        userName: "demoUser",
        rating: rating,
        comment: comment,
      });

      setComment("");
      setRating(5);
      fetchReviews();

      alert("Review added successfully ⭐");
    } catch (error) {
      console.log("Error adding review:", error);
    }
  };

  // ================= CHAT =================
  const sendMessage = async () => {
    try {
      if (!messageText.trim()) return;

      await axios.post("http://localhost:5000/api/auth/send-message", {
        lawyerId: id,
        sender: "user",
        text: messageText,
      });

      setMessageText("");
      fetchMessages();
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  if (!lawyer) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      {/* LAWYER INFO */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1>{lawyer.name}</h1>
        <p>⚖️ {lawyer.specialization}</p>
        <p>📅 {lawyer.experience} years experience</p>
        <p>💰 Consultation Fees: ₹{lawyer.fees}</p>

        <button
          onClick={bookAppointment}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Pay & Book Appointment 💳
        </button>
      </div>

      {/* REVIEWS */}
      <div style={{ marginTop: "40px" }}>
        <h2>Add Review ⭐</h2>

        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ padding: "8px", marginTop: "10px" }}
        />
        <br />
        <br />

        <textarea
          placeholder="Write review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
        <br />
        <br />

        <button
          onClick={addReview}
          style={{
            padding: "8px 18px",
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Submit Review
        </button>

        <h3 style={{ marginTop: "20px" }}>Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              style={{
                background: "white",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <b>{r.userName}</b> ⭐ {r.rating}
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* CHAT */}
      <div style={{ marginTop: "40px" }}>
        <h2>Chat with Lawyer 💬</h2>

        <input
          placeholder="Type message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          style={{ padding: "10px", width: "70%" }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Send
        </button>

        <div
          style={{
            background: "#f1f5f9",
            padding: "15px",
            height: "300px",
            overflowY: "scroll",
            marginTop: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            messages.map((m) => (
              <div
                key={m._id}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? "#0f172a" : "#e2e8f0",
                  color: m.sender === "user" ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  maxWidth: "70%",
                }}
              >
                {m.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerDetails;

