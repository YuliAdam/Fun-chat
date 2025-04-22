import "./info-view.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../util/base-component";
import { ButtonComponent } from "../../../../util/components/button-component";
import { Router } from "../../../router/router";
import { View } from "../../view";
import { HeaderView } from "../../header/header-view";
import { MyWebSocket } from "../../../web-socket/web-socket";

const CssClasses = {
  info: ["main_info"],
  text: ["info_text"],
  back: ["info_back"],
};

const INFO_TEXT = `These application is create by Fun Chat task as part of the RSSchool JS/FE 2025. Thank you by review.
Author @YuliAdam`;
const BACK_BUTTON_TEXT = "Back";

export class InfoView extends View {
  constructor(router: Router, header: HeaderView, connection: MyWebSocket) {
    const param: IBaseComponentParam = {
      classList: CssClasses.info,
    };
    super(param);
    this.configComponent(router, header, connection);
  }

  private configComponent(
    router: Router,
    header: HeaderView,
    connection: MyWebSocket,
  ) {
    this.viewComponent.appendChildComponents([
      this.createText(),
      this.createBackBtn(),
    ]);
    this.addEventBack(router, header, connection);
  }

  private createText(): BaseComponent {
    const textParam: IBaseComponentParam = {
      classList: CssClasses.text,
      textContent: INFO_TEXT,
    };
    return new BaseComponent(textParam);
  }

  private createBackBtn(): ButtonComponent {
    const backBtnParam: IBaseComponentParam = {
      classList: CssClasses.back,
      textContent: BACK_BUTTON_TEXT,
    };
    return new ButtonComponent(backBtnParam);
  }

  private addEventBack(
    router: Router,
    header: HeaderView,
    connection: MyWebSocket,
  ) {
    this.viewComponent.addComponentEventListener(IEvents.click, () => {
      if (connection.user.isLogined) {
        router.navigate("index", connection);
      } else {
        router.navigate("login", connection);
      }
      header.navComponent.buttonsArr.infoButtonComponent.showButton();
    });
  }
}
