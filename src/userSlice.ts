import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Оголошуємо тип користувача
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

// Структура стану Redux slice
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

// Асинхронний thunk для отримання користувачів
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data as User[];
});

// Створення Redux slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    filterUsers: (state, action: PayloadAction<{ key: keyof User; value: string }>) => {
      const { key, value } = action.payload;
      state.filteredUsers = state.users.filter(user => {
        const userValue = user[key];
        // Перевірка типу перед викликом toLowerCase
        if (typeof userValue === 'string') {
          return userValue.toLowerCase().includes(value.toLowerCase());
        }
        if (typeof userValue === 'number') {
          return userValue.toString().includes(value); // Перетворюємо число на рядок
        }
        return false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true; // Встановлюємо loading в true при початку запиту
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false; // Встановлюємо loading в false при успішному завершенні запиту
        state.status = 'succeeded';
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false; // Встановлюємо loading в false при неуспішному завершенні запиту
        state.status = 'failed';
      });
  },
});

// Експорт дій та редюсера
export const { filterUsers } = userSlice.actions;
export default userSlice.reducer;
