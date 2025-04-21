import "./login-view.css";
import { IBaseComponentParam } from "../../../../util/base-component";
import { Router } from "../../../router/router";
import { View } from "../../view";
import { LoginForm } from "./form-component/form-component";
import { HeaderView } from "../../header/header-view";
import { MyWebSocket } from "../../../web-socket/web-socket";

const CssClasses = {
  login: ["main_login"],
};

export class LoginView extends View {
  private loginForm: LoginForm;
  constructor(router: Router, header: HeaderView, connection: MyWebSocket) {
    const loginViewParams: IBaseComponentParam = {
      tag: "section",
      classList: CssClasses.login,
    };
    super(loginViewParams);
    this.loginForm = this.getFormComponent(router, header, connection);
    this.configView();
  }

  private configView() {
    this.viewComponent.appendChildComponents([this.loginForm]);
  }

  private getFormComponent(
    router: Router,
    header: HeaderView,
    connection: MyWebSocket,
  ) {
    return new LoginForm(router, header, connection);
  }
}
