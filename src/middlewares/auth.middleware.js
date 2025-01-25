import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//put _ insted res if its not using
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        //access to token from cookies 
        const token = req.cookeis?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            //disc about frond end
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw ApiError(401, error?.message || "invalid token")
    }

})