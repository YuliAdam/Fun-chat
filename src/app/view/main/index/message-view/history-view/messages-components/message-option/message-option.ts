import "./message-option.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../util/components/button-component";
import { ISendMessageResponse } from "../../../../../../../web-socket/web-socket-interface";
import { User } from "../../../../../../../web-socket/user";
import { MyWebSocket } from "../../../../../../../web-socket/web-socket";
import { HistoryMessageView } from "../message-view";

const CssClasses = {
  option: ["message_option"],
  state: ["option_state"],
  button: ["option_button"],
  wrapper: ["option_wrapper"],
};

const CHANGE_BUTTON_TEXT = "change";
const DELETE_BUTTON_TEXT = "delete";

export class MessageOptionComponent extends BaseComponent {
  public stateComponent: BaseComponent;
  public changeButtonComponent: ButtonComponent;
  public deleteButtonComponent: ButtonComponent;
  constructor(
    message: ISendMessageResponse,
    connection: MyWebSocket,
    historyMessage: HistoryMessageView,
  ) {
    const params: IBaseComponentParam = {
      classList: CssClasses.option,
    };
    super(params);
    this.stateComponent = this.createStateComponent(this.getStatus(message));
    this.changeButtonComponent = this.createChangeButtonComponent();
    this.deleteButtonComponent = this.createDeleteButtonComponent();
    this.configComponent(message, connection.user, connection, historyMessage);
  }

  private configComponent(
    message: ISendMessageResponse,
    user: User,
    connection: MyWebSocket,
    historyMessageView: HistoryMessageView,
  ) {
    const wrapper = new BaseComponent({ classList: CssClasses.wrapper });
    wrapper.appendChildComponents([
      this.deleteButtonComponent,
      this.changeButtonComponent,
    ]);
    this.addDeleteMessageEvent(message, user, connection, historyMessageView);
    this.appendChildComponents([wrapper, this.stateComponent]);
  }

  private createStateComponent(state: string) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.state,
      textContent: state,
    };
    return new BaseComponent(params);
  }

  private getStatus(message: ISendMessageResponse) {
    const SENDING_TEXT = "sended";
    const READING_TEXT = "readed";
    const DELIVERY_TEXT = "delivered";
    return message.status.isReaded
      ? READING_TEXT
      : message.status.isDelivered
        ? DELIVERY_TEXT
        : SENDING_TEXT;
  }

  private createChangeButtonComponent() {
    const params: IBaseComponentParam = {
      classList: CssClasses.button,
      textContent: CHANGE_BUTTON_TEXT,
    };
    const changeButtonComponent = new ButtonComponent(params);
    return changeButtonComponent;
  }

  private createDeleteButtonComponent() {
    const params: IBaseComponentParam = {
      classList: CssClasses.button,
      textContent: DELETE_BUTTON_TEXT,
    };
    const deleteButtonComponent = new ButtonComponent(params);
    return deleteButtonComponent;
  }

  public addDeleteMessageEvent(
    message: ISendMessageResponse,
    user: User,
    connection: MyWebSocket,
    historyMessageView: HistoryMessageView,
  ) {
    this.deleteButtonComponent.addComponentEventListener(IEvents.click, () => {
      user.deleteMessageRequest(message, connection);
      this.removeMessageFromHistory(historyMessageView);
    });
  }

  private removeMessageFromHistory(historyMessageView: HistoryMessageView) {
    console.log("remove from history");
    historyMessageView.viewComponent.removeComponent();
  }
}
