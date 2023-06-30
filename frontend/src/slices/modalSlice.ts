/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ModalState } from '../types';

interface OpenModal {
  type: string;
  info?: number;
}

const initialState: ModalState = {
  isOpened: false,
  type: null,
  info: null,
};

const modalReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<OpenModal>) {
      const { type, info } = action.payload;
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

export const { openModal, closeModal } = modalReducer.actions;

export default modalReducer.reducer;
