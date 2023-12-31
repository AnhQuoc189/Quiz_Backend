import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import constants from "../constants/httpStatus.js";

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "User not found" });
    }
    delete user._doc.password;
    res.status(constants.OK).json(user);
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    let newUsers = users.map((user) => {
      delete user._doc.password;
      return user;
    });
    res.status(constants.OK).json(newUsers);
  } catch (error) {
    res.status(constants.BAD_REQUEST).json({ message: error.message });
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { userType, userName, fullName, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    userType,
    fullName,
    userName,
    email,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    res.status(constants.CREATE).json(newUser);
  } catch (error) {
    res.status(constants.BAD_REQUEST).json({ message: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { avatar, firstName, lastName, userName, mail } = JSON.parse(
    req.body.info
  );

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(constants.NOT_FOUND).json(`No user with id: ${id}`);
  }

  const findUserId = await User.findById(id);
  const newUpdate = { ...findUserId.update, profile: new Date() };

  const user = new User({
    _id: id,
    avatar: req.file ? req.file.path : avatar,
    firstName,
    lastName,
    userName,
    mail: mail,
    update: newUpdate,
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });
    return res.status(constants.OK).json(updatedUser);
  } catch (error) {
    res.status(constants.BAD_REQUEST).json({ message: error.message });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id) || !User.findById(id)) {
    res.status(constants.NOT_FOUND);
    throw new Error(`No user with id: ${id}`);
  }
  try {
    await User.findByIdAndRemove(id);
    res.status(constants.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
});

const unFriend = asyncHandler(async (req, res) => {
  const { myId, friendId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(myId) || !User.findById(myId)) {
    res.status(constants.NOT_FOUND).json({
      message: `No user with id: ${id}`,
    });
    throw new Error(`No user with id: ${id}`);
  }

  if (!mongoose.Types.ObjectId.isValid(friendId) || !User.findById(friendId)) {
    res.status(constants.NOT_FOUND).json({
      message: `No user with id: ${id}`,
    });
  }
  try {
    const user = await User.findById(myId);
    const friend = await User.findById(friendId);

    user.follows = user.follows.filter((item) => item !== friend.userName);
    await user.save();
    res.status(constants.OK).json(user);
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
});

const addFriend = asyncHandler(async (req, res) => {
  const { myId, friendId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(myId) || !User.findById(myId)) {
    res.status(constants.NOT_FOUND).json({
      message: `No user with id: ${id}`,
    });
    throw new Error(`No user with id: ${id}`);
  }

  if (!mongoose.Types.ObjectId.isValid(friendId) || !User.findById(friendId)) {
    res.status(constants.NOT_FOUND).json({
      message: `No user with id: ${id}`,
    });
  }
  try {
    const user = await User.findById(myId);
    const friend = await User.findById(friendId);
    user.follows.push(friend.userName);
    await user.save();

    res.status(constants.OK).json(user);
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
});

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addFriend,
  unFriend,
};
