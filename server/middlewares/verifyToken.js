import jwt from "jsonwebtoken";

// verify token 
export function verifyToken(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "No token provided"});
    }

    // extract token
    const token = authHeader.split(" ")[1];

    try {
        // get and save payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();        
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired token"});
    }
}