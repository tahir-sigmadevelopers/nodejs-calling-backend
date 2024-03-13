import bcrypt from "bcryptjs/dist/bcrypt.js";
import ErrorHandler from "../middlewares/Error.js";
import User from "../models/user.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

export const registerUser = async (req, res, next) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "User",
      width: 150,
      crop: "scale",
    });

    // console.log(req.body.image);
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler(`User Already Exists`, 400));

    // const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
      user,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        `Error Occured While Creating the User ${error.message}`,
        500
      )
    );
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler(`User Does Not Exists`, 400));

    // const isMatched = await bcrypt.compare(password, user.password);
    const isMatched = password === user.password;

    if (!isMatched) return next(new ErrorHandler(`Invalid Credentials`, 401));

    return res.status(200).json({
      success: true,
      message: `Welcome Back ${user.name}`,
      user,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error Occured While Log in User ${error.message}`, 500)
    );
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Error Occured While Login User  ${error.message}`, 500)
    );
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, loggedInUserEmail } = req.body;
    let user = await User.findOne({ email: loggedInUserEmail });
    console.log(user);
    // Image Deletion and Updation Code Starts Here
    // if (req.body.image) {
    //   if (user.image && user.image.public_id) {
    //     let userImageId = user.image.public_id;
    //     await cloudinary.v2.uploader.destroy(userImageId);

    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //       folder: "User",
    //       width: 150,
    //       crop: "scale",
    //     });

    //     user.image = {
    //       public_id: myCloud.public_id,
    //       url: myCloud.secure_url,
    //     };
    //   }
    // }
    // Image Deletion and Updation Code Ends Here

    // Update only the name and email if they are provided in the request
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        `Error Occurred While Updating User Profile ${error.message}`,
        500
      )
    );
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .cookie("ecommerce", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        message: "Logout Successfully!",
      });
  } catch (error) {
    return next(
      new ErrorHandler(`Error Occured While Log Out User ${error.message}`, 500)
    );
  }
};

export const getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler(`User Not Found`, 404));

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        `Error Occured While Getting User Detail ${error.message}`,
        500
      )
    );
  }
};
