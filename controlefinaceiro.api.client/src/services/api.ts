import { Person, Category, Transaction } from '@/types';

const API_BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ${response.status}: ${errorBody || response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

// ─── Persons ─────────────────────────────────────────────
export const personsApi = {
  getAll: () => request<Person[]>('/persons'),
  getById: (id: string) => request<Person>(`/persons/${id}`),
  create: (data: Omit<Person, 'id'>) => request<Person>('/persons', { method: 'POST', body: JSON.stringify(data) }),
  update: (person: Person) => request<Person>(`/persons/${person.id}`, { method: 'PUT', body: JSON.stringify(person) }),
  delete: (id: string) => request<void>(`/persons/${id}`, { method: 'DELETE' }),
};

// ─── Categories ──────────────────────────────────────────
export const categoriesApi = {
  getAll: () => request<Category[]>('/categories'),
  getById: (id: string) => request<Category>(`/categories/${id}`),
  create: (data: Omit<Category, 'id'>) => request<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Transactions ────────────────────────────────────────
export const transactionsApi = {
  getAll: () => request<Transaction[]>('/transactions'),
  getById: (id: string) => request<Transaction>(`/transactions/${id}`),
  create: (data: Omit<Transaction, 'id'>) => request<Transaction>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
};
