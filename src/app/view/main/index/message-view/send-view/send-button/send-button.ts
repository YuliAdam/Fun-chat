import "./send-button.css";
import {
  IBaseComponentParam,
  IEvents,
} from "../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../util/components/button-component";
import { MyWebSocket } from "../../../../../../web-socket/web-socket";
import { SendView } from "../send-view";
import { HistoryView } from "../../history-view/history-view";

const CssClasses = {
  sendButton: ["send_button"],
};

const TEXT_SEND = "Send";

export class SendButton extends ButtonComponent {
  constructor(
    connection: MyWebSocket,
    sendView: SendView,
    historyComponent: HistoryView,
  ) {
    const params: IBaseComponentParam = {
      classList: CssClasses.sendButton,
      textContent: TEXT_SEND,
    };
    super(params);
    this.doDisabled();
    this.addSendButtonEvent(connection, sendView, historyComponent);
  }

  private addSendButtonEvent(
    connection: MyWebSocket,
    sendView: SendView,
    historyComponent: HistoryView,
  ) {
    this.addComponentEventListener(IEvents.click, () => {
      const text = sendView.textarea.getValue();
      const toUsername = connection.user.selectedUsername;
      if (toUsername) {
        connection.user.sendMessage(connection, toUsername, text);
      }
      connection.addSendingMessageAfterResponse(
        this.appendSendingMessage,
        historyComponent,
      );
      sendView.textarea.setValue("");
    });
  }

  private appendSendingMessage(
    historyComponent: HistoryView,
    connection: MyWebSocket,
  ) {
    const message = connection.user.sendingMessage;
    if (message) {
      historyComponent.appendFromMessage(message, connection);
    }
  }
}
