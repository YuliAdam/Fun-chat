import "./form-button.css";
import {
  IBaseComponentParam,
  IEvents,
} from "../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../util/components/button-component";
import { Router } from "../../../../../router/router";
import { HeaderView } from "../../../../header/header-view";
import { LoginForm } from "../form-component";
import { MyWebSocket } from "../../../../../web-socket/web-socket";

const CssClasses = {
  button: ["form_submit"],
};

const LOGIN_TEXT = "Login";

export class FormButton extends ButtonComponent {
  constructor(
    router: Router,
    header: HeaderView,
    formComponent: LoginForm,
    connection: MyWebSocket,
  ) {
    const params: IBaseComponentParam = {
      classList: CssClasses.button,
      textContent: LOGIN_TEXT,
    };
    super(params);
    this.configComponent(router, header, formComponent, connection);
  }

  private configComponent(
    router: Router,
    header: HeaderView,
    formComponent: LoginForm,
    connection: MyWebSocket,
  ) {
    this.doDisabled();
    this.addGoToIndexPageEvent(router, header, formComponent, connection);
  }

  private addGoToIndexPageEvent(
    router: Router,
    header: HeaderView,
    formComponent: LoginForm,
    connection: MyWebSocket,
  ) {
    this.addComponentEventListener(IEvents.click, () => {
      connection.user.loginUser(
        connection,
        formComponent.loginComponent.getValue(),
        formComponent.passwordComponent.getValue(),
      );
      connection.setEventAfterLoginResponse(
        this.addLoginingValidationEvent,
        router,
        header,
        formComponent,
      );
    });
  }

  private addLoginingValidationEvent(
    router: Router,
    header: HeaderView,
    formComponent: LoginForm,
    connection: MyWebSocket,
  ) {
    if (connection.user.isLogined) {
      router.navigate("index", connection);
      header.navComponent.buttonsArr.logoutButtonComponent.showButton();
      formComponent.clearForm();
    } else {
      formComponent.loginingMessage.setTextContent(
        connection.user.errorMessage,
      );
      formComponent.loginingMessage.removeClass("opacity");
      connection.user.clearUserAcessData();
    }
  }
}
