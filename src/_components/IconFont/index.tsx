/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:00:33
 * @Description: iconfont
 */
import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';
// const createFromIconfontCN = Icons.createFromIconfontCN;
const ICON_FONT_URL = 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_23.cbf4baed5c9f4a3595ca98c7424a383a.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
