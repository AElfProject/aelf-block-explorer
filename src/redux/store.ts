import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import smallScreenReducer from './features/smallScreen/isSmallScreen';
import commonReducer from './features/proposal/common';
import organizationsReducer from './features/proposal/organizationList';
import proposalsReducer from './features/proposal/proposalList';
import proposalSelectReducer from './features/proposal/proposalSelectList';
import proposalModifyReducer from './features/proposal/proposalModify';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    smallScreen: smallScreenReducer,
    common: commonReducer,
    organizations: organizationsReducer,
    proposals: proposalsReducer,
    proposalSelect: proposalSelectReducer,
    proposalModify: proposalModifyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
