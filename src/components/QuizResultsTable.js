import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const QuizResultsTable = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResults = async () => {
            try {
                const res = await api.get(`/quizzes/${quizId}/results`);
                setResults(res.data);
            } catch {
                alert('Failed to load quiz results');
            } finally {
                setLoading(false);
            }
        };

        loadResults();
    }, [quizId]);

    if (loading) return <p>Loading quiz results...</p>;

    return (
        <div className="mt-4">
            <h5>📊 Quiz Results</h5>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <a
                    href={`/quizzes/${quizId}/results/export`}
                    className="btn btn-outline-success"
                    download
                >
                    📥 Export to CSV
                </a>
            </div>

            {results.length === 0 ? (
                <p className="text-muted">No student has submitted this quiz yet.</p>
            ) : (
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "25%" }}>Student</th>
                            <th>Score</th>
                            <th style={{ width: "25%" }}>Submitted</th>
                            <th>Selected Answers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, index) => (
                            <tr key={index}>
                                <td>{r.username} ({r.email})</td>
                                <td>{r.score}%</td>
                                <td>{new Date(r.submitted_at).toLocaleString()}</td>
                                <td>
                                    <ul className="mb-0">
                                        {Object.entries(r.selected_answers).map(([qid, ans]) => (
                                            <li key={qid}>Q{qid}: {ans}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default QuizResultsTable;
