export enum ISocketType {
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_EXTERNAL_LOGIN = "USER_EXTERNAL_LOGIN",
  USER_EXTERNAL_LOGOUT = "USER_EXTERNAL_LOGOUT",
  USER_ACTIVE = "USER_ACTIVE",
  USER_INACTIVE = "USER_INACTIVE",
  MSG_SEND = "MSG_SEND",
  MSG_FROM_USER = "MSG_FROM_USER",
  MSG_READ = "MSG_READ",
  MSG_DELETE = "MSG_DELETE",
  MSG_EDIT = "MSG_EDIT",
  ERROR = "ERROR",
  MSG_DELIVER = "MSG_DELIVER",
}

export enum IErrorDescription {
  LOGIN_ERROR = "incorrect password",
  SERVER_ERROR = "internal server error",
}

export interface ErrorMessage {
  error: string;
}

export interface IAuthenticationRequest {
  user: {
    login: string;
    password: string;
  };
}

export interface IAuthenticationResponse {
  login: string;
  isLogined: boolean;
}

export interface IAllAuthenticatedUsersResponse {
  users: IAuthenticationResponse[];
}

export interface IExternalUserLoginLogoutResponse {
  id: null;
  type: ISocketType.USER_EXTERNAL_LOGIN | ISocketType.USER_EXTERNAL_LOGOUT;
  payload: { user: IAuthenticationResponse };
}

export interface ISendMessageRequest {
  message: {
    to: string;
    text: string;
  };
}

export interface ISendMessageResponse {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

export interface IMessageHistoryRequest {
  user: {
    login: string;
  };
}

export interface IMessageHistoryResponse {
  messages: ISendMessageResponse[];
}

export interface IMessageDeliveryStatusChangeResponse {
  message: {
    id: string;
    status: {
      isDelivered: boolean;
    };
  };
}

export interface IMessageReadStatusChangeResponse {
  message: {
    id: string;
    status: {
      isReaded: boolean;
    };
  };
}

export interface IMessageStatusChangeRequest {
  message: {
    id: string;
  };
}

export interface IMessageEditingRequest {
  message: {
    id: string;
    text: string;
  };
}

export interface IMessageEditingResponse {
  message: {
    id: string;
    text: string;
    status: {
      isEdited: boolean;
    };
  };
}

export interface IMessageDeletionResponse {
  message: {
    id: string;
    status: {
      isDeleted: boolean;
    };
  };
}

export interface ISocketRequestFormat {
  id: string;
  type: ISocketType;
  payload:
    | IAuthenticationRequest
    | ISendMessageRequest
    | IMessageHistoryRequest
    | IMessageStatusChangeRequest
    | IMessageEditingRequest
    | null;
}

export interface ISocketResponseFormat {
  id: null | string;
  type: ISocketType;
  payload:
    | IAuthenticationResponse
    | IAllAuthenticatedUsersResponse
    | ISendMessageResponse
    | IMessageHistoryResponse
    | IMessageDeliveryStatusChangeResponse
    | IMessageReadStatusChangeResponse
    | IMessageEditingResponse
    | IMessageDeletionResponse
    | ErrorMessage;
}
