import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode'; // Ensure this import is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

const SetBudgetPage = () => {
    const location = useLocation();
    const { childEmail } = location.state || {}; // Destructure childEmail from location state
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: '', // userId will be set on the backend
        email: childEmail || '',
        category: '',
        amount: '',
        startDate: '',
        endDate: ''
    });
    const [message, setMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup visibility

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
            setShowSuccessPopup(true); // Show success popup
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        setMessage('');
        navigate('/managekids')
        // Optionally clear the message
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

            {/* Success Popup Modal */}
            {showSuccessPopup && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Success</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleClosePopup}></button>
                            </div>
                            <div className="modal-body">
                                <p>Budget set successfully!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleClosePopup}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetBudgetPage;
