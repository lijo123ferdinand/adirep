import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const ManageKidsPage = () => {
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [salary, setSalary] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
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

    const handleAddSalary = (child) => {
        setSelectedChild(child);
        setShowModal(true);
    };

    const handleSaveSalary = async () => {
        try {
            await axios.post('http://localhost:8086/api/user/addSalary', {
                email: selectedChild.email,
                amount: parseFloat(salary)
            });
            setShowModal(false);
            setSalary('');
            setSelectedChild(null);
            // Optionally, you can refetch the children data to update the UI
        } catch (error) {
            console.error('Error adding salary:', error);
        }
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
                                <button className="btn btn-success me-2" onClick={() => handleSetBudget(child.email)}>Set Budget</button>
                                <button className="btn btn-warning" onClick={() => handleAddSalary(child)}>Add Salary</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Salary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSalary">
                            <Form.Label>Salary Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter salary amount"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveSalary}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageKidsPage;
