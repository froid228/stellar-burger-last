import { configureStore } from '@reduxjs/toolkit';
import { ingredientReducer } from './slices/ingredientSlice/ingredientSlice';
import { userReducer } from './slices/userSlice/userSlice';
import { orderReducer } from './slices/orderSlice/orderSlice';
import { feedReducer } from './slices/feedSlice/feedSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const store = configureStore({
  reducer: {
    ingredients: ingredientReducer,
    user: userReducer,
    order: orderReducer,
    feed: feedReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
