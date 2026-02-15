import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
};

// Controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(422).json({ message: 'Name, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(422).json({ message: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(422).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Create new user with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(newUser._id);

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).json({ message: 'Internal server error during registration' });
    }
};

// Controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(422).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token and return user data
        const token = generateToken(user._id);
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Internal server error during login' });
    }
};

// Controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({ user: userResponse });

    } catch (error) {
        console.error('Get user error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        const resumes = await Resume.find({ user: userId }).select('_id title template');
        return res.status(200).json({ resumes });

    } catch (error) {
        console.error('Get resumes error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
