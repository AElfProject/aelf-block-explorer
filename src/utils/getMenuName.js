/**
 * @file getMenuName
 * @author zhouminghui
*/

export default function getMenuName(index) {
  switch (index) {
    case 0:
      return 'RAM';
    case 1:
      return 'CPU';
    case 2:
      return 'NET';
    case 3:
      return 'STO';
  }
}
