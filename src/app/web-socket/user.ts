import { App } from "../app";
import { MyWebSocket } from "./web-socket";
import {
  IAllAuthenticatedUsersResponse,
  IAuthenticationResponse,
  IExternalUserLoginLogoutResponse,
  IMessageDeliveryStatusChangeResponse,
  ISendMessageResponse,
  ISocketRequestFormat,
  ISocketType,
} from "./web-socket-interface";

const GENERAL_ERROR_MESSAGE = "Something went wrong, sorry";

export class User {
  public username: string | null;
  public password: string | null;
  public isLogined: boolean | null;
  public activeUsers: IAuthenticationResponse[];
  public inactiveUsers: IAuthenticationResponse[];
  public selectedUsername: string | null;
  public history: ISendMessageResponse[] | null;
  public sendingMessage: ISendMessageResponse | null;
  public errorMessage: string;
  constructor() {
    this.username = null;
    this.isLogined = null;
    this.password = null;
    this.activeUsers = [];
    this.inactiveUsers = [];
    this.selectedUsername = null;
    this.history = null;
    this.sendingMessage = null;
    this.errorMessage = GENERAL_ERROR_MESSAGE;
  }

  public setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  public loginUser(
    connection: MyWebSocket,
    username: string,
    password: string,
  ) {
    const loginParams: ISocketRequestFormat = {
      id: "1",
      type: ISocketType.USER_LOGIN,
      payload: {
        user: {
          login: username,
          password: password,
        },
      },
    };
    connection.send(loginParams);
    this.username = username;
    this.password = password;
  }

  public setLoginUserParams(
    app: App,
    responseObject: IAuthenticationResponse,
    connection: MyWebSocket,
  ) {
    this.isLogined = true;
    this.getActiveUsers(connection);
    this.getInactiveUsers(connection);
    app.index.usersView.usernameView.setUserName(responseObject.login);
  }

  public logoutUser(connection: MyWebSocket) {
    if (this.username && this.password) {
      const logoutParams: ISocketRequestFormat = {
        id: "1",
        type: ISocketType.USER_LOGOUT,
        payload: {
          user: {
            login: this.username,
            password: this.password,
          },
        },
      };
      connection.send(logoutParams);
      this.clearUserAcessData();
    }
  }

  public setLogoutResponse(app: App, connection: MyWebSocket) {
    app.index.usersView.allUsersComponent.viewComponent.removeChildren();
    app.index.messageView.historyComponent.clearMessageHistory(connection);
    app.index.messageView.headerComponent.clearHeader();
  }

  public clearUserAcessData() {
    this.username = null;
    this.password = null;
    this.isLogined = null;
    this.selectedUsername = null;
  }

  public getActiveUsers(connection: MyWebSocket) {
    if (this.username && this.password) {
      const logoutParams: ISocketRequestFormat = {
        id: "2",
        type: ISocketType.USER_ACTIVE,
        payload: null,
      };
      connection.send(logoutParams);
    }
  }

  public getInactiveUsers(connection: MyWebSocket) {
    if (this.username && this.password) {
      const logoutParams: ISocketRequestFormat = {
        id: "2",
        type: ISocketType.USER_INACTIVE,
        payload: null,
      };
      connection.send(logoutParams);
    }
  }

  public setActiveUsers(
    responseObject: {
      id: null;
      type: ISocketType.USER_ACTIVE;
      payload: IAllAuthenticatedUsersResponse;
    },
    app: App,
    connection: MyWebSocket,
  ) {
    this.activeUsers = responseObject.payload.users.filter(
      (u: IAuthenticationResponse) => u.login !== this.username,
    );
    app.index.usersView.allUsersComponent.addUsersView(
      this.activeUsers,
      app.index.messageView,
      connection,
    );
    this.getMessageHistoryWithAllUsers(this.activeUsers, connection);
  }

  public setInactiveUsers(
    responseObject: {
      id: null;
      type: ISocketType.USER_INACTIVE;
      payload: IAllAuthenticatedUsersResponse;
    },
    app: App,
    connection: MyWebSocket,
  ) {
    this.inactiveUsers = responseObject.payload.users;
    app.index.usersView.allUsersComponent.addUsersView(
      this.inactiveUsers,
      app.index.messageView,
      connection,
    );
    this.getMessageHistoryWithAllUsers(this.inactiveUsers, connection);
  }

  public changeUsersIfExternalUserLogin(
    responseObject: IExternalUserLoginLogoutResponse,
    app: App,
    connection: MyWebSocket,
  ) {
    const newUser: IAuthenticationResponse = responseObject.payload.user;
    this.deliveryMessagesIfOnline(app, responseObject.payload.user.login);
    this.activeUsers.push(newUser);
    this.inactiveUsers = this.inactiveUsers.filter(
      (user) => user.login !== newUser.login,
    );
    if (connection.user.selectedUsername === newUser.login) {
      app.index.messageView.headerComponent.replaseHeader(newUser);
    }
    this.getMessageHistoryWithAllUsers(
      [...this.activeUsers, ...this.inactiveUsers],
      connection,
    );
    app.index.usersView.allUsersComponent.setUsersView(
      [...this.activeUsers, ...this.inactiveUsers],
      app.index.messageView,
      connection,
    );
  }
  public changeUsersIfExternalUserLogout(
    responseObject: IExternalUserLoginLogoutResponse,
    app: App,
    connection: MyWebSocket,
  ) {
    const logoutUser: IAuthenticationResponse = responseObject.payload.user;
    this.inactiveUsers.push(logoutUser);
    this.activeUsers = this.activeUsers.filter(
      (user) => user.login !== logoutUser.login,
    );
    if (connection.user.selectedUsername === logoutUser.login) {
      app.index.messageView.headerComponent.replaseHeader(logoutUser);
    }
    app.index.usersView.allUsersComponent.setUsersView(
      [...this.activeUsers, ...this.inactiveUsers],
      app.index.messageView,
      connection,
    );
  }

