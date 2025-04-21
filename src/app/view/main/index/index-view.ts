import "./index-view.css";
import { IBaseComponentParam } from "../../../../util/base-component";
import { View } from "../../view";
import { MessageView } from "./message-view/message-view";
import { UsersView } from "./users-view/users-view";
import { MyWebSocket } from "../../../web-socket/web-socket";

const CssClasses = {
  index: ["main_index"],
};

export class IndexView extends View {
  public messageView: MessageView;
  public usersView: UsersView;
  constructor(connection: MyWebSocket) {
    const params: IBaseComponentParam = {
      tag: "section",
      classList: CssClasses.index,
    };
    super(params);
    this.messageView = this.getMessageView(connection);
    this.usersView = this.getUsersView(connection, this.messageView);
    this.configView();
  }

  private configView() {
    this.viewComponent.appendChildComponents([
      this.usersView.viewComponent,
      this.messageView.viewComponent,
    ]);
  }

  private getUsersView(connection: MyWebSocket, messageView: MessageView) {
    return new UsersView(connection, messageView);
  }

  private getMessageView(connection: MyWebSocket) {
    return new MessageView(connection);
  }
}
