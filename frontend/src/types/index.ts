import { CombinedState } from '@reduxjs/toolkit';

export type ChildrenProps = {
  children: React.ReactNode;
};

export interface SocketResponseType {
  status: 'ok' | 'error';
}

export interface AuthType {
  user: {
    username: string;
  } | null;
  logIn: (userData: UserData) => void;
  logOut: () => void;
  getAuthHeader: () => Record<string, string>;
}

export interface AddProps {
  handleClose: () => void;
}

export interface RenameProps {
  handleClose: () => void;
}

export interface RemoveProps {
  handleClose: () => void;
}

export interface ChannelProps {
  channel: Channel;
  isActive: boolean;
  handleSetCurrentChannel: (id: number) => () => void;
  handleRemoveChannel: (id: number) => () => void;
  handleRenameChannel: (id: number) => () => void;
}

export interface EnterNewMessageProps {
  channelId: number;
}

export interface Message {
  id: number;
  body: string;
  channelId: number;
  username: string;
  createdAt: string;
}

export interface MessageProps {
  message: Message;
}

export interface Channel {
  id: number;
  name: string;
  removable: boolean;
}

export interface UserData {
  username: string;
  token: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeState {
  currentTheme: Theme;
}

export interface MessagesState {
  messages: Message[];
}

export interface ModalState {
  isOpened: boolean;
  type: string | null;
  info: number | null;
}

export interface ChannelsState {
  channels: Channel[];
  currentChannelId: number;
}

export type RootState = CombinedState<{
  channels: ChannelsState;
  messages: MessagesState;
  modal: ModalState;
  theme: ThemeState;
}>;

export interface SendMessageData {
  body: string;
  channelId: number;
  username: string;
}

export interface AddChannelData {
  name: string;
}

export interface RemoveChannelData {
  id: number | null;
}

export interface RenameChannelData {
  id: number | null;
  name: string;
}

export interface SocketApiType {
  addChannel: (data: AddChannelData) => AddChannelResponse;
  removeChannel: (data: RemoveChannelData) => SocketResponseType;
  renameChannel: (data: RenameChannelData) => SocketResponseType;
  sendMessage: (data: SendMessageData) => SocketResponseType;
}

export type SocketEventData =
  | SendMessageData
  | AddChannelData
  | RemoveChannelData
  | RenameChannelData;

export interface AddChannelResponse extends SocketResponseType {
  data: Channel;
}

export type CustomButtonProps = {
  handleSetCurrentChannel: (id: number) => () => void;
  channel: Channel;
  variant: string;
};

export interface ModalTypes {
  [key: string]: React.ComponentType<AddProps | RemoveProps | RenameProps>;
}
