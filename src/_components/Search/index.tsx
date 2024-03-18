/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 00:15:47
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:02:54
 * @Description: root of search component
 */
import { SearchContextProvider } from './SearchProvider';
import { ISearchProps } from './type';
import SearchBox from './SearchBox';

const propDefaults = {
  placeholder: '',
  searchIcon: false,
  searchButton: true,
  enterIcon: false,
  deleteIcon: true,
  isMobile: false,
  lightMode: false,
};
export default function Search(props: ISearchProps) {
  const componentProps = { ...propDefaults, ...props };
  return (
    <SearchContextProvider validator={props.searchValidator}>
      <SearchBox {...componentProps} />
    </SearchContextProvider>
  );
}
