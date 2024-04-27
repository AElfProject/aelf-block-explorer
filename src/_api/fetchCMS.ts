import request from '@_api';
export async function fetchCMS() {
  const result = await request.cms.getGlobalConfig();
  const { data } = result;
  const headerMenuList = data.headerMenuList.filter((item) => {
    if (item.headerMenu_id.path === 'blockchain') {
      item.headerMenu_id.children = item.headerMenu_id.children.filter((child) => {
        return child.label === 'Blocks';
      });
    }
    return item.headerMenu_id?.path === 'blockchain' || item.headerMenu_id?.path === '/tokens';
  });
  data.headerMenuList = headerMenuList;
  return data;
}
