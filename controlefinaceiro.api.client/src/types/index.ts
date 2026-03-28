export interface Person {
  id: string;
  name: string;
  age: number;
}

export type CategoryPurpose = 'despesa' | 'receita' | 'ambas';

export interface Category {
  id: string;
  description: string;
  purpose: CategoryPurpose;
}

export type TransactionType = 'despesa' | 'receita';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  personId: string;
}
