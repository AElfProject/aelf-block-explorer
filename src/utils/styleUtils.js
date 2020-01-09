/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2020-01-08 14:43:49
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2020-01-08 15:04:28
 * @Description: file content
 */
// Used to get magnetic value.
// 用于获取磁吸后的值，可用于Slider滑块组件
export function getMagneticValue(value, magnetDots) {
  if (!magnetDots) {
    return 0;
  }
  const max = magnetDots[magnetDots.length - 1];
  const megnetRange = max / 50;
  for (let i = 0; i < magnetDots.length; i++) {
    if (Math.abs(value - magnetDots[i]) < megnetRange) {
      return magnetDots[i];
    }
  }
  return value;
}
