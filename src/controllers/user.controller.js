import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  // check required fields
  if (
    [username, fullName, email, password]?.some(
      (fields) => fields.trim() === ""
    )
  ) {
    throw new APIError(400, "All fields are required");
  }

  // check existed user
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new APIError(409, "User already exist");
  }

  // get files url

  console.log("avatarLoaclPath", req.files);
  const avatarLoaclPath = req.files?.avatar?.["0"]?.path;
  const coverImageLoaclPath = req.files?.coverImage?.["0"]?.path;

  // check localPath
  if (!avatarLoaclPath) {
    throw new APIError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const coverImage = await uploadOnCloudinary(coverImageLoaclPath);

  if (!avatar) {
    console.log("stop here");
    throw new APIError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullName,
    username,
    avatar: avatar?.url,
    coverImage: coverImage?.url || null,
    email,
    password,
    username: username?.toLowerCase(),
  });
  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken "
  );

  if (!createdUser) {
    throw new APIError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully.", createdUser));
  console.log(username, fullName);
});

export { registerUser };