  public sendMessage(connection: MyWebSocket, to: string, text: string) {
    this.sendingMessage = null;
    const sendMessageParams: ISocketRequestFormat = {
      id: "2",
      type: ISocketType.MSG_SEND,
      payload: {
        message: {
          to: to,
          text: text,
        },
      },
    };
    connection.send(sendMessageParams);
  }

  public getMessageHistoryWithAllUsers(
    users: IAuthenticationResponse[],
    connection: MyWebSocket,
  ) {
    users.forEach((user) => {
      const messageHistoryParams: ISocketRequestFormat = {
        id: "4",
        type: ISocketType.MSG_FROM_USER,
        payload: {
          user: {
            login: user.login,
          },
        },
      };
      connection.send(messageHistoryParams);
    });
  }

  public getMessageHistoryWithUser(login: string, connection: MyWebSocket) {
    this.history = null;
    const messageHistoryParams: ISocketRequestFormat = {
      id: "3",
      type: ISocketType.MSG_FROM_USER,
      payload: {
        user: {
          login: login,
        },
      },
    };
    connection.send(messageHistoryParams);
  }

  public setHistory(messages: ISendMessageResponse[]) {
    this.history = messages;
  }

  public getAllHistory(messages: ISendMessageResponse[], app: App) {
    let count = 0;
    let username: string | null = null;
    messages.forEach((message) => {
      if (!message.status.isReaded && message.from !== this.username) {
        count++;
        username = message.from;
      }
    });
    if (count && username) {
      app.index.usersView.allUsersComponent.usersComponents.forEach((user) => {
        if (user.usernameComponent.getTextContent() === username) {
          user.setNewMessageComponent(count);
        }
      });
    }
  }

  public setSendingMessage(message: ISendMessageResponse) {
    this.sendingMessage = message;
    if (this.history) {
      this.history.push(message);
    }
  }

  public receivingMessage(
    app: App,
    message: ISendMessageResponse,
    connection: MyWebSocket,
  ) {
    if (message.from === this.selectedUsername) {
      if (this.history) {
        this.history.push(message);
      }
      message.status.isReaded = true;
      app.index.messageView.historyComponent.appendToMessage(
        message,
        connection,
      );
      this.readMessage(message, connection);
    } else {
      app.index.usersView.allUsersComponent.usersComponents.forEach((user) => {
        if (user.usernameComponent.getTextContent() === message.from) {
          const actualNum = parseInt(
            user.newMessagesComponent.getTextContent() ?? "0",
          );
          user.setNewMessageComponent(actualNum + 1);
        }
      });
    }
  }

  public deliveryMessagesIfOnline(app: App, login: string) {
    const DELEVIRY_TEXT = "delivered";
    if (login === this.selectedUsername) {
      app.index.messageView.historyComponent.messages.forEach((message) => {
        message.optionComponent.stateComponent.setTextContent(DELEVIRY_TEXT);
      });
    }
  }

  public readMessage(message: ISendMessageResponse, connection: MyWebSocket) {
    const requestParams = {
      id: "5",
      type: ISocketType.MSG_READ,
      payload: {
        message: {
          id: message.id,
        },
      },
    };
    connection.send(requestParams);
  }

  public readMessageFromUser(connection: MyWebSocket) {
    if (this.history) {
      this.history.forEach((message) => {
        if (!message.status.isReaded) {
          const requestParams = {
            id: "5",
            type: ISocketType.MSG_READ,
            payload: {
              message: {
                id: message.id,
              },
            },
          };
          connection.send(requestParams);
        }
      });
    }
  }

  public readingStateResponseEvent(app: App) {
    app.index.usersView.allUsersComponent.usersComponents.forEach((user) => {
      if (this.selectedUsername === user.usernameComponent.getTextContent()) {
        user.setNewMessageComponent(0);
        user.hideNewMessageComponent();
      }
    });
  }

  public changeReadingStateResponseEvent(
    responseObject: IMessageDeliveryStatusChangeResponse,
    app: App,
  ) {
    const READED_TEXT = "readed";
    const messageId = responseObject.message.id;
    if (this.history) {
      this.history.forEach((mess) => {
        if (mess.id === messageId) {
          app.index.messageView.historyComponent.messages.forEach((message) => {
            message.optionComponent.stateComponent.setTextContent(READED_TEXT);
          });
        }
      });
    }
  }

  public deleteMessageRequest(
    message: ISendMessageResponse,
    connection: MyWebSocket,
  ) {
    const requestParams = {
      id: "delete",
      type: ISocketType.MSG_DELETE,
      payload: {
        message: {
          id: message.id,
        },
      },
    };
    connection.send(requestParams);
    if (this.history) {
      this.history = this.history.filter((mess) => mess.id !== message.id);
    }
  }

  public deleteMessageResponseEvent(
    responseObject: IMessageDeliveryStatusChangeResponse,
    app: App,
  ) {
    const messageId = responseObject.message.id;
    if (this.history) {
      if (this.history) {
        this.history = this.history.filter((mess) => mess.id !== messageId);
      }
    }
    app.index.messageView.historyComponent.messages.forEach((message) => {
      if (message.id === messageId) {
        message.optionComponent.removeMessageFromHistory(message);
      }
    });
  }
}
