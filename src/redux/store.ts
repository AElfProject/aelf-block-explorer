import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import smallScreenReducer from './features/smallScreen/isSmallScreen';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    smallScreen: smallScreenReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
