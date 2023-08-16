/*
 * @Author: aelf-lxy
 * @Date: 2023-08-11 00:15:47
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-16 14:02:27
 * @Description: root of search component
 */
import { SearchContextProvider } from './SearchProvider';
import { ISearchProps } from './type';
import SearchBox from './SearchBox';

const propDefaults = {
  placeholder: '',
};

export default function Search(props: ISearchProps) {
  const componentProps = { ...propDefaults, ...props };
  return (
    <SearchContextProvider validator={props.searchValidator}>
      <SearchBox {...componentProps} />
    </SearchContextProvider>
  );
}
