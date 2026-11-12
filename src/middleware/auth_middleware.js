const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        
        if (!token) {
            return res.status(401).json({ "message": "Token is required" }); 
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        let user = jwt.verify(token, 'secure_token'); 
        
        req.user = { userID: user.id };
        next();

    } catch (e) {
        return res.status(401).json({ 
            message: "Invalid or expired token", 
            error: e.message 
        });
    }
};