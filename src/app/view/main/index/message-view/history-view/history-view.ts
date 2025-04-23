import "./history-view.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../../util/base-component";
import { MyWebSocket } from "../../../../../web-socket/web-socket";
import { ISendMessageResponse } from "../../../../../web-socket/web-socket-interface";
import { View } from "../../../../view";
import { HistoryMessageView } from "./messages-components/message-view";
import { NewMessageLine } from "./new-message-line-view/new-message-line";

const CssClasses = {
  history: ["message_history"],
  initialText: ["history_initial"],
  wrapper: ["history_wrapper"],
};

const INITIAL_TEXT = "Send you'r first message";

export class HistoryView extends View {
  public historyComponent: BaseComponent;
  public messages: HistoryMessageView[];
  public newMessageLine: NewMessageLine | null;
  constructor(connection: MyWebSocket) {
    const params: IBaseComponentParam = {
      classList: CssClasses.wrapper,
    };
    super(params);
    this.historyComponent = this.createHistoryComponent();
    this.newMessageLine = null;
    this.addReadHistoryEvent(connection);
    this.messages = [];
    this.configView();
  }

  public goToLastMessage() {
    const el = this.historyComponent.getElement();
    if (el) {
      el.children[el.children.length - 1].scrollIntoView(false);
    }
  }
  public clearMessageHistory() {
    this.historyComponent.removeChildren();
    this.historyComponent.appendChildComponents([
      this.createInitialTextElement(),
    ]);
    this.messages = [];
  }

  public setHistoryContent(
    messageArr: ISendMessageResponse[],
    connection: MyWebSocket,
  ) {
    this.historyComponent.removeComponent();
    this.historyComponent = this.createHistoryComponent();
    this.viewComponent.appendChildComponents([this.historyComponent]);
    let countFirstNotReadedMessage = 0;
    messageArr.forEach((mess, i) => {
      if (!mess.status.isReaded && countFirstNotReadedMessage === 0) {
        this.newMessageLine = new NewMessageLine();
        this.historyComponent.appendChildComponents([this.newMessageLine]);
        countFirstNotReadedMessage++;
      }
      const messageComponent = new HistoryMessageView(mess, connection);
      this.messages.push(messageComponent);
      if (mess.from === connection.user.username) {
        messageComponent.addFromMessageStyle();
        this.historyComponent.appendChildComponents([
          messageComponent.viewComponent,
        ]);
      } else {
        messageComponent.addToMessageStyle();
        this.historyComponent.appendChildComponents([
          messageComponent.viewComponent,
        ]);
      }
      if (countFirstNotReadedMessage === 0 && i === messageArr.length - 1) {
        messageComponent.viewComponent.scrollIntoView();
      } else if (this.newMessageLine) {
        this.newMessageLine.scrollToNewLineMessage();
      }
    });
    setTimeout(() => this.addScrollReadHistoryEvent(connection), 100);
  }

  private createHistoryComponent() {
    return new BaseComponent({
      classList: CssClasses.history,
    });
  }

  public appendToMessage(
    message: ISendMessageResponse,
    connection: MyWebSocket,
  ) {
    if (this.messages.length === 0) {
      this.historyComponent.removeChildren();
    }
    const messageToComponent = new HistoryMessageView(message, connection);
    this.messages.push(messageToComponent);
    messageToComponent.addToMessageStyle();
    this.historyComponent.appendChildComponents([
      messageToComponent.viewComponent,
    ]);
    messageToComponent.viewComponent.scrollIntoView();
  }

  public appendFromMessage(
    message: ISendMessageResponse,
    connection: MyWebSocket,
  ) {
    if (this.messages.length === 0) {
      this.historyComponent.removeChildren();
    }
    const messageFromComponent = new HistoryMessageView(message, connection);
    this.messages.push(messageFromComponent);
    messageFromComponent.addFromMessageStyle();
    this.historyComponent.appendChildComponents([
      messageFromComponent.viewComponent,
    ]);
    messageFromComponent.viewComponent.scrollIntoView();
  }

  public changeMessageById(messageId: string, text: string) {
    this.messages.forEach((mess) => {
      if (mess.id === messageId) {
        mess.replaceEditedMessage(text);
      }
    });
  }

  private configView() {
    this.viewComponent.appendChildComponents([this.historyComponent]);
    this.historyComponent.appendChildComponents([
      this.createInitialTextElement(),
    ]);
  }

  private createInitialTextElement() {
    const params: IBaseComponentParam = {
      classList: CssClasses.initialText,
      textContent: INITIAL_TEXT,
    };
    return new BaseComponent(params);
  }

  private addReadHistoryEvent(connection: MyWebSocket) {
    this.viewComponent.addComponentEventListener(IEvents.click, () =>
      this.readMessage(connection),
    );
  }

  public addScrollReadHistoryEvent(connection: MyWebSocket) {
    this.historyComponent.addComponentEventListener(IEvents.scroll, () => {
      console.log("scroll");
      this.readMessage(connection);
    });
  }

  private readMessage(connection: MyWebSocket) {
    console.log("read");
    const READED_STATE_TEXT = "readed";
    const TEXT_YOU_USERNAME = "You";
    connection.user.readMessageFromUser(connection);
    if (this.newMessageLine) {
      this.historyComponent.removeChildComponent(this.newMessageLine);
      this.newMessageLine = null;
    }
    this.messages.forEach((mess) => {
      if (
        mess.infoComponent.usernameComponent.getTextContent() !==
          TEXT_YOU_USERNAME &&
        mess.optionComponent.stateComponent.getTextContent() !==
          READED_STATE_TEXT
      ) {
        mess.optionComponent.stateComponent.setTextContent(READED_STATE_TEXT);
      }
    });
  }
}
