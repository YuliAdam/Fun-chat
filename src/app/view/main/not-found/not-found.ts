import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../util/base-component";
import { ButtonComponent } from "../../../../util/components/button-component";
import { Router } from "../../../router/router";
import { MyWebSocket } from "../../../web-socket/web-socket";
import { View } from "../../view";
import "./not-found.css";

const CssClasses: { notFound: string[]; text: string[]; back: string[] } = {
  notFound: ["main_not-found"],
  text: ["not-found_text"],
  back: ["not-found_back"],
};

const TEXT_NOT_FOUND = "PAGE NOT FOUND";
const BACK_BUTTON_TEXT = "Back to index page";

export class NotFoundView extends View {
  constructor(router: Router, connection: MyWebSocket) {
    const notFoundParam: IBaseComponentParam = {
      classList: CssClasses.notFound,
    };
    super(notFoundParam);
    this.configComponent(router, connection);
  }

  private configComponent(router: Router, connection: MyWebSocket) {
    this.viewComponent.appendChildComponents([
      this.createText(),
      this.createBackBtn(),
    ]);
    this.addEventBackMain(router, connection);
  }

  private createText(): BaseComponent {
    const textParam: IBaseComponentParam = {
      classList: CssClasses.text,
      textContent: TEXT_NOT_FOUND,
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

  private addEventBackMain(router: Router, connection: MyWebSocket) {
    this.viewComponent.addComponentEventListener(IEvents.click, () =>
      router.navigate("index", connection),
    );
  }
}
