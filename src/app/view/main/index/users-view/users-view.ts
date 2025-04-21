import "./users-view.css";
import { IBaseComponentParam } from "../../../../../util/base-component";
import { View } from "../../../view";
import { UsernameView } from "./username-view/username-view";
import { MyWebSocket } from "../../../../web-socket/web-socket";
import { SearchUserView } from "./search-user/search-user";
import { AllUserView } from "./all-user-view/all-user-view";
import { MessageView } from "../message-view/message-view";

const CssClasses = {
  users: ["index_users-wrap"],
};

export class UsersView extends View {
  public usernameView: UsernameView;
  public searchComponent: SearchUserView;
  public allUsersComponent: AllUserView;
  constructor(connection: MyWebSocket, messageView: MessageView) {
    const params: IBaseComponentParam = {
      classList: CssClasses.users,
    };
    super(params);
    this.usernameView = this.getUserNameView(connection);
    this.allUsersComponent = this.getAllUsersComponent(connection, messageView);
    this.searchComponent = this.getSearchUserComponent(
      connection,
      this.allUsersComponent,
      messageView,
    );
    this.configView();
  }

  private configView() {
    this.viewComponent.appendChildComponents([
      this.usernameView.viewComponent,
      this.searchComponent,
      this.allUsersComponent.viewComponent,
    ]);
  }

  private getUserNameView(connection: MyWebSocket) {
    return new UsernameView(connection.user.username ?? "");
  }

  private getSearchUserComponent(
    connection: MyWebSocket,
    allUsersComponent: AllUserView,
    messageView: MessageView,
  ) {
    return new SearchUserView(connection, allUsersComponent, messageView);
  }

  private getAllUsersComponent(
    connection: MyWebSocket,
    messageView: MessageView,
  ) {
    return new AllUserView(connection, messageView);
  }
}
