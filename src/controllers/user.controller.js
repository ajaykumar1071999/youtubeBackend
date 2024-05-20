import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { errorMessage } from "../utils/errorMessage.js";
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  // check required fields

  if (!username || !fullName || !email || !password) {
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    const errorMessage = `${missingFields.join(", ")} is required`;
    const error = new APIError(400, errorMessage, errorMessage);
    return res.status(400).json(error);
  }

  // check existed user
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    const error = new APIError(
      409,
      errorMessage?.USER_ALL_READY_EXIST,
      errorMessage?.USER_ALL_READY_EXIST
    );
    return res.status(409).json(error);
  }

  // get files url

  const avatarLoaclPath = req.files?.avatar?.["0"]?.path;
  const coverImageLoaclPath = req.files?.coverImage?.["0"]?.path;

  // check localPath
  if (!avatarLoaclPath) {
    const error = new APIError(
      400,
      errorMessage?.AVTAR_FILE_IS_REQUIRED,
      errorMessage?.AVTAR_FILE_IS_REQUIRED
    );
    return res.status(400).json(error);
  }

  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const coverImage = await uploadOnCloudinary(coverImageLoaclPath);

  if (!avatar) {
    // throw new APIError(400, "Avatar file is required");
    const error = new APIError(
      400,
      errorMessage?.AVTAR_FILE_IS_REQUIRED,
      errorMessage?.AVTAR_FILE_IS_REQUIRED
    );
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
    return res
      .status(500)
      .json(
        new APIError(
          500,
          errorMessage?.SOMETHING_WENT_WRONG,
          errorMessage?.SOMETHING_WENT_WRONG
        )
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully.", createdUser));
});

export { registerUser };
