import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // support "Bearer <token>" format
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // token was created with payload { id: userId }
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default protect;