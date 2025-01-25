//universal for all projects
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //unlink once uploaded
        fs.unlinkSync(localFilePath)
        //file has been uplaoded successfull
        return response
    } catch (err) {
        //how to remove the file if fiel is not uploaded then unlink it means delete it from local server
        fs.unlinkSync(localFilePath) //remove the localy temprory file 
        return null

    }
}

export { uploadOnCloudinary }