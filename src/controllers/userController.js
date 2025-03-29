const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { full_name, email, password, user_type } = req.body;

        if (!full_name || !email || !password || !user_type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        await db.query("INSERT INTO users (full_name, email, password, user_type) VALUES (?, ?, ?, ?)",
            [full_name, email, hashedPassword, user_type]
        );

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user[0].id, user_type: user[0].user_type }, "your_secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUserProfile = (req, res) => {
    res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
    });
};

