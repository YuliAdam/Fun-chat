import "./nav-buttons.css";
import {
  IBaseComponentParam,
  IEvents,
} from "../../../../../util/base-component";
import { ComponentChildren } from "../../../../../util/child-component-array";
import { ButtonComponent } from "../../../../../util/components/button-component";
import { Router } from "../../../../router/router";
import { MyWebSocket } from "../../../../web-socket/web-socket";

const CssClasses = {
  info: ["nav_info"],
  logout: ["nav_logout"],
};

const buttonText = {
  INFO: "About us",
  LOGOUT: "Logout",
};

export class NavButtonChildren extends ComponentChildren<ButtonComponent> {
  public logoutButtonComponent: ButtonComponent;
  public infoButtonComponent: ButtonComponent;
  constructor(router: Router, connection: MyWebSocket) {
    super();
    this.infoButtonComponent = this.createInfoButton(router, connection);
    this.logoutButtonComponent = this.createLogoutButton(router, connection);
    this.childArray.concat(
      this.logoutButtonComponent,
      this.infoButtonComponent,
    );
  }

  protected getComponentArr(): ButtonComponent[] {
    return [];
  }

  private createInfoButton(router: Router, connection: MyWebSocket) {
    const btnParam: IBaseComponentParam = {
      classList: CssClasses.info,
      textContent: buttonText.INFO,
    };
    const infoButtonComponent = new ButtonComponent(btnParam);
    this.addGoToInfoPage(router, infoButtonComponent, connection);
    return infoButtonComponent;
  }
  private createLogoutButton(router: Router, connection: MyWebSocket) {
    const btnParam: IBaseComponentParam = {
      classList: CssClasses.logout,
      textContent: buttonText.LOGOUT,
    };
    const logoutButtonComponent = new ButtonComponent(btnParam);
    this.addGoToLoginPage(router, logoutButtonComponent, connection);
    logoutButtonComponent.hideButton();
    return logoutButtonComponent;
  }

  private addGoToInfoPage(
    router: Router,
    btn: ButtonComponent,
    connection: MyWebSocket,
  ) {
    btn.addComponentEventListener(IEvents.click, () => {
      router.navigate("info", connection);
      this.infoButtonComponent.hideButton();
    });
  }

  private addGoToLoginPage(
    router: Router,
    btn: ButtonComponent,
    connection: MyWebSocket,
  ) {
    btn.addComponentEventListener(IEvents.click, () => {
      router.navigate("login", connection);
      this.logoutButtonComponent.hideButton();
      connection.user.logoutUser(connection);
    });
  }
}
