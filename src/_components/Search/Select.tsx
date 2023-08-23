/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 20:35:48
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 14:41:44
 * @Description: filter condition
 */
import { Dropdown, MenuProps } from 'antd';
import { TSearchValidator } from './type';
import IconFont from '@_components/IconFont';
import { ReactElement, cloneElement, memo } from 'react';
import { useSearchContext } from './SearchProvider';
import { setFilterType } from './action';

function SearchSelect({ searchValidator }: { searchValidator?: TSearchValidator }) {
  const { state, dispatch } = useSearchContext();
  const { filterType } = state;

  if (!searchValidator || Object.keys(searchValidator).length === 0) {
    return null;
  }

  const items = searchValidator.map((ele) => ({ label: ele.label, key: ele.key }));

  const filterClickHandler: MenuProps['onClick'] = (obj) => {
    dispatch(setFilterType(searchValidator[obj.key]));
  };
  return (
    <Dropdown
      // open={true}
      trigger={['click']}
      menu={{ items, onClick: filterClickHandler, selectable: true, defaultSelectedKeys: ['0'] }}
      dropdownRender={(menu) => (
        <div>
          {cloneElement(menu as ReactElement, { className: '!shadow-search !w-[114px] !p-2 !-ml-4 !mt-[9px]' })}
        </div>
      )}>
      <div className="filter-wrap">
        <span>{filterType?.label}</span>
        <IconFont className="right-arrow" type="Down" />
      </div>
    </Dropdown>
  );
}

export default memo(SearchSelect);
