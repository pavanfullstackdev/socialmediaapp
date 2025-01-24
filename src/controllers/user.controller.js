import { asyncHandler } from "../utils/asyncHandler.js";

// The actual function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
     res.status(200).json({
        message: "User registration successful"
    })
})

export { registerUser }