/*
 * @Date: 2023-08-14 14:46:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:40:31
 * @Description: iconfont
 */
import createFromIconfontCN from '@ant-design/icons/lib/components/IconFont';
// const createFromIconfontCN = Icons.createFromIconfontCN;
const ICON_FONT_URL = 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_27664_67.1df6a5614a779fa65bee62a1d05089a2.js';

const IconFont = createFromIconfontCN({
  scriptUrl: ICON_FONT_URL,
});
export default IconFont;
