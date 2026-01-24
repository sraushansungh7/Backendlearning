import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/api-res.js";
import {asyncHandler} from "../utils/asynchandel.js";
import ApiError from "../utils/api-err.js";
import {
  emailVerificationMailgenContent,
  sendEmail,
} from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
      if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password} = req.body ;

console.log("REQ BODY:", req.body);

 
  if (!email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // 2️⃣ Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User with email or username already exists"
    );
  }

  // 3️⃣ Create user
  const user = await User.create({
    email,
    username,
    password,
    isEmailVerified: false,
  });

  // 4️⃣ Generate email verification token
  const {
    unHashedToken,
    hashedToken,
    tokenExpiry,
  } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  // 5️⃣ Send verification email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/verify-email/${unHashedToken}`
    ),
  });

  // 6️⃣ Fetch safe user
  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
  );

  if (!safeUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering user"
    );
  }

  // 7️⃣ Send response
  return res.status(201).json(
    new ApiResponse(
      201,
      safeUser,
      "User registered successfully. Verification email sent."
    )
  );
});


const login=asyncHandler(async(req,res)=>{
      const {email,password}=req.body

 if (!email  || !password) {
    throw new ApiError(400, "All fields are required");
  }
 const user = await User.findOne({email});
  if(!user){
    throw new ApiError(400,"User not found");
  }
const isPasswordValid=  await user.comparePassword(password);
if(!isPasswordValid){
      throw new ApiError(400, "invalid pasword");
    }
    
 const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

 const loginUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry"
  );

    const options = {
    httpOnly: true,
    secure: false, // dev
    sameSite: "lax",
  };
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,{
        user:loginUser,
        accessToken,
        refreshToken
      },
      "user logged in Successfully"
    )
  )
 
})

export  {registerUser,login};
