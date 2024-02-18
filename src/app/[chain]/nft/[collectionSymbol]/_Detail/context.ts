import { createContext } from 'react';
import { ITableSearch } from './type';

export const SearchContext = createContext<ITableSearch>({
  value: '',
  onSearchChange: () => {},
});
