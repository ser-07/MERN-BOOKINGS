import User from "../models/userModel.js";
import { errorHandler } from "../utils/errors.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => res.send("Router workings");

export const updateUser = async (req, res, next) => {
  // console.log(req.user);
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own Account!"));

  try {
    if (req.body.password)
      req.body.password = bcryptjs.hashSync(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } //This is added so that the response will send the updated details.
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own Account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    //Clear cookie
    res.clearCookie("access_token");
    //send the response
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};
