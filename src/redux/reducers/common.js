/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-11-04 17:12:43
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-04 18:36:13
 * @Description: file content
 */
// todo: Consider to save isSmallScreen as a global variable instead of saving in redux
const initialState = {
  isSmallScreen: false,
};

const common = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_IS_SMALL_SCREEN':
      return { ...state, isSmallScreen: payload.isSmallScreen };
    default:
      return state;
  }
};

export default common;
