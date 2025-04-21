import "./all-user-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { UserView } from "./user-view/user-view";
import { MyWebSocket } from "../../../../../web-socket/web-socket";
import { MessageView } from "../../message-view/message-view";
import { IAuthenticationResponse } from "../../../../../web-socket/web-socket-interface";

const CssClasses = {
  allUsers: ["users_all"],
};

export class AllUserView extends View {
  public usersComponents: UserView[];
  constructor(connection: MyWebSocket, messageView: MessageView) {
    const params: IBaseComponentParam = {
      classList: CssClasses.allUsers,
    };
    super(params);
    this.usersComponents = this.getUsersComponents(connection, messageView);
    this.configView();
  }

  public setUsersView(
    users: IAuthenticationResponse[],
    messageView: MessageView,
    connection: MyWebSocket,
  ) {
    this.viewComponent.removeChildren();
    this.usersComponents = users.map(
      (user) => new UserView(user, messageView, connection),
    );
    this.viewComponent.appendChildComponents(
      this.usersComponents.map((user) => user.viewComponent),
    );
  }

  public addUsersView(
    users: IAuthenticationResponse[],
    messageView: MessageView,
    connection: MyWebSocket,
  ) {
    const newUsers = users.map(
      (user) => new UserView(user, messageView, connection),
    );
    this.usersComponents = [...this.usersComponents, ...newUsers];
    this.viewComponent.appendChildComponents(
      newUsers.map((user) => user.viewComponent),
    );
  }

  private getUsersArray(connection: MyWebSocket) {
    return [...connection.user.activeUsers, ...connection.user.inactiveUsers];
  }

  private getUsersComponents(
    connection: MyWebSocket,
    messageView: MessageView,
  ) {
    const arr: UserView[] = [];
    this.getUsersArray(connection).forEach((user) =>
      arr.push(new UserView(user, messageView, connection)),
    );
    return arr;
  }

  private configView() {
    this.viewComponent.appendChildComponents(
      this.usersComponents.map((component) => component.viewComponent),
    );
  }
}
