const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: String,
  title: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  selectedOption: Number, // Field to store the selected option
  isCorrect: Boolean, // New field to store correctness of the selected option
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question; // Export the Question model
