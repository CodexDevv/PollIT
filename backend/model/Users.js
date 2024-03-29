mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshtoken: {
    type: String,
    required: false,
  },
});

const userCollection = new mongoose.model("userCollection", userSchema);

module.exports = userCollection;
