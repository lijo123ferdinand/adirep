import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

function AddExpenseModal({ show, handleClose, handleSave }) {
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({
      ...expense,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseAmount = parseFloat(expense.amount);
      if (expenseAmount <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Expense amount must be greater than 0.',
        });
        return;
      }
      
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.sub;

      const response = await axios.post('http://localhost:8086/api/user/expenses', {
        email: userEmail, 
        category: expense.category,
        amount: expenseAmount,
      });

      console.log('Expense added successfully');
      console.log(response.data);

      // Call handleSave to update the parent component
      handleSave(expense);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Expense added successfully!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        handleClose();
        window.location.reload(); // Refresh the page after successful expense addition
      });
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === "Expense exceeds budget limit") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Expense exceeds budget limit.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Insufficient Balance.',
        });
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formExpenseCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter expense category"
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formExpenseAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddExpenseModal;
