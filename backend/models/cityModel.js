const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: [true, "City name is required"],
  },
  country: {
    type: String,
    required: [true, "Country name is required"],
  },
  emoji: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Date of visit is required"],
  },
  notes: {
    type: String,
    trim: true,
  },
  position: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A city must belong to a user"],
  },
});

const City = mongoose.model("City", citySchema);
module.exports = City;
