const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");


module.exports.verifyJWTToken = (tokenString) => {

    try {
        if (!tokenString.startsWith("Bearer")) {
            throw new AppError("Invalid token", 401);
        }

        const values = tokenString.split(" ");

        if (values.length != 2) {
            return new AppError("Invalid token", 401)
        }

        const token = values[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded


    } catch (err) {
        throw new AppError("Invalid token", 401)
    }
}