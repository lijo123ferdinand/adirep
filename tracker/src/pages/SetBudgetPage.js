import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure this import is correct

const SetBudgetPage = () => {
    const location = useLocation();
    const { childEmail } = location.state || {}; // Destructure childEmail from location state

    const [formData, setFormData] = useState({
        userId: '', // userId will be set on the backend
        email: childEmail || '',
        category: '',
        amount: '',
        startDate: '',
        endDate: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && childEmail) {
            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken.sub;
            setFormData((prevData) => ({
                ...prevData,
                email: childEmail,
                userId: userEmail // Assuming userId is derived from the parent's email
            }));
        }
    }, [childEmail]);

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
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="container">
            <h1 className="mt-4">Set Budget</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category:</label>
                    <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount:</label>
                    <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">End Date:</label>
                    <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" required />
                </div>

                <button type="submit" className="btn btn-primary">Set Budget</button>
            </form>
        </div>
    );
};

export default SetBudgetPage;
