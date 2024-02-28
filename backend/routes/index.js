const express = require("express");
const userRouter = require('./user');
const quizRouter = require('./question');


const router = express.Router();

router.use("/user", userRouter);
router.use("/quiz", quizRouter);

module.exports=router;
