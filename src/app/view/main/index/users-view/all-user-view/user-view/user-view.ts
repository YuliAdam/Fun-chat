import "./user-view.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../../../util/base-component";
import { View } from "../../../../../view";
import { MessageView } from "../../../message-view/message-view";
import { IAuthenticationResponse } from "../../../../../../web-socket/web-socket-interface";
import { MyWebSocket } from "../../../../../../web-socket/web-socket";

const CssClasses = {
  user: ["all_user"],
  state: ["user_state"],
  username: ["user_username"],
  newMessages: ["user_new-messages"],
};

export class UserView extends View {
  public usernameComponent: BaseComponent;
  public stateComponent: BaseComponent;
  public newMessagesComponent: BaseComponent;
  constructor(
    user: IAuthenticationResponse,
    messageView: MessageView,
    connection: MyWebSocket,
  ) {
    const params: IBaseComponentParam = {
      classList: CssClasses.user,
    };
    super(params);
    this.usernameComponent = this.createUserNameComponent(user.login);
    this.stateComponent = this.createUserStateComponent(user.isLogined);
    this.newMessagesComponent = this.createNewMessagesComponent(0);
    this.addUserViewClickEvent(messageView, user, connection);
    this.configView();
  }

  public hideNewMessageComponent() {
    this.newMessagesComponent.addClassIfHasNot("opacity");
  }

  public setNewMessageComponent(num: number) {
    this.newMessagesComponent.setTextContent(`${num}`);
    this.newMessagesComponent.removeClass("opacity");
  }

  private configView() {
    this.viewComponent.appendChildComponents([
      this.stateComponent,
      this.usernameComponent,
      this.newMessagesComponent,
    ]);
    this.hideNewMessageComponent();
  }

  private createUserNameComponent(name: string) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.username,
      textContent: name,
    };
    return new BaseComponent(params);
  }

  private createUserStateComponent(state: boolean) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.state,
    };
    const stateComponent = new BaseComponent(params);
    if (!state) {
      stateComponent.addClassIfHasNot("doRed");
    }
    return stateComponent;
  }

  private createNewMessagesComponent(num: number) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.newMessages,
      textContent: `${num}`,
    };
    const newMessagesComponent = new BaseComponent(params);
    return newMessagesComponent;
  }

  private addUserViewClickEvent(
    messageView: MessageView,
    user: IAuthenticationResponse,
    connection: MyWebSocket,
  ) {
    this.viewComponent.addComponentEventListener(IEvents.click, () => {
      connection.user.selectedUsername = user.login;
      connection.user.getMessageHistoryWithUser(
        connection.user.selectedUsername,
        connection,
      );
      messageView.headerComponent.replaseHeader(user);
      messageView.sendComponent.textarea.removeComponentAttribute("disabled");
      connection.setHistoryAfterResponse(this.setUserHistory, messageView);
    });
  }

  private setUserHistory(messageView: MessageView, connection: MyWebSocket) {
    if (connection.user.history !== null) {
      if (connection.user.history.length !== 0) {
        messageView.historyComponent.setHistoryContent(
          connection.user.history,
          connection,
        );
      } else {
        messageView.historyComponent.clearMessageHistory();
      }
    }
  }
}
