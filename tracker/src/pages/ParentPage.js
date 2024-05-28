import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ParentPage = () => {
    const [childName, setChildName] = useState('');
    const [childEmail, setChildEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();
    const parentEmail = location.state.userEmail;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8086/api/user/createChildAccount', {
                parentEmail: parentEmail,
                childUsername: childName,
                childEmail: childEmail,
                childPassword: password,
                initialBalance: 0 // You can set initial balance if needed
            });
            console.log(response.data); // Log the response
            // Handle success, maybe redirect or show a success message
        } catch (error) {
            console.error('Error creating child account:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('Failed to create child account. Please try again later.');
            }
        }
    };

    return (
        <div>
            <h1>Create Child Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="childName">Child Name:</label>
                    <input
                        type="text"
                        id="childName"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="childEmail">Child Email:</label>
                    <input
                        type="email"
                        id="childEmail"
                        value={childEmail}
                        onChange={(e) => setChildEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Child Account</button>
            </form>
        </div>
    );
};

export default ParentPage;
