import React from 'react';
import { 
  Pane, 
  Heading, 
  Button, 
  TabNavigation, 
  Tab, 
  Position, 
  Popover, 
  Menu, 
  Avatar
} from 'evergreen-ui';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Pane height="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Pane 
        elevation={1}
        padding={16}
        background="white"
        borderBottom
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading size={600} onClick={() => navigate('/users')} cursor="pointer">
          User Management System
        </Heading>
        
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item intent="danger" onSelect={handleLogout}>
                  Log Out
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <Button appearance="minimal" display="flex" alignItems="center">
            <Avatar name={user.username || 'User'} size={30} marginRight={8} />
            {user.username || 'User'}
          </Button>
        </Popover>
      </Pane>
      
      {/* Navigation */}
      <Pane 
        padding={8} 
        background="tint1" 
        borderBottom 
        display="flex" 
        alignItems="center"
      >
        <TabNavigation>
          <Tab
            is="a"
            href="#"
            isSelected={isActive('/users')}
            onSelect={() => navigate('/users')}
          >
            Users List
          </Tab>
          <Tab
            is="a"
            href="#"
            isSelected={isActive('/users/add')}
            onSelect={() => navigate('/users/add')}
          >
            Add User
          </Tab>
        </TabNavigation>
      </Pane>
      
      {/* Content */}
      <Pane flex={1} overflowY="auto" background="tint2">
        {children}
      </Pane>
      
      {/* Footer */}
      <Pane 
        padding={16} 
        borderTop 
        background="white" 
        display="flex" 
        justifyContent="center"
      >
        <Heading size={300} color="muted">
          © 2025 User Management System. All rights reserved.
        </Heading>
      </Pane>
    </Pane>
  );
};

export default Layout;