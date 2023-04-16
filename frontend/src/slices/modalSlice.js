/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalReducer = createSlice({
  name: 'modal',
  initialState: { isOpened: false, type: null },
  reducers: {
    openModal(state, { payload }) {
      const { type, info } = payload;
      state.isOpened = true;
      state.type = type;
      state.info = info ?? null;
    },
    closeModal(state) {
      state.isOpened = false;
      state.type = null;
      state.info = null;
    },
  },
});

export const {
  openModal, closeModal,
} = modalReducer.actions;

export default modalReducer.reducer;
