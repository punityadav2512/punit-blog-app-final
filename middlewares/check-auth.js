const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.APP_SECRET);

        req.userData = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token:- " + error
        })
    }
}