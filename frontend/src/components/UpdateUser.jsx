import React, { useState, useEffect } from "react";
import {
  Button,
  TextInputField,
  Pane,
  Heading,
  Card,
  toaster,
  TextareaField,
  Dialog,
  Spinner,
} from "evergreen-ui";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../pages/Layout";
import { userAPI } from "../api/axios";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getById(id);

        // Convert date format for the date input
        const user = response.data;
        if (user.dateOfBirth) {
          const dateObj = new Date(user.dateOfBirth);
          user.dateOfBirth = dateObj.toISOString().split("T")[0];
        }

        setFormData(user);
      } catch (error) {
        toaster.danger("Failed to load user data");
        console.error("Load user error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userAPI.update(id, formData);

      toaster.success("User updated successfully!");
      navigate("/users");
    } catch (error) {
      toaster.danger("Failed to update user. Please try again.");
      console.error("Update user error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await userAPI.delete(id);

      toaster.success("User deleted successfully!");
      navigate("/users");
    } catch (error) {
      toaster.danger("Failed to delete user. Please try again.");
      console.error("Delete user error:", error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="80vh"
        >
          <Spinner />
        </Pane>
      </Layout>
    );
  }

  return (
    <Layout>
      <Pane maxWidth={800} marginY="0" marginX="auto" padding={24}>
        <Card elevation={1} background="white" padding={24} marginY={16}>
          <Pane
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={24}
          >
            <Heading size={700}>Update User</Heading>
            <Button
              appearance="primary"
              intent="danger"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete User
            </Button>
          </Pane>

          <form onSubmit={handleUpdate}>
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
                isLoading={saving}
                type="submit"
                marginRight={16}
              >
                Update User
              </Button>

              <Button appearance="minimal" onClick={() => navigate("/users")}>
                Cancel
              </Button>
            </Pane>
          </form>
        </Card>
      </Pane>

      <Dialog
        isShown={showDeleteDialog}
        title="Confirm Deletion"
        intent="danger"
        onCloseComplete={() => setShowDeleteDialog(false)}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this user? This action cannot be undone.
      </Dialog>
    </Layout>
  );
};

export default UpdateUser;
