import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SetBudgetPage.css';

const SetBudgetPage = () => {
    const [formData, setFormData] = useState({
        userId: '',
        category: '',
        amount: '',
        startDate: '',
        endDate: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                userId
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/setBudget', formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Set Budget</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                {/* Email input is removed */}
                <label>Category:</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required />

                <label>Amount:</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

                <label>Start Date:</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

                <label>End Date:</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

                <button type="submit">Set Budget</button>
            </form>
        </div>
    );
};

export default SetBudgetPage;
