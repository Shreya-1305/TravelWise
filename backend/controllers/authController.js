const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

// Sign JWT Token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Send token + remove password
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: userObj },
  });
};

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, phoneNumber } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError("All fields are required", 400));
  }

  const newUser = await User.create({
    name,
    email,
    phoneNumber,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

// PROTECT Middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new AppError("You are not logged in to access this route", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next(new AppError("User no longer exists", 401));

  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError("Password changed recently. Please log in again.", 401)
    );

  req.user = currentUser;
  next();
});

// restrictTo Middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to do this", 403));
    }
    next();
  };
};

// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("No user found with that email address", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const origin = req.headers.origin || process.env.FRONTEND_URL;
  const resetURL = `${origin}/resetPassword/${resetToken}`;

  const message = `
    <p>Forgot your password?</p>
    <p>Click below to reset it:</p>
    <a href="${resetURL}" 
      style="padding:10px 20px; background-color:#28a745; color:#fff; text-decoration:none; border-radius:5px;">
      Reset Password
    </a>
    <p>If you didn't request this, ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset (Valid for 10 mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token sent to email!",
    });
  } catch (err) {
    console.error(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending email. Try again later.", 500)
    );
  }
});

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log("Received token param:", req.params.token);

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

// UPDATE PASSWORD (for logged-in user)
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
