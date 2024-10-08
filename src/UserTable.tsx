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
      dispatch({ type: 'users/setLoading', payload: false });
    }, 300), [dispatch]
  );

  const handleFilter = (key: keyof User, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
    setValue(value);
    dispatch({ type: 'users/setLoading', payload: true });
    debouncedFilter(key, value);
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
        <>
          {/* Плашка з кількістю знайдених записів */}
          <div className="results-info">
            {users.length > 0 ? (
              <span>{`Знайдено записів: ${users.length}`}</span>
            ) : (
              <span>Нічого не знайдено</span>
            )}
          </div>

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
        </>
      )}
    </div>
  );
};

export default UserTable;

