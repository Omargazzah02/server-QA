import bcrypt from 'bcrypt'
import { User } from "../models/user-model.js";
import { generateToken } from '../utils/jwt.js';
export const  register = async (req , res ) => {

   try {

      const {email , password , username}  = req.body; 

      

      const existingUser = await User.findOne({ "email" : email});

      if (existingUser) {
      return  res.status(400).json({"message" : 'Already existing user'})

      }

      const hashedPassword = await bcrypt.hash(password,10)

      const user = new User({username : username , email : email , password : hashedPassword});
      await user.save()
    return res.status(201).json({ 'message': 'User created successfully' });





   } 
   
   catch(err) {
    console.log(err)
  return  res.status(500).json({"message" : "internal server error"})

   }




    
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 'message': 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 'message': 'Incorrect email ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 'message': 'Incorrect  password' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 'message': 'Internal server error' });
  }
};



