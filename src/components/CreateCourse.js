import React, { useState } from 'react';
import api from '../services/api';

const CreateCourse = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', { title, description });
      alert('Course created!');
      setTitle('');
      setDescription('');
      if (onCreated) onCreated(); // refresh course list if needed
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create course');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>Create a New Course</h4>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Course title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Course description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-success">Create</button>
    </form>
  );
};

export default CreateCourse;
