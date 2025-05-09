import { App } from "../app";
import { Router } from "../router/router";
import { HeaderView } from "../view/header/header-view";
import { IndexView } from "../view/main/index/index-view";
import { HistoryView } from "../view/main/index/message-view/history-view/history-view";
import { MessageView } from "../view/main/index/message-view/message-view";
import { LoginForm } from "../view/main/login/form-component/form-component";
import { User } from "./user";
import {
  IErrorDescription,
  ISocketRequestFormat,
  ISocketResponseFormat,
  ISocketType,
} from "./web-socket-interface";

export class MyWebSocket {
  public user: User;
  public socket: WebSocket;
  public app;
  constructor(user: User, app: App) {
    this.socket = this.connect();
    this.user = user;
    this.app = app;
    this.configSocket(this.user, app);
  }

  private configSocket(user: User, app: App) {
    this.setOnMessageEvent(user, app, this);
  }

  private connect() {
    console.log("start socket");
    const serverUrl = "ws://localhost:4000";
    const connection = new WebSocket(serverUrl, "json");
    connection.onopen = function () {
      console.log("CONNECTED");
    };
    return connection;
  }

  public send(request: ISocketRequestFormat) {
    console.log("send");
    console.log(JSON.stringify(request));
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(MyWebSocket.stringifyRequest(request));
    } else {
      this.testConnection(this.app, this);
    }
  }

  public setEventAfterLoginResponse(
    callBack: Function,
    router: Router,
    header: HeaderView,
    formComponent: LoginForm,
  ) {
    if (this.user.isLogined !== null) {
      callBack(router, header, formComponent, this);
    } else {
      setTimeout(
        () =>
          this.setEventAfterLoginResponse(
            callBack,
            router,
            header,
            formComponent,
          ),
        100,
      );
    }
  }

  public setHistoryAfterResponse(callBack: Function, messageView: MessageView) {
    if (this.user.history !== null) {
      callBack(messageView, this);
    } else {
      setTimeout(
        () => this.setHistoryAfterResponse(callBack, messageView),
        100,
      );
    }
  }

  public addSendingMessageAfterResponse(
    callBack: Function,
    historyComponent: HistoryView,
  ) {
    if (this.user.sendingMessage !== null) {
      callBack(historyComponent, this);
    } else {
      setTimeout(
        () => this.addSendingMessageAfterResponse(callBack, historyComponent),
        100,
      );
    }
  }

  private setOnMessageEvent(user: User, app: App, connection: MyWebSocket) {
    this.socket.onmessage = function (e) {
      const responseObject = JSON.parse(e.data);
      console.log("responseObject", JSON.parse(e.data));
      if (
        responseObject.type === ISocketType.USER_LOGIN &&
        responseObject.payload.user.isLogined
      ) {
        user.setLoginUserParams(app, responseObject.payload.user, connection);
      }
      if (responseObject.type === ISocketType.ERROR) {
        console.log("error");
        console.log("responseObject", responseObject);
        if (responseObject.payload.error === IErrorDescription.SERVER_ERROR) {
          connection.testConnection(app, connection);
        } else {
          user.isLogined = false;
          user.setErrorMessage(responseObject.payload.error);
        }
      }
      if (responseObject.type === ISocketType.USER_LOGOUT) {
        user.setLogoutResponse(app, connection);
      }
      if (responseObject.type === ISocketType.USER_ACTIVE) {
        user.setActiveUsers.call(user, responseObject, app, connection);
      }
      if (responseObject.type === ISocketType.USER_INACTIVE) {
        user.setInactiveUsers.call(user, responseObject, app, connection);
      }
      if (responseObject.type === ISocketType.USER_EXTERNAL_LOGIN) {
        user.changeUsersIfExternalUserLogin(responseObject, app, connection);
      }
      if (responseObject.type === ISocketType.USER_EXTERNAL_LOGOUT) {
        user.changeUsersIfExternalUserLogout(responseObject, app, connection);
      }
      if (
        responseObject.type === ISocketType.MSG_SEND &&
        responseObject.id === "2"
      ) {
        user.setSendingMessage(responseObject.payload.message);
      }
      if (
        responseObject.type === ISocketType.MSG_FROM_USER &&
        responseObject.id === "3"
      ) {
        user.setHistory(responseObject.payload.messages);
      }
      if (
        responseObject.type === ISocketType.MSG_FROM_USER &&
        responseObject.id === "4"
      ) {
        user.getAllHistory(responseObject.payload.messages, app);
      }
      if (
        responseObject.type === ISocketType.MSG_SEND &&
        responseObject.id === null
      ) {
        user.receivingMessage(app, responseObject.payload.message, connection);
      }
      if (
        responseObject.type === ISocketType.MSG_READ &&
        responseObject.id !== null
      ) {
        user.readingStateResponseEvent(app);
      }
      if (
        responseObject.type === ISocketType.MSG_READ &&
        responseObject.id === null
      ) {
        user.changeReadingStateResponseEvent(responseObject.payload, app);
      }
      if (
        responseObject.type === ISocketType.MSG_DELETE &&
        responseObject.id === null
      ) {
        user.deleteMessageResponseEvent(responseObject.payload, app);
      }
      if (
        responseObject.type === ISocketType.MSG_EDIT &&
        responseObject.id === null
      ) {
        connection.changeMessageResponse(
          app,
          responseObject.payload.message.id,
          responseObject.payload.message.text,
        );
      }
    };
  }

  public changeMessageRequest(messageId: string, text: string) {
    const requestParams = {
      id: "change",
      type: ISocketType.MSG_EDIT,
      payload: {
        message: {
          id: messageId,
          text: text,
        },
      },
    };
    this.send(requestParams);
  }

  public static stringifyRequest(
    request: ISocketRequestFormat | ISocketResponseFormat,
  ): string {
    return JSON.stringify(request);
  }

  private changeMessageResponse(app: App, id: string, text: string) {
    app.index.messageView.historyComponent.changeMessageById(id, text);
  }

  private testConnection(app: App, connection: MyWebSocket) {
    app.connectionDialog.openDialog();
    connection.socket = connection.connect();
    setTimeout(function returnConnection() {
      console.log(connection.socket.readyState);
      if (connection.socket.readyState !== connection.socket.OPEN) {
        console.log("wait");
        connection.socket = connection.connect();
        setTimeout(() => returnConnection(), 500);
      } else {
        console.log("connected");
        connection.setOnMessageEvent(connection.user, app, connection);
        if (connection.user.username && connection.user.password) {
          connection.user.loginUser(
            connection,
            connection.user.username,
            connection.user.password,
          );
          app.index = new IndexView(connection);
          app.main.setContent(app.index.viewComponent);
          app.router.navigate("index", connection);
        }
        app.connectionDialog.closeDialog();
      }
    }, 500);
  }
}
