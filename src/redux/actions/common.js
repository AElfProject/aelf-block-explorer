/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-11-04 17:19:32
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-04 18:44:44
 * @Description: file content
 */
export const setIsSmallScreen = (isSmallScreen) => ({
  type: "SET_IS_SMALL_SCREEN",
  payload: { isSmallScreen },
});
export const setPriceAndHistoryPrice = (price, previousPrice) => {
  return {
    type: "SET_PRICE_HISTORYPRICE",
    payload: { price, previousPrice },
  };
};
