mongoose = require("mongoose");
const { Schema, model } = mongoose;

const pollSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  pollType: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  votes: {
    type: Array,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
});

const pollCollection = new mongoose.model("pollCollection", pollSchema);

module.exports = pollCollection;
