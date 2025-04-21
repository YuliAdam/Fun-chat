import "./search-user.css";
import {
  IBaseComponentParam,
  IEvents,
} from "../../../../../../util/base-component";
import {
  IInputParam,
  IInputType,
  InputComponent,
} from "../../../../../../util/components/input-component";
import { MyWebSocket } from "../../../../../web-socket/web-socket";
import { AllUserView } from "../all-user-view/all-user-view";
import { MessageView } from "../../message-view/message-view";

const CssClasses = {
  search: ["users_search"],
};

const SEARCH_PLACEHOLDER = "Search";

export class SearchUserView extends InputComponent {
  constructor(
    connection: MyWebSocket,
    allUserComponent: AllUserView,
    messageView: MessageView,
  ) {
    const params: IBaseComponentParam = {
      classList: CssClasses.search,
    };
    const inputParams: IInputParam = {
      type: IInputType.search,
      placeholder: SEARCH_PLACEHOLDER,
    };
    super(params, inputParams);
    this.addSearchEvent(connection, allUserComponent, messageView);
  }

  private addSearchEvent(
    connection: MyWebSocket,
    allUserComponent: AllUserView,
    messageView: MessageView,
  ) {
    this.addComponentEventListener(IEvents.input, () => {
      const value = this.getValue();
      const filtredUsers = [
        ...connection.user.activeUsers,
        ...connection.user.inactiveUsers,
      ].filter((user) => user.login.includes(value));
      allUserComponent.setUsersView(filtredUsers, messageView, connection);
    });
  }
}
