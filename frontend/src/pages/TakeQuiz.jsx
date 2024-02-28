import { response } from "express";
import { useState } from "react";
import { useEffect } from "react"

export const TakeQuiz = ()=>{
    
}

function displayQuestion({id},{index}){
    const [currentQuestion,setcurrentQuestion] =useState(0);
    const [quiz,setquiz] = useState({})
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v2/quiz/:"+{id},{
            headers: {
                'Authorization':'Bearer '+authtoken
            }
        })
        .then(response=>{
            setquiz(response.data)
        })
    })
    return <div>
        <div>
            <span>{currentQuestion+1}</span>
            <span>/{quiz.questions.length}</span>
            <h2>{quiz.questions[currentQuestion]}</h2>
        </div>
    </div>
}
