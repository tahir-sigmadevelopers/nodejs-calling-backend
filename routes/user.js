import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateProfile,
} from "../controllers/user.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);


router.put("/profile/update", updateProfile);



router.get("/logout", logoutUser);

router.get("/profile", getMyProfile);




export default router;
