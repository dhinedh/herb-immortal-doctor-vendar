module.exports = function (req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if no token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify token (Mock implementation)
        if (token.startsWith('mock-jwt-token-')) {
            const userId = token.replace('mock-jwt-token-', '');
            req.user = { id: userId };
            next();
        } else {
            res.status(401).json({ message: 'Token is not valid' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
