import { Request, Response } from "express"
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterUserBody {
  userName: string,
  email: string,
  password: string
}

//POST - /api/auth/register - for registering a user
export const registerUser = async (req: Request<{}, {}, RegisterUserBody>, res: Response): Promise<void> => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword
    })
    res.status(201).json("user registered successfully");
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

//POST - /api/auth/login - for login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string, password: string } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token: string = await jwt.sign({
      userId: user._id,
      email: user.email
    }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    res.status(200).json({ token, email: user.email });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}