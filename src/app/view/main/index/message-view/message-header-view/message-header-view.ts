import "./message-header-view.css";
import {
  BaseComponent,
  IBaseComponentParam,
} from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { IAuthenticationResponse } from "../../../../../web-socket/web-socket-interface";

const CssClasses = {
  header: ["message_header"],
  username: ["message_username"],
  online: ["message_online"],
  offline: ["message_offline"],
};

export class MessageHeaderView extends View {
  public username: BaseComponent;
  public state: BaseComponent;
  constructor() {
    const params: IBaseComponentParam = {
      classList: CssClasses.header,
    };
    super(params);
    this.username = this.createUsernameComponent("");
    this.state = new BaseComponent({});
    this.configView();
  }

  public replaseHeader(user: IAuthenticationResponse) {
    this.viewComponent.removeChildren();
    this.username = this.createUsernameComponent(user.login);
    this.state = this.createStateComponent(user.isLogined);
    this.configView();
  }

  public clearHeader() {
    this.viewComponent.removeChildren();
    this.username = this.createUsernameComponent("");
    this.state = new BaseComponent({});
    this.configView();
  }

  private configView() {
    this.viewComponent.appendChildComponents([this.username, this.state]);
  }

  private createUsernameComponent(username: string) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.username,
      textContent: username,
    };
    return new BaseComponent(params);
  }
  private createStateComponent(isLogined: boolean) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: isLogined ? CssClasses.online : CssClasses.offline,
      textContent: isLogined ? "online" : "offline",
    };
    return new BaseComponent(params);
  }
}
