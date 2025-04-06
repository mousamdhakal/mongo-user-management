import React, { useState, useEffect, useCallback } from 'react';
import { 
  Pane, 
  Heading, 
  Button, 
  SearchInput, 
  Spinner, 
  toaster,
  Badge
} from 'evergreen-ui';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../pages/Layout';
import { userAPI } from '../api/axios';

const UsersList = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userAPI.getAll();
      console.log('response', response);
      setRowData(response.data);
    } catch (error) {
      toaster.danger('Failed to load users');
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const dateFormatter = (params) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    return date.toLocaleDateString();
  };

  const onRowClick = (event) => {
    navigate(`/users/edit/${event.data._id}`);
  };

  console.log('rowData', rowData);

  const filteredData = searchTerm.trim() ? 
    rowData.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : 
    rowData;

  const [columnDefs] = useState([
    { 
      headerName: 'Name', 
      field: 'fullName',
      valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      flex: 1,
      filter: true
    },
    { 
      headerName: 'Email', 
      field: 'email', 
      flex: 1,
      filter: true
    },
    { 
      headerName: 'Phone', 
      field: 'phoneNumber', 
      flex: 1
    },
    { 
      headerName: 'City', 
      field: 'city', 
      flex: 1,
      filter: true
    },
    { 
      headerName: 'Country', 
      field: 'country', 
      flex: 1,
      filter: true
    },
    { 
      headerName: 'Date of Birth', 
      field: 'dateOfBirth', 
      flex: 1,
      valueFormatter: dateFormatter
    },
    {
      headerName: 'Actions',
      cellRenderer: (params) => {
        return (
          <Button 
            size="small" 
            appearance="primary" 
            intent="success" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/users/edit/${params.data._id}`);
            }}
          >
            Edit
          </Button>
        );
      },
      width: 100,
      sortable: false,
      filter: false
    }
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true
  };

  return (
    <Layout>
      <Pane padding={24}>
        <Pane display="flex" justifyContent="space-between" alignItems="center" marginBottom={24}>
          <Heading size={700}>Users Management</Heading>
          <Button 
            appearance="primary" 
            intent="success" 
            iconBefore="plus"
            onClick={() => navigate('/users/add')}
          >
            Add New User
          </Button>
        </Pane>
        
        <Pane display="flex" alignItems="center" marginBottom={16}>
          <SearchInput
            placeholder="Search users..."
            width={300}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            marginRight={16}
          />
          <Badge>{filteredData.length} users</Badge>
        </Pane>
        
        {loading ? (
          <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
            <Spinner />
          </Pane>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              onRowClicked={onRowClick}
              animateRows={true}
              rowSelection={{ mode: 'singleRow' }}
            />
          </div>
        )}
      </Pane>
    </Layout>
  );
};

export default UsersList;