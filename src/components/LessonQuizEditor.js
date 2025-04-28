import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const LessonQuizEditor = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ title: '', questions: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/by-lesson/${lessonId}`);
                const q = res.data;
                setQuiz(q);
                setForm({
                    title: q.title,
                    max_attempts: q.max_attempts || 1,
                    passing_score: q.passing_score || 70,
                    questions: q.questions.map(q => ({
                        id: q.id,
                        question: q.question,
                        choices: [...q.choices],
                        choicesInput: q.choices.join(', '),
                        correct_answer: q.correct_answer
                    }))
                });
            } catch {
                setQuiz(null);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [lessonId]);

    useEffect(() => {
        if (creating) {
            setForm({
                title: '',
                max_attempts: 1,
                passing_score: 70,
                questions: [
                    {
                        id: Date.now(),
                        question: '',
                        choices: [],
                        choicesInput: '',
                        correct_answer: ''
                    }
                ]
            });
        }
    }, [creating]);

    const handleQuestionChange = (index, field, value) => {
        const updated = [...form.questions];
        updated[index][field] = value;

        if (field === "choicesInput") {
            updated[index]["choices"] = value
                .split(',')
                .map(c => c.trim())
                .filter(c => c.length > 0);
        }

        setForm({ ...form, questions: updated });
    };

    const handleAddQuestion = () => {
        setForm((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: Date.now(),
                    question: '',
                    choices: [],
                    choicesInput: '',
                    correct_answer: ''
                }
            ]
        }));
    };

    const handleRemoveQuestion = (index) => {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        for (let i = 0; i < form.questions.length; i++) {
            const q = form.questions[i];

            if (!q.question.trim()) {
                alert(`Question ${i + 1} is missing its text.`);
                return;
            }

            if (q.choices.length < 2) {
                alert(`Question ${i + 1} must have at least 2 choices.`);
                return;
            }

            if (!q.correct_answer.trim()) {
                alert(`Question ${i + 1} is missing the correct answer.`);
                return;
            }

            if (!q.choices.includes(q.correct_answer.trim())) {
                alert(`The correct answer for Question ${i + 1} must match one of the choices.`);
                return;
            }
        }

        try {
            if (quiz) {
                await api.put(`/quizzes/${quiz.quiz_id}`, form);
                alert("Quiz updated");
            } else {
                const payload = {
                    title: form.title,
                    lesson_id: parseInt(lessonId),
                    max_attempts: form.max_attempts,
                    passing_score: form.passing_score,
                    questions: form.questions.map(q => ({
                        question: q.question,
                        choices: q.choices,
                        correct_answer: q.correct_answer
                    }))
                };
                const res = await api.post("/quizzes", payload);
                alert("Quiz created");
                setQuiz({ quiz_id: res.data.quiz_id, title: form.title });
                setCreating(false);
            }
            setEditing(false);
        } catch {
            alert("Failed to save quiz");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;
        try {
            await api.delete(`/quizzes/${quiz.quiz_id}`);
            setQuiz(null);
            alert("Quiz deleted");
        } catch (err) {
            const msg = err.response?.data?.detail || "Failed to delete quiz";
            alert(`⚠️ ${msg}`);
        }
    };

    if (loading) return <p>Loading quiz...</p>;

    if (!quiz && !creating) {
        return (
            <div className="text-muted mt-4">
                <p>No quiz available for this lesson.</p>
                <button className="btn btn-outline-success" onClick={() => setCreating(true)}>
                    ➕ Create New Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h5>{quiz ? "📝 Edit Quiz" : "🆕 Create New Quiz"}</h5>

            <div className="mb-3">
                <label className="form-label">Quiz Title</label>
                <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    disabled={!editing && !creating}
                />
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Max Attempts</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.max_attempts}
                        onChange={(e) => setForm({ ...form, max_attempts: parseInt(e.target.value) || 1 })}
                        disabled={!editing && !creating}
                        min={1}
                        max={10}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Passing Score (%)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.passing_score}
                        onChange={(e) => setForm({ ...form, passing_score: parseInt(e.target.value) || 0 })}
                        disabled={!editing && !creating}
                        min={0}
                        max={100}
                    />
                </div>
            </div>

            {form.questions.map((q, i) => (
                <div key={i} className="mb-3 border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between">
                        <strong>Question {i + 1}</strong>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveQuestion(i)}
                            disabled={!editing && !creating}
                        >
                            Remove
                        </button>
                    </div>

                    <input
                        className="form-control my-2"
                        placeholder="Question text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(i, "question", e.target.value)}
                        disabled={!editing && !creating}
                    />

                    <input
                        className="form-control my-2"
                        placeholder="Choices (comma-separated)"
                        value={q.choicesInput || ''}
                        onChange={(e) => handleQuestionChange(i, "choicesInput", e.target.value)}
                        disabled={!editing && !creating}
                    />

                    <input
                        className="form-control"
                        placeholder="Correct answer"
                        value={q.correct_answer}
                        onChange={(e) => handleQuestionChange(i, "correct_answer", e.target.value)}
                        disabled={!editing && !creating}
                    />
                </div>
            ))}

            {(editing || creating) && (
                <button className="btn btn-outline-success mb-3" onClick={handleAddQuestion}>
                    ➕ Add Question
                </button>
            )}

            <div className="mt-3">
                {!editing && !creating ? (
                    <>
                        <button className="btn btn-outline-primary me-2" onClick={() => setEditing(true)}>
                            ✏️ Edit Quiz
                        </button>
                        <button className="btn btn-outline-danger me-2" onClick={handleDelete}>
                            🗑 Delete Quiz
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/quizzes/${quiz.quiz_id}/results`)}
                        >
                            📊 View Results
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-success me-2" onClick={handleSubmit}>
                            Save
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setEditing(false);
                                setCreating(false);
                                if (quiz) {
                                    setForm({
                                        title: quiz.title,
                                        max_attempts: quiz.max_attempts || 1,
                                        passing_score: quiz.passing_score || 70,
                                        questions: quiz.questions.map(q => ({
                                            ...q,
                                            choicesInput: q.choices?.join(', ')
                                        }))
                                    });
                                }
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}
                <button className="btn btn-outline-secondary float-end" onClick={() => navigate(-1)}>
                    ← Back
                </button>
            </div>
        </div>
    );
};

export default LessonQuizEditor;
