import bcrypt from "bcryptjs";
import User from "../model/user.js";
import { generateToken } from "../lib/util.js";

export const Signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio: bio || "",
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCurrect = await bcrypt.compare(process.env.JWT_SECRET);
    if (!isPasswordCurrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }
    const token = generateToken(newUser._id);
    return res
      .status(201)
      .json({ success: true, token, message: "User Login successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        userData: newUser,
        token,
        message: "Server error",
      });
  }
};

export const checkAuth = (req , res)=>{
  res.json({success:true , user:req.user})
}

// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId,  { bio, fullName }, { new: true } )
        } else {
            const upload = await cloudinary.uploader.upload(profilePic); 
//  {
//                 folder: 'user-profiles',
//                 resource_type: 'auto'
//             }
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url,bio, fullName },{ new: true })}
                 res.status(200).json({success: true,message: 'Profile updated successfully',user: updatedUser});

    } catch (error) {
        res.status(500).json({success: false,message: 'Failed to update profile', error: error.message
        }); 
    }
};












