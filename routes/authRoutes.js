const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const razorpay = require("../config/razorpay");
const Review = require("../models/Review");
const Message = require("../models/Message");
const upload = require("../config/multer");



// REGISTER

router.post("/register-lawyer", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      barCouncilNumber,
      experience,
      specialization,
      fees,
    } = req.body;

    // check file received or not
    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const lawyer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "lawyer",
      barCouncilNumber,
      experience,
      specialization,
      fees,
      verificationStatus: "pending",
      photo: req.file.path,
    });

    res.json({ message: "Lawyer registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering lawyer" });
  }
});




// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Wrong password" });

    // block lawyer if not approved
  if (user.role === "lawyer" && user.verificationStatus !== "approved") {
    return res.json({ message: "Your account is under verification" });
  }

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({
      token,
      role: user.role,
      message: "Login successful",
    });
  } catch (error) {
    res.json({ message: "Login error" });
  }
});

module.exports = router;

// LAWYER REGISTER
router.post("/register-lawyer", upload.single("photo"), async (req, res) => {

  try {
    const { name, email, password, barCouncilNumber, experience, specialization, fees } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create lawyer user
    const lawyer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "lawyer",
      barCouncilNumber,
      experience,
      specialization,
      fees,
      verificationStatus: "pending",
      photo: req.file.path,
    });

    res.json({ message: "Lawyer registered. Waiting for admin approval" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering lawyer" });
  }
});

// GET ALL APPROVED LAWYERS
router.get("/lawyers", async (req, res) => {
  try {
    const lawyers = await User.find({
      role: "lawyer",
      verificationStatus: "approved",
    }).select("-password");

    const lawyersWithRating = await Promise.all(
      lawyers.map(async (lawyer) => {
        const reviews = await Review.find({ lawyerId: lawyer._id });

        let avgRating = 0;
        if (reviews.length > 0) {
          const total = reviews.reduce((sum, r) => sum + r.rating, 0);
          avgRating = (total / reviews.length).toFixed(1);
        }

        return {
          ...lawyer._doc,
          avgRating,
          totalReviews: reviews.length,
        };
      })
    );

    res.json(lawyersWithRating);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lawyers" });
  }
});


// ADMIN APPROVE LAWYER
router.put("/approve-lawyer/:id", async (req, res) => {
  try {
    const lawyer = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "approved" },
      { new: true }
    );

    res.json({ message: "Lawyer approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving lawyer" });
  }
});

// GET ALL LAWYERS (ADMIN)
router.get("/all-lawyers", async (req, res) => {
  try {
    const lawyers = await User.find({ role: "lawyer" }).select("-password");
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lawyers" });
  }
});

// GET SINGLE LAWYER DETAILS
router.get("/lawyer/:id", async (req, res) => {
  try {
    const lawyer = await User.findById(req.params.id).select("-password");
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lawyer details" });
  }
});

const Appointment = require("../models/Appointment");

// BOOK APPOINTMENT
router.post("/book-appointment", async (req, res) => {
  try {
    const { userId, lawyerId, date, time } = req.body;

    const appointment = await Appointment.create({
      userId,
      lawyerId,
      date,
      time,
    });

    res.json({ message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment" });
  }
});

// GET USER APPOINTMENTS
router.get("/appointments/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// CREATE RAZORPAY ORDER
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 50000, // ₹500 (in paise)
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
});

// ADD REVIEW
router.post("/add-review", async (req, res) => {
  try {
    const { lawyerId, userName, rating, comment } = req.body;

    const review = await Review.create({
      lawyerId,
      userName,
      rating,
      comment,
    });

    res.json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review" });
  }
});

// GET REVIEWS FOR A LAWYER
router.get("/reviews/:lawyerId", async (req, res) => {
  try {
    const reviews = await Review.find({ lawyerId: req.params.lawyerId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// SEND MESSAGE
// SEND MESSagge
router.post("/send-message", async (req, res) => {
  try {
    const { lawyerId, text } = req.body;

    // USER MESSAGE SAVE
    await Message.create({
      lawyerId: lawyerId,
      sender: "user",
      text: text,
    });

    // AUTO LAWYER REPLY (Demo)
    setTimeout(async () => {
      await Message.create({
        lawyerId: lawyerId,
        sender: "lawyer",
        text: "Hello 👋 I received your message. How can I help you?",
      });
    }, 1000);

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending message" });
  }
});


// GET CHAT MESSAGES
router.get("/messages/:lawyerId", async (req, res) => {
  try {
    const messages = await Message.find({
      lawyerId: req.params.lawyerId.toString(),
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});


// GET PENDING LAWYERS (Admin)
router.get("/pending-lawyers", async (req, res) => {
  try {
    const lawyers = await User.find({
      role: "lawyer",
      verificationStatus: "pending",
    });

    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending lawyers" });
  }
});

// APPROVE LAWYER (Admin)
router.post("/approve-lawyer/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      verificationStatus: "approved",
    });

    res.json({ message: "Lawyer approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving lawyer" });
  }
});

// GET ALL MESSAGES FOR A LAWYER
router.get("/messages/:lawyerId", async (req, res) => {
  try {
    const messages = await Message.find({
      lawyerId: req.params.lawyerId,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});





