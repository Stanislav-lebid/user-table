import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface UserState {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  users: [],
  filteredUsers: [],
  loading: false,
  status: 'idle',
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data as User[];
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    filterUsers: (state, action: PayloadAction<{ key: keyof User; value: string }>) => {
      const { key, value } = action.payload;
      state.filteredUsers = state.users.filter(user => {
        const userValue = user[key];
        if (typeof userValue === 'string') {
          return userValue.toLowerCase().includes(value.toLowerCase());
        }
        if (typeof userValue === 'number') {
          return userValue.toString().includes(value);
        }
        return false;
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.status = 'failed';
      });
  },
});

export const { filterUsers, setLoading } = userSlice.actions;
export default userSlice.reducer;
