import { App } from "../app";
import { Router } from "../router/router";
import { HeaderView } from "../view/header/header-view";
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
  constructor(user: User, app: App) {
    this.socket = this.connect();
    this.user = user;
    this.configSocket(this.user, app);
  }

  private configSocket(user: User, app: App) {
    this.setOnMessageEvent(user, app, this);
  }

  private connect() {
    var scheme = "ws";
    console.log("start socket");
    if (document.location.protocol === "https:") {
      scheme += "s";
    }
    const serverUrl =  + "ws://" + 'localhost' + ":4000";
    const connection = new WebSocket(serverUrl, "json");
    console.log(serverUrl);
    connection.onopen = function () {
      console.log("CONNECTED");
    };
    return connection;
  }

  public send(request: ISocketRequestFormat) {
    console.log("send");
    console.log(JSON.stringify(request));
    this.socket.send(MyWebSocket.stringifyRequest(request));
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
      console.log(this.user.sendingMessage);
      callBack(historyComponent, this);
    } else {
      console.log("wait");
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
        console.log("login");
        user.setLoginUserParams(app, responseObject.payload.user, connection);
      }
      if (
        responseObject.type === ISocketType.ERROR &&
        responseObject.payload.error === IErrorDescription.LOGIN_ERROR
      ) {
        user.isLogined = false;
      }
      if (responseObject.type === ISocketType.USER_LOGOUT) {
        console.log("logout");
        user.setLogoutResponse(app);
      }
      if (responseObject.type === ISocketType.USER_ACTIVE) {
        console.log("activ");
        user.setActiveUsers.call(user, responseObject, app, connection);
      }
      if (responseObject.type === ISocketType.USER_INACTIVE) {
        console.log("inactiv");
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
        console.log("receving message");
        user.receivingMessage(app, responseObject.payload.message, connection);
      }
      if (
        responseObject.type === ISocketType.MSG_READ &&
        responseObject.id !== null
      ) {
        console.log("reading message");
        user.readingStateResponseEvent(app);
      }
      if (
        responseObject.type === ISocketType.MSG_READ &&
        responseObject.id === null
      ) {
        console.log("user read you message");
        user.changeReadingStateResponseEvent(responseObject.payload, app);
      }
      if (
        responseObject.type === ISocketType.MSG_DELETE &&
        responseObject.id === null
      ) {
        console.log("delete");
        user.changeReadingStateResponseEvent(responseObject.payload, app);
      }
    };
  }

  public static stringifyRequest(
    request: ISocketRequestFormat | ISocketResponseFormat,
  ): string {
    return JSON.stringify(request);
  }
}
