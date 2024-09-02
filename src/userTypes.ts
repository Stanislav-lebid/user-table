// Опис структури даних для користувача
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
  }
  
  // Структура стану (state) Redux slice
  export interface UserState {
    users: User[];          // Список всіх користувачів
    filteredUsers: User[];  // Список відфільтрованих користувачів
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Статус завантаження
  }
  
  // Типи для параметрів фільтрації користувачів
  export interface FilterPayload {
    key: keyof User;  // Ключ, за яким буде здійснюватися фільтрація (name, username, email, phone)
    value: string;    // Значення для фільтрації
  }
  