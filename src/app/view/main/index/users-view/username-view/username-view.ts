import "./username-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";

const CssClasses = {
  username: ["users_username"],
};

export class UsernameView extends View {
  constructor(username: string) {
    const params: IBaseComponentParam = {
      tag: "h2",
      classList: CssClasses.username,
      textContent: `Username: ${username}`,
    };
    super(params);
  }

  public setUserName(username: string) {
    this.viewComponent.setTextContent(`Username: ${username}`);
  }
}
