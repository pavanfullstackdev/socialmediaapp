import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.find(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        //carefull when we are upading only one field make sure validaton false
        await user.save({ validateBeforeSave: false })

        //return both tokens
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, 'Access token faield!')

    }
}

// The actual function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //username,email,fullName,avtar,coverImage,password from user model
    //validaions to check
    //check if user is already exists username & email
    //check for images & avtar
    // upload them to cloudinary check avtar uploaded
    //create user object - create entry in db
    //remove password & refresh token from response
    // check for user creation if true send response

    const { fullName, email, username, password } = req.body;
    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exist");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "Somehing went wrong while creating user!");
    }
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User Registerd Successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
    //get data for login req body
    //check user exist username or email or both
    //find the user
    // match password
    //access & refresh token generation
    //send token in secure cookies
    //send res success

    const { username, email, password } = req.body; //getting data
    //check data
    if (!username || !email) {
        throw new ApiError(400, "Username or email is required!");
    }
    //find in db is exist or not
    const user = await User.findOne({ $or: [{ username }, { email }] });

    //if user not present in db
    if (!user) {
        throw new ApiError(404, "User not exist! please register.")
    }
    //if user found match the password
    const isPasswordValid = await user.isPasswordCorrect(password)

    //if pass not match
    if (!isPasswordValid) {
        throw new ApiError(401, "Credential are incorrect!")
    }

    //generate tokens if pass match and use them
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //update the user res
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send in secure keys in cookeis
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in Successfully")
        )

});

const logoutUser = asyncHandler(async (req, res) => {
    // Find user and remove all tokens
    // Use middleware to get the user data to get id to logout
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    // Set options for cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out."));
});




export { registerUser, loginUser, logoutUser };
