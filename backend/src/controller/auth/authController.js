import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";

const login = async (req, res) => {
  try {
    //fetching all the data from users table
    if (req.body.email == null) {
      return res.status(400).send({ message: "email is required" });
    }
    if (req.body.password == null) {
      return res.status(400).send({ message: "password is required" });
    }
    
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    
    if (user.password === req.body.password) {
      const token = generateToken({ user: user.toJSON() });
      return res.status(200).send({
        data: { access_token: token },
        message: "successfully logged in",
      });
    } else {
      return res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 *  init - Get current user from token
 */

const init = async (req, res) => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = req.user.user;
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).send({ 
      data: userWithoutPassword, 
      message: "successfully fetched current user" 
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const authController = {
  login,
  init,
};
