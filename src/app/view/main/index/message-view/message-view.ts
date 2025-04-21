import "./message-view.css";
import { IBaseComponentParam } from "../../../../../util/base-component";
import { View } from "../../../view";
import { MessageHeaderView } from "./message-header-view/message-header-view";
import { HistoryView } from "./history-view/history-view";
import { SendView } from "./send-view/send-view";
import { MyWebSocket } from "../../../../web-socket/web-socket";

const CssClasses = {
  message: ["index_message-wrap"],
};

export class MessageView extends View {
  public headerComponent: MessageHeaderView;
  public historyComponent: HistoryView;
  public sendComponent: SendView;
  constructor(connection: MyWebSocket) {
    const params: IBaseComponentParam = {
      classList: CssClasses.message,
    };
    super(params);
    this.headerComponent = this.getHeaderView();
    this.historyComponent = this.getHistoryView(connection);
    this.sendComponent = this.getSendView(connection, this.historyComponent);
    this.configView();
  }

  private configView() {
    this.viewComponent.appendChildComponents([
      this.headerComponent.viewComponent,
      this.historyComponent.viewComponent,
      this.sendComponent.viewComponent,
    ]);
  }

  private getHeaderView() {
    return new MessageHeaderView();
  }
  private getHistoryView(connection: MyWebSocket) {
    return new HistoryView(connection);
  }
  private getSendView(connection: MyWebSocket, historyComponent: HistoryView) {
    return new SendView(connection, historyComponent);
  }
}
