export interface SocketResponseType {
  status: 'ok' | 'error';
}

export interface AuthType {
  user: {
    username: string;
  } | null;
  logIn: (userData: any) => void;
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

export type ChannelProps = {
  channel: any;
  isActive: boolean;
  handleSetCurrentChannel: (id: number) => () => void;
  handleRemoveChannel: (id: number) => () => void;
  handleRenameChannel: (id: number) => () => void;
};

export interface MessageProps {
  message: {
    id: string;
    username: string;
    body: string;
  };
}

export interface EnterNewMessageProps {
  channelId: string;
}
