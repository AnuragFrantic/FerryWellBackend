require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const leadRoutes = require('./routes/leadroutes');
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require('path')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/leads', leadRoutes);
app.get('/', (req, res) => {
    res.send('API is working');
});


const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/advkumardeepraj.in/fullchain.pem', 'utf-8'),
    key: fs.readFileSync('/etc/letsencrypt/live/advkumardeepraj.in/privkey.pem', 'utf-8'),
};

https.createServer(options, app)
    .listen(PORT, function (req, res) {
        // connect()
        console.log("Server started at port https " + PORT);
    });








// Start Server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
