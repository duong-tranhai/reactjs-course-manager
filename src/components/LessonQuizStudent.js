import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const LessonQuizStudent = () => {
  const { lessonId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/by-lesson/${lessonId}`);
        setQuiz(res.data);
        setAnswers(res.data.selected_answers || {});
        setScore(res.data.score);
        setAttempts(res.data.submitted_attempts || 0);
        setMaxAttempts(res.data.max_attempts || 1);
        setSubmitted((res.data.submitted_attempts || 0) >= res.data.max_attempts);
        setCorrectAnswers(res.data.correct_answers || {});
      } catch {
        alert("Failed to load quiz");
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonId]);

  const handleSelect = (questionId, choice) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choice
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      quiz_id: quiz.quiz_id,
      answers: Object.entries(answers).map(([question_id, selected]) => ({
        question_id: parseInt(question_id),
        selected
      }))
    };

    try {
      const res = await api.post("/quizzes/submit", payload);
      setScore(res.data.score);
      setSubmitted(true);
      setAttempts((prev) => prev + 1);
      alert(`✅ You scored ${res.data.score}/${quiz.questions.length}`);
    } catch (err) {
      alert(err.response?.data?.detail || "Submission failed");
    }
  };

  const getChoiceClass = (q, choice) => {
    const selected = answers[q.id] === choice;
    const correct = correctAnswers[q.id] === choice;

    if (!submitted) return '';

    if (selected && correct) return 'bg-success text-white';
    if (selected && !correct) return 'bg-danger text-white';
    if (!selected && correct) return 'bg-success-subtle';
    return '';
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>No quiz available for this lesson.</p>;

  return (
    <div className="mt-4">
      <h5>{quiz.title}</h5>
      <p className="text-muted">Attempts used: {attempts}/{maxAttempts}</p>

      {quiz.questions.map((q) => (
        <div key={q.id} className="mb-3 border p-3 rounded">
          <strong>{q.question}</strong>
          <div className="mt-2">
            {q.choices.map((choice, i) => {
              const isSelected = answers[q.id] === choice;
              const isCorrect = correctAnswers[q.id] === choice;

              return (
                <div key={i} className={`form-check p-2 rounded ${getChoiceClass(q, choice)}`}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${q.id}`}
                    id={`q${q.id}-choice${i}`}
                    value={choice}
                    checked={isSelected}
                    onChange={() => handleSelect(q.id, choice)}
                    disabled={submitted}
                  />
                  <label className="form-check-label" htmlFor={`q${q.id}-choice${i}`}>
                    {choice}
                    {submitted && isCorrect && <span> ✅</span>}
                    {submitted && isSelected && !isCorrect && <span> ❌</span>}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          className="btn btn-primary mt-3"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== quiz.questions.length}
        >
          Submit Quiz
        </button>
      ) : (
        <div className="alert alert-info mt-3">
          ✅ You've submitted this quiz {attempts}/{maxAttempts}.
          {score !== null && (
            <div>Your last score: <strong>{score}%</strong></div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonQuizStudent;
