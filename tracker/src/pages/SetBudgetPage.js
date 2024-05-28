import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SetBudgetPage.css';

const SetBudgetPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        category: '',
        amount: '',
        startDate: '',
        endDate: ''
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8086/api/user/setBudget', formData);
            alert('Signup successful!');
            setIsSuccess(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error setting budget');
            setIsSuccess(false);
        }
    };

    return (
        <div className="set-budget-container">
            <h1>Set Budget</h1>
            {message && <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Category:</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <label>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />

                <label>Start Date:</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />

                <label>End Date:</label>
                <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Set Budget</button>
            </form>
        </div>
    );
};

export default SetBudgetPage;
