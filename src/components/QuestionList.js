import React, { useState, useEffect } from "react";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(response => response.json())
      .then(data => {
        // Update state with the list of questions
        setQuestions(data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      // Remove the deleted question from the list
      setQuestions(questions.filter(question => question.id !== id));
    })
    .catch(error => {
      console.error('Error deleting question:', error);
    });
  };

  const handleCorrectIndexChange = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correctIndex })
    })
    .then(() => {
      // Update the correctIndex of the question in state
      setQuestions(questions.map(question => {
        if (question.id === id) {
          return { ...question, correctIndex };
        }
        return question;
      }));
    })
    .catch(error => {
      console.error('Error updating correct index:', error);
    });
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {/* Display each question, a dropdown menu, and a delete button */}
        {questions.map(question => (
          <li key={question.id}>
            {question.prompt}
            <select 
              value={question.correctIndex} 
              onChange={(e) => handleCorrectIndexChange(question.id, parseInt(e.target.value))}
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>{answer}</option>
              ))}
            </select>
            <button onClick={() => handleDelete(question.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
