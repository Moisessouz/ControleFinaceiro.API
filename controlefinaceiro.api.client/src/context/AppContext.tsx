import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Person, Category, Transaction } from '@/types';
import { personsApi, categoriesApi, transactionsApi } from '@/services/api';
import { toast } from 'sonner';

interface AppContextType {
  persons: Person[];
  categories: Category[];
  transactions: Transaction[];
  loading: boolean;
  addPerson: (p: Omit<Person, 'id'>) => Promise<void>;
  updatePerson: (p: Person) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  addCategory: (c: Omit<Category, 'id'>) => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c, t] = await Promise.all([
        personsApi.getAll(),
        categoriesApi.getAll(),
        transactionsApi.getAll(),
      ]);
      setPersons(p);
      setCategories(c);
      setTransactions(t);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Falha ao conectar com o servidor. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addPerson = useCallback(async (p: Omit<Person, 'id'>) => {
    const created = await personsApi.create(p);
    setPersons(prev => [...prev, created]);
  }, []);

  const updatePerson = useCallback(async (p: Person) => {
    const updated = await personsApi.update(p);
    setPersons(prev => prev.map(x => x.id === updated.id ? updated : x));
  }, []);

  const deletePerson = useCallback(async (id: string) => {
    await personsApi.delete(id);
    setPersons(prev => prev.filter(x => x.id !== id));
    setTransactions(prev => prev.filter(t => t.personId !== id));
  }, []);

  const addCategory = useCallback(async (c: Omit<Category, 'id'>) => {
    const created = await categoriesApi.create(c);
    setCategories(prev => [...prev, created]);
  }, []);

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id'>) => {
    const created = await transactionsApi.create(t);
    setTransactions(prev => [...prev, created]);
  }, []);

  return (
    <AppContext.Provider value={{ persons, categories, transactions, loading, addPerson, updatePerson, deletePerson, addCategory, addTransaction, refresh }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
