import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {
    try {
        const {token} = req.headers;

        if (!token) {
            return res.json({success: false, message: "Not Authorized Login Again"});
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decoded.id;
        next();

    }catch (e) {
        res.json({success: false, message: e.message});
    }
}

export default userAuth;