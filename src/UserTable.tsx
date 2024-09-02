import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { filterUsers } from './userSlice';
import { User } from './userTypes'; // Убедитесь, что путь корректный

const UserTable: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.filteredUsers);
  const dispatch = useDispatch();

  const handleFilter = (key: keyof User, value: string) => {
    dispatch(filterUsers({ key, value }));
  };

  const handleNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilter('name', e.target.value);
  };

  const handleUsernameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilter('username', e.target.value);
  };

  const handleEmailFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilter('email', e.target.value);
  };

  const handlePhoneFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilter('phone', e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        onChange={handleNameFilter}
      />
      <input
        type="text"
        placeholder="Search by username"
        onChange={handleUsernameFilter}
      />
      <input
        type="text"
        placeholder="Search by email"
        onChange={handleEmailFilter}
      />
      <input
        type="text"
        placeholder="Search by phone"
        onChange={handlePhoneFilter}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
