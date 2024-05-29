import React, { useState, useEffect } from 'react';
import DeleteExpense from './DeleteExpense';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected the import for jwtDecode
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css'; // Import custom styles

function UserProfile({ updateTransactions }) {
    const [username, setUsername] = useState('');
    const [balance, setBalance] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        console.log('Balance:', balance);
    }, [balance]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken.sub;
            setUserEmail(userEmail);
            const response = await axios.get('http://localhost:8086/api/user/info', {
                params: {
                    email: userEmail
                }
            });
            setUsername(response.data.username);
            setBalance(response.data.balance);
            setUserType(response.data.usertype);
            setTransactions(response.data.expenses.reverse() || []);

            // Redirect if user type is 'child'
            if (response.data.usertype === 'child') {
                setTimeout(() => {
                    navigate('/child');
                }, 500); // Redirect after 3 seconds
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleDeleteExpense = (transactionId) => {
        const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
        setTransactions(updatedTransactions);
        updateTransactions(updatedTransactions);
    };

    const handleCreateChildAccount = () => {
        navigate('/parent', { state: { userEmail } });
    };

    return (
        <div className="container py-4">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h2 className="card-title">Hi {username}</h2>
                    <div className="mb-4">
                        <h3 className="font-weight-bold">Total amount available: <span className="text-muted">₹{balance}</span></h3>
                        <h3 className="font-weight-bold">User Type: <span className="text-muted">{userType}</span></h3>
                        {userType === 'parent' && (
                            <button className="btn btn-primary mt-2" onClick={handleCreateChildAccount}>Create Child Account</button>
                        )}
                    </div>
                    <h3 className="font-weight-bold">Transactions</h3>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-left">Category</th>
                                    <th className="text-left">Amount</th>
                                    <th className="text-left">Expense Date</th>
                                    <th className="text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.category}</td>
                                        <td>₹ {transaction.amount}</td>
                                        <td>{new Date(transaction.expenseDate).toLocaleDateString()}</td>
                                        <td>
                                            <DeleteExpense
                                                transactionId={transaction.id}
                                                userEmail={userEmail}
                                                onDelete={handleDeleteExpense}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
