import bcrypt from "bcryptjs";
import User from "../model/user.js";
import { generateToken } from "../lib/util.js";

export const Signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  console.log(req.body)

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

    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Password mismatch
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user (safe fields only)
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
      },
      message: "User login successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
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












