import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!JWT_SECRET)
      return res.status(500).json({ message: "JWT secret not configured" });

    const payload = { id: user._id, email: user.email, role: user.role };
    

    const token = jwt.sign(
      payload,
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN as string } as jwt.SignOptions
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: (() => {
        if (JWT_EXPIRES_IN.endsWith("d"))
          return parseInt(JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000;
        return 24 * 60 * 60 * 1000;
      })(),
    });

    res.json({
      message: "Logged in",
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
