import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/ParentPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
const ParentPage = () => {
    const [childName, setChildName] = useState('');
    const [childEmail, setChildEmail] = useState('');
    const [password, setPassword] = useState('');
    const [initialBalance, setInitialBalance] = useState(0);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup visibility
    const location = useLocation();
    const navigate = useNavigate();

    const parentEmail = location.state.userEmail;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8086/api/user/createChildAccount', {
                parentEmail: parentEmail,
                childUsername: childName,
                childEmail: childEmail,
                childPassword: password,
                initialBalance: initialBalance
            });
            console.log(response.data);
            setShowSuccessPopup(true); // Show success popup
        } catch (error) {
            console.error('Error creating child account:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('Failed to create child account. Please try again later.');
            }
        }
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate('/managekids')
        // Optionally, clear the form fields or redirect the user
    };

    return (
        <div className="parent-page-container">
            <h1>Create Child Account</h1>
            <form onSubmit={handleSubmit} className="parent-form">
                <div className="form-group">
                    <label htmlFor="childName">Child Name:</label>
                    <input
                        type="text"
                        id="childName"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="childEmail">Child Email:</label>
                    <input
                        type="email"
                        id="childEmail"
                        value={childEmail}
                        onChange={(e) => setChildEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="initialBalance">Initial Balance:</label>
                    <input
                        type="number"
                        id="initialBalance"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(parseFloat(e.target.value))}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Child Account</button>
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
                                <p>Child account created successfully!</p>
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

export default ParentPage;
