require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Question = require("./models/question"); // Import the Question model

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

//database configuration
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// GET API to fetch questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST API to add new questions
app.post("/api/questions", async (req, res) => {
  try {
    const questionData = req.body;

    // Validate that the request body is an array
    if (!Array.isArray(questionData)) {
      return res.status(400).json({
        error: "Invalid data format. Expected an array of questions.",
      });
    }

    // Insert the questions into the database
    const questions = await Question.insertMany(questionData);
    res.status(201).json({ message: "Questions added successfully!", questions });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST API to save explanation details and update selectedOption and isCorrect in the question
app.post("/api/saveExplanation", async (req, res) => {
  try {
    const { questionId, selectedOption, isCorrect } = req.body;

    // console.log(req.body, "req.body");

    // Check if required fields are present
    if (!questionId || selectedOption === undefined || isCorrect === undefined) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Find and update the question
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId }, // Match the document by ID
      { $set: { selectedOption, isCorrect } }, // Set the fields to be updated
      { new: true } // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found." });
    }

    res.status(200).json({
      message: "Selected option and correctness updated successfully.",
      question: updatedQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error. Please try again later." });
  }
});

// Hello World route for test
app.get("/", (req, res) => {
  res.send("Hello, World!");
});   


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
     