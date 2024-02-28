
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:ohTALWhy9vwnI7av@cluster0.okyiuau.mongodb.net/quizzr");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        enum: ['quizCreator', 'quizTaker'],
        default: 'quizTaker'
      }
})

const quizesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  questions: [
      {
          question:{type:String, required:true},
          options:[{option: String, correct:Boolean}]
      }
  ],
  timer: {
    type: Number, // Time limit for the quiz in seconds
    required: true
  }
})

const User = mongoose.model('User', userSchema);
const Quizes = mongoose.model('Quizes', quizesSchema)

//const Quiz = mongoose.model('Quiz',quizSchema);

module.exports = {
    User,
    Quizes
}