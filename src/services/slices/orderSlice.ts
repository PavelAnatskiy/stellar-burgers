import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  viewedOrder: TOrder | null;
  viewedOrderLoading: boolean;
  viewedOrderError: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  viewedOrder: null,
  viewedOrderLoading: false,
  viewedOrderError: null,
};

export const createOrder = createAsyncThunk('order/createOrder', orderBurgerApi);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  getOrderByNumberApi
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось создать заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.viewedOrderLoading = true;
        state.viewedOrderError = null;
        state.viewedOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.viewedOrderLoading = false;
        state.viewedOrder = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.viewedOrderLoading = false;
        state.viewedOrderError = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearOrderModalData } = orderSlice.actions;

export default orderSlice.reducer;
