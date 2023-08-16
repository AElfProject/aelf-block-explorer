/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 20:35:48
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-15 17:36:00
 * @Description: filter condition
 */
import { Dropdown, MenuProps } from 'antd';
import { TSearchValidator } from './type';
import IconFont from '@_components/IconFont';
import { memo, useContext } from 'react';
import { SearchContext } from './SearchProvider';
import { setFilterType } from './action';

function SearchSelect({ searchValidator }: { searchValidator?: TSearchValidator }) {
  console.log(11111);
  const { state, dispatch } = useContext(SearchContext);
  const { filterType } = state;
  if (!searchValidator || Object.keys(searchValidator).length === 0) {
    return null;
  }

  const items = searchValidator.map((ele) => ({ label: ele.label, key: ele.key }));

  const filterClickHandler: MenuProps['onClick'] = (obj) => {
    dispatch(setFilterType(searchValidator[obj.key]));
  };
  return (
    <Dropdown menu={{ items, onClick: filterClickHandler }}>
      <div className="filter-wrap">
        <span>{filterType.label}</span>
        <IconFont className="right-arrow" type="menu-down" />
      </div>
    </Dropdown>
  );
}

export default memo(SearchSelect);
