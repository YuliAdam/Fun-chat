import "./header-view.css";
import {
  type IBaseComponentParam,
  BaseComponent,
} from "../../../util/base-component";
import { View } from "../view";
import { HeaderNav } from "./nav-view/nav-view";
import { Router } from "../../router/router";
import { MyWebSocket } from "../../web-socket/web-socket";

const CssClasses = {
  header: ["header"],
  title: ["header_title"],
};

const TITLE_TEXT: string = "Fun chat";

export class HeaderView extends View {
  public navComponent: HeaderNav;
  constructor(router: Router, connection: MyWebSocket) {
    const headerParam: IBaseComponentParam = {
      tag: "header",
      classList: CssClasses.header,
    };
    super(headerParam);
    this.navComponent = this.getHeaderNav(router,connection);
    this.configView();
  }

  protected configView(): void {
    this.viewComponent.appendChildComponents([
      this.navComponent.logoutButtonComponent,
      this.createTitleComponent(),
      this.navComponent.infoButtonComponent,
    ]);
  }

  private createTitleComponent() {
    const h1Param: IBaseComponentParam = {
      tag: "h1",
      textContent: TITLE_TEXT,
      classList: CssClasses.title,
    };
    return new BaseComponent(h1Param);
  }

  private getHeaderNav(router: Router,connection: MyWebSocket) {
    return new HeaderNav(router,connection);
  }
}
