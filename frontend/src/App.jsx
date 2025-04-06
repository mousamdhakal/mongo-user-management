import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Authentication guard
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersList />
              </PrivateRoute>
            }
          />

          <Route
            path="/users/add"
            element={
              <PrivateRoute>
                <AddUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/users/edit/:id"
            element={
              <PrivateRoute>
                <UpdateUser />
              </PrivateRoute>
            }
          />

          {/* Redirect root to users list or login */}
          <Route path="/" element={<Navigate to="/users" replace />} />

          {/* Catch all other routes and redirect to users */}
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
