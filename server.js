const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🔐 Firebase Admin Setup
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseKey.json'); // Make sure this file exists

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🚪 Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("Received login request:", username, password);

  // ✅ Replace with your real logic if needed
  const isAuthenticated = (username === "admin" && password === "1234");

  try {
    // 🔥 Store login activity in Firestore
    await db.collection("loginActivity").add({
      username,
      success: isAuthenticated,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Login activity stored.");
  } catch (error) {
    console.error("Error storing login activity:", error);
  }

  // 💬 Respond to client
  if (isAuthenticated) {
    res.json({ success: true, token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// 🟢 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
