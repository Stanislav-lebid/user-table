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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  filteredUsers: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      return response.data as User[];
    } catch (error) {
      return rejectWithValue('Не вдалося отримати користувачів');
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
        state.filteredUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Не вдалося отримати користувачів';
      });
  },
});

export const { filterUsers } = userSlice.actions;
export default userSlice.reducer;
