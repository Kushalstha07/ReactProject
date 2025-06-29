import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//Middleware to verify JWT token
export function authenticateToken(req,res,next){
    //skip token verification fort he login route
    if(req.path == "/api/auth/login"){
        return next();
    }

    // get token from authorization header
    const token = req.header("Authorization")?.split(" ")[1];

    if (token){
        return res
        .status(401)
        .send({message: "Accesss denied. No token provided."});
    }
    jwt.verify(token,process.env.secretkey, (err,decode) => {
        if(err){
            return res.status(401).send("Invalid or expired token.");
        }
        req.user = decode; // Attach decode payload to request object
        next();  // procced to the next middleware or route handler

    });
}