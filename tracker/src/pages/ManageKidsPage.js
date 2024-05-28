import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode library
import { useNavigate } from 'react-router-dom';

const ManageKidsPage = () => {
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                // Retrieve the token from local storage
                const token = localStorage.getItem('token');
                if (token) {
                    // Make an API call to get children based on the parent's email
                    const decodedToken = jwtDecode(token);
                    const userEmail = decodedToken.sub;
                    const response = await axios.get('http://localhost:8086/api/user/getChildren', {
                        params: { parentEmail: userEmail }
                    });
                    setChildren(response.data.children);
                    setLoading(false);
                } else {
                    console.log('Token not found in local storage');
                }
            } catch (error) {
                console.error('Error fetching children:', error);
            }
        };

        fetchChildren();
    }, []);

    const handleAnalyse = (childEmail) => {
        navigate('/analytics', { state: { childEmail } });
    };

    const handleSetBudget = (childEmail) => {
        navigate('/setbud', { state: { childEmail } });
    };

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">Manage Kids</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {children.map(child => (
                        <div key={child.id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Child Name: {child.username}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Child Email: {child.email}</h6>
                                <button className="btn btn-primary me-2" onClick={() => handleAnalyse(child.email)}>Analyse</button>
                                <button className="btn btn-success" onClick={() => handleSetBudget(child.email)}>Set Budget</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageKidsPage;
