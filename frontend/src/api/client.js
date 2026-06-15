import axios from 'axios';

// В Docker VITE_API_URL пустой — запросы идут через Nginx (относительные пути)
// Локально VITE_API_URL должен быть http://localhost:8000 (или 8002)
const API_BASE = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function submitContact(data) {
  const response = await client.post('/api/contacts/', data);
  return response.data;
}

export function getApiBase() {
  return API_BASE;
}

export default client;