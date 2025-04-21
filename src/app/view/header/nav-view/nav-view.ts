import "./nav-view.css";
import {
  BaseComponent,
  IBaseComponentParam,
} from "../../../../util/base-component";
import { Router } from "../../../router/router";
import { View } from "../../view";
import { NavButtonChildren } from "./nav-buttons/nav-buttons";
import { MyWebSocket } from "../../../web-socket/web-socket";

const CssClasses = {
  nav: ["header_nav"],
};

export class HeaderNav extends View {
  public logoutButtonComponent: BaseComponent;
  public infoButtonComponent: BaseComponent;
  public buttonsArr: NavButtonChildren;
  constructor(router: Router, connection: MyWebSocket) {
    const navParam: IBaseComponentParam = {
      tag: "nav",
      classList: CssClasses.nav,
    };
    super(navParam);
    this.logoutButtonComponent = new BaseComponent(navParam);
    this.infoButtonComponent = new BaseComponent(navParam);
    this.buttonsArr = this.getButtonsComponents(router, connection);
    this.configView();
  }

  private configView() {
    this.infoButtonComponent.appendChildComponents([
      this.buttonsArr.infoButtonComponent,
    ]);
    this.logoutButtonComponent.appendChildComponents([
      this.buttonsArr.logoutButtonComponent,
    ]);
  }

  private getButtonsComponents(router: Router, connection: MyWebSocket) {
    return new NavButtonChildren(router, connection);
  }
}
