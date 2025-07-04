const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const City = require("../models/cityModel");

// @desc    Get all cities for logged-in user
exports.getAllCities = catchAsync(async (req, res, next) => {
  const cities = await City.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    results: cities.length,
    data: { cities },
  });
});

// @desc    Create a new city
exports.createCity = catchAsync(async (req, res, next) => {
  const newCity = await City.create({
    ...req.body,
    user: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: { city: newCity },
  });
});

// @desc    Get single city by ID
exports.getCity = catchAsync(async (req, res, next) => {
  const city = await City.findOne({ _id: req.params.id, user: req.user.id });

  if (!city) {
    return next(new AppError("No city found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { city },
  });
});

// @desc    Delete city
exports.deleteCity = catchAsync(async (req, res, next) => {
  const city = await City.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!city) {
    return next(new AppError("No city found to delete", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
