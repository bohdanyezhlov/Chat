import { useContext } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AuthContext, SocketContext } from '../contexts';
import type { AppDispatch, RootState } from '../slices';

export const useAuth = () => useContext(AuthContext);

export const useSocket = () => useContext(SocketContext);

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
