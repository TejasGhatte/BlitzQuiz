const { User, Quizes  } = require("../db");
const zod = require("zod");
const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware')
const router = express.Router();
const app = express();
const { default: mongoose } = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const quizBody = zod.object({
    title: zod.string(),
    questions: zod.array(
        zod.object({
            question: zod.string(),
            options: zod.array(
                zod.object({
                    option: zod.string(),
                    correct: zod.boolean()
                })
            )
        })
    ),
    timer: zod.number()
});


router.post("/createQuiz", authMiddleware, async (req, res) => {
    const { title, questions, timer } = req.body;

    const user = await User.findOne({
        _id: req.userId,
    });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const { success } = quizBody.safeParse({ title, questions, timer });

    if (success) {
        const quiz = await Quizes.create({
            title,
            questions,
            creator: req.userId,
            timer,
        });

        res.status(201).json({
            message: "Quiz created successfully",
        });
    } else {
        res.status(400).json({
            message: "Invalid inputs",
        });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try{
    const quiz = await Quizes.findById(new ObjectId(req.params.id));
    console.log(quiz)
    if (quiz) {
        res.status(200).json(quiz);
    } else {
        res.status(400).json({
            message: "Cannot find the quiz"
        })
    }}catch (error) {
        if (error.code === "ECONNRESET") {
          res.status(500).json({ message: "Connection reset by server" });
        } else {
          res.status(500).json({ message: "Internal server error" });
        }
      } 
})

router.post("/:id/submit", authMiddleware, async (req, res) => {
    const quiz = await Quizes.findById(new ObjectId(req.params.id));
   

    if (quiz) {
        const correctAnswers = [];
        let score = 0
        for (i=0;i<quiz.questions.length;i++) {
            const submittedOption = req.body.answers[i].optionId
            const correctAns = quiz.questions[i].options.find(value=>value.correct===true)._id.toString();
            
            if (submittedOption === correctAns) {
            correctAnswers.push(quiz.questions[i].question);
            score++
            }
        }
        res.status(200).json({ message: 'Answers submitted successfully', correctAnswers, "score": score });
    } else {
        res.status(404).json({ message: 'Quiz not found' });
    }
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    console.log(filter)
    const quizes = await Quizes.find({
        $or: [{
            title: {
                "$regex": filter
            }
        }]
    })

    res.json({
        quiz: quizes.map(quiz => ({
            title: quiz.title,
            _id: quiz._id
        }))
    })
})

module.exports = router;