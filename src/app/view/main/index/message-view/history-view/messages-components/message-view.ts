import "./messages-components.css";
import {
  BaseComponent,
  IBaseComponentParam,
} from "../../../../../../../util/base-component";
import { ISendMessageResponse } from "../../../../../../web-socket/web-socket-interface";
import { MessageInfoComponent } from "./message-info/message-info";
import { MyWebSocket } from "../../../../../../web-socket/web-socket";
import { View } from "../../../../../view";
import { MessageOptionComponent } from "./message-option/message-option";

const CssClasses = {
  messageFrom: "history_message-from",
  textFrom: "message-from_text",
  messageTo: "history_message-to",
  textTo: "message-to_text",
};

export class HistoryMessageView extends View {
  private textComponent: BaseComponent;
  public infoComponent: MessageInfoComponent;
  public optionComponent: MessageOptionComponent;
  constructor(message: ISendMessageResponse, connection: MyWebSocket) {
    const params: IBaseComponentParam = {
      classList: [],
    };
    super(params);
    this.textComponent = this.createMessaggeText(message.text);
    this.infoComponent = this.getMessageInfo(message, connection);
    this.optionComponent = this.getMessageOption(message);
    this.configView();
  }

  public addFromMessageStyle() {
    this.viewComponent.addClassIfHasNot(CssClasses.messageFrom);
    this.textComponent.addClassIfHasNot(CssClasses.textFrom);
  }

  public addToMessageStyle() {
    this.viewComponent.addClassIfHasNot(CssClasses.messageTo);
    this.textComponent.addClassIfHasNot(CssClasses.textTo);
    this.optionComponent.changeButtonComponent.hideButton();
  }

  private configView() {
    this.viewComponent.appendChildComponents([
      this.infoComponent,
      this.textComponent,
      this.optionComponent,
    ]);
  }

  private createMessaggeText(text: string) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: [],
      textContent: text,
    };
    return new BaseComponent(params);
  }

  private getMessageInfo(
    message: ISendMessageResponse,
    connection: MyWebSocket,
  ) {
    return new MessageInfoComponent(message, connection);
  }

  private getMessageOption(message: ISendMessageResponse) {
    return new MessageOptionComponent(message);
  }
}
