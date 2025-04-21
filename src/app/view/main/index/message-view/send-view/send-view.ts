import "./send-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { Textarea } from "./textarea/textares";
import { SendButton } from "./send-button/send-button";
import { MyWebSocket } from "../../../../../web-socket/web-socket";
import { HistoryView } from "../history-view/history-view";

const CssClasses = {
  send: ["message_send"],
};

export class SendView extends View {
  public textarea: Textarea;
  public sendButton: SendButton;
  constructor(connection: MyWebSocket, historyComponent: HistoryView) {
    const params: IBaseComponentParam = {
      classList: CssClasses.send,
    };
    super(params);
    this.sendButton = this.getSendButtonComponent(connection, historyComponent);
    this.textarea = this.getTextareaComponent(this.sendButton);
    this.configView();
  }

  private configView() {
    this.viewComponent.appendChildComponents([this.textarea, this.sendButton]);
  }
  private getTextareaComponent(sendButton: SendButton) {
    return new Textarea(sendButton);
  }
  private getSendButtonComponent(
    connection: MyWebSocket,
    historyComponent: HistoryView,
  ) {
    return new SendButton(connection, this, historyComponent);
  }
}
