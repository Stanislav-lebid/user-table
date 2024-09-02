import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { fetchUsers, filterUsers } from './userSlice';
import { debounce } from 'lodash';
import { User } from './userTypes';


const UserTable: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.filteredUsers);
  const loading = useSelector((state: RootState) => state.users.loading);
  const dispatch = useDispatch();

  // Окремі стани для кожного поля введення
  const [nameSearch, setNameSearch] = useState('');
  const [usernameSearch, setUsernameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const debouncedFilter = useMemo(() =>
    debounce((key: keyof User, value: string) => {
      dispatch(filterUsers({ key, value }));
    }, 300), [dispatch]
  );

  const handleFilter = (key: keyof User, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
    setValue(value); // Оновлюємо локальний стан для відображення у відповідному полі вводу
    debouncedFilter(key, value); // Викликаємо debounce функцію
  };

  return (
    <div className="table-container">
      <input
        type="text"
        placeholder="Search by name"
        value={nameSearch}
        onChange={(e) => handleFilter('name', e.target.value, setNameSearch)}
      />
      <input
        type="text"
        placeholder="Search by username"
        value={usernameSearch}
        onChange={(e) => handleFilter('username', e.target.value, setUsernameSearch)}
      />
      <input
        type="text"
        placeholder="Search by email"
        value={emailSearch}
        onChange={(e) => handleFilter('email', e.target.value, setEmailSearch)}
      />
      <input
        type="text"
        placeholder="Search by phone"
        value={phoneSearch}
        onChange={(e) => handleFilter('phone', e.target.value, setPhoneSearch)}
      />

      {loading ? (
        <div className="loader"></div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-results">Nothing found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
