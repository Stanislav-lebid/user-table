import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUsers } from './userSlice';
import UserTable from './UserTable';
import './App.css';


const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <h1>User Management</h1>
      <UserTable />
    </div>
  );
};

export default App;
