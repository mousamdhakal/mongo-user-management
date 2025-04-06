import React, { useState } from 'react';
import { 
  Button, 
  TextInputField, 
  Pane, 
  Heading, 
  Card, 
  toaster,
  TextareaField,
  Select
} from 'evergreen-ui';
import { userAPI } from '../api/axios'; // Import from our central API file
import { useNavigate } from 'react-router-dom';
import Layout from '../pages/Layout';

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    email: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await userAPI.create(formData);
      
      toaster.success('User created successfully!');
      navigate('/users');
    } catch (error) {
      toaster.danger('Failed to create user. Please try again.');
      console.error('Create user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Pane maxWidth={800} marginX="auto" marginY="0" padding={24}>
        <Card elevation={1} background="white" padding={24} marginY={16}>
          <Heading size={700} marginBottom={24}>Add New User</Heading>
          
          <form onSubmit={handleSubmit}>
            <Pane display="flex" gap={16}>
              <TextInputField
                flex={1}
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              
              <TextInputField
                flex={1}
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Pane>
            
            <TextInputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            
            <TextInputField
              label="Address Line 1"
              name="address1"
              placeholder="Enter primary address"
              value={formData.address1}
              onChange={handleChange}
              required
            />
            
            <TextInputField
              label="Address Line 2"
              name="address2"
              placeholder="Enter secondary address (optional)"
              value={formData.address2}
              onChange={handleChange}
            />
            
            <Pane display="flex" gap={16}>
              <TextInputField
                flex={2}
                label="City"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              
              <TextInputField
                flex={1}
                label="Postal Code"
                name="postalCode"
                placeholder="Enter postal code"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </Pane>
            
            <TextInputField
              label="Country"
              name="country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
              required
            />
            
            <Pane display="flex" gap={16}>
              <TextInputField
                flex={1}
                label="Phone Number"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              
              <TextInputField
                flex={1}
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Pane>
            
            <TextareaField
              label="Notes"
              name="notes"
              placeholder="Enter any additional notes about this user"
              value={formData.notes}
              onChange={handleChange}
            />
            
            <Pane display="flex" justifyContent="flex-end" marginTop={24}>
              <Button 
                appearance="primary" 
                intent="success" 
                isLoading={loading}
                type="submit" 
                marginRight={16}
              >
                Create User
              </Button>
              
              <Button 
                appearance="minimal" 
                onClick={() => navigate('/users')}
              >
                Cancel
              </Button>
            </Pane>
          </form>
        </Card>
      </Pane>
    </Layout>
  );
};

export default AddUser;