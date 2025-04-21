import "./form-elements.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../util/base-component";
import { ButtonComponent } from "../../../../../util/components/button-component";
import { FormComponent } from "../../../../../util/components/form-component";
import {
  IInputParam,
  IInputType,
  InputComponent,
} from "../../../../../util/components/input-component";
import { LableComponent } from "../../../../../util/components/label-component";
import { Router } from "../../../../router/router";
import { FormButton } from "./form-button/form-button";
import { HeaderView } from "../../../header/header-view";
import { MyWebSocket } from "../../../../web-socket/web-socket";

const CssClasses = {
  form: ["login_form"],
  login: ["form_login"],
  password: ["form_password"],
  label: ["form_label"],
  validation: ["form_validation-message"],
};

const labelText = {
  LOGIN: "Username",
  PASSWORD: "Password",
};

const VALIDATION_LOGIN_TEXT = "Length should be min 4 and max 12 characters";
const VALIDATION_PASSWORD_TEXT =
  "Password should be min 4 and max 20 characters of different case";
const ERROR_LOGINING_TEXT = "Username or password isn't right";
const MIN_SYMBOL_NUM_BY_VALIDATION = 4;
const MAX_SYMBOL_NUM_BY_USERNAME = 12;
const MAX_SYMBOL_NUM_BY_PASSWORD = 20;

export class LoginForm extends FormComponent {
  public loginComponent: InputComponent;
  public passwordComponent: InputComponent;
  private buttonComponent: ButtonComponent;
  private validationLoginMessage: BaseComponent;
  private validationPasswordMessage: BaseComponent;
  public loginingMessage: BaseComponent;
  constructor(router: Router, header: HeaderView, connection: MyWebSocket) {
    const formParams: IBaseComponentParam = {
      classList: CssClasses.form,
    };
    super(formParams);
    this.loginComponent = this.createLoginInputComponent();
    this.validationLoginMessage = this.createValidationLoginMessage();
    this.passwordComponent = this.createPasswordInputComponent();
    this.addEvents();
    this.validationPasswordMessage = this.createValidationPasswordMessage();
    this.loginingMessage = this.createErrorLoginingMessage();
    this.buttonComponent = this.getFormButton(router, header, this, connection);
    this.configComponent();
  }

  public clearForm() {
    this.loginComponent.setValue("");
    this.passwordComponent.setValue("");
    this.loginingMessage.addClassIfHasNot("opacity");
  }

  private validationLogin() {
    const text = this.loginComponent.getValue();
    if (
      text.length >= MIN_SYMBOL_NUM_BY_VALIDATION &&
      text.length <= MAX_SYMBOL_NUM_BY_USERNAME
    ) {
      return true;
    }
    return false;
  }

  private validationPassword() {
    const text = this.passwordComponent.getValue();
    if (
      text.length >= MIN_SYMBOL_NUM_BY_VALIDATION &&
      text.length <= MAX_SYMBOL_NUM_BY_PASSWORD &&
      text !== text.toLocaleLowerCase() &&
      text !== text.toLocaleUpperCase()
    ) {
      return true;
    }
    return false;
  }

  private configComponent() {
    const loginLable = new LableComponent({
      classList: CssClasses.label,
      textContent: labelText.LOGIN,
    });
    const passwordLable = new LableComponent({
      classList: CssClasses.label,
      textContent: labelText.PASSWORD,
    });
    this.appendChildComponents([
      loginLable,
      this.loginComponent,
      this.validationLoginMessage,
      passwordLable,
      this.passwordComponent,
      this.validationPasswordMessage,
      this.buttonComponent,
      this.loginingMessage,
    ]);
  }

  private createLoginInputComponent() {
    const params: IBaseComponentParam = {
      classList: CssClasses.login,
    };
    const inputParams: IInputParam = {
      type: IInputType.text,
    };
    const loginComponent = new InputComponent(params, inputParams);
    loginComponent.doRequired();
    loginComponent.setMinMaxLength(4, 12);
    return loginComponent;
  }

  private createValidationLoginMessage() {
    const messageComponent = new BaseComponent({
      tag: "p",
      classList: CssClasses.validation,
      textContent: VALIDATION_LOGIN_TEXT,
    });
    messageComponent.addClassIfHasNot("opacity");
    return messageComponent;
  }

  private createPasswordInputComponent() {
    const params: IBaseComponentParam = {
      classList: CssClasses.password,
    };
    const inputParams: IInputParam = {
      type: IInputType.password,
    };
    const passwordComponent = new InputComponent(params, inputParams);
    passwordComponent.doRequired();
    passwordComponent.setMinMaxLength(4, 20);
    return passwordComponent;
  }

  private createValidationPasswordMessage() {
    const messageComponent = new BaseComponent({
      tag: "p",
      classList: CssClasses.validation,
      textContent: VALIDATION_PASSWORD_TEXT,
    });
    messageComponent.addClassIfHasNot("opacity");
    return messageComponent;
  }

  private createErrorLoginingMessage() {
    const messageComponent = new BaseComponent({
      tag: "p",
      classList: CssClasses.validation,
      textContent: ERROR_LOGINING_TEXT,
    });
    messageComponent.addClassIfHasNot("opacity");
    return messageComponent;
  }

  private getFormButton(
    router: Router,
    header: HeaderView,
    loginForm: LoginForm,
    connection: MyWebSocket,
  ) {
    return new FormButton(router, header, loginForm, connection);
  }

  private addEvents() {
    this.addloginEnterEvent();
    this.addloginInputEvent();
    this.addPasswordEnterEvent();
    this.addPasswordInputEvent();
  }

  private addloginEnterEvent() {
    this.loginComponent.addComponentEventListener(IEvents.keydown, (e) => {
      if (e instanceof KeyboardEvent && e.key === "Enter") {
        if (this.validationLogin()) {
          this.validationLoginMessage.addClassIfHasNot("opacity");
        } else {
          this.validationLoginMessage.removeClass("opacity");
        }
      }
    });
  }

  private addPasswordEnterEvent() {
    this.passwordComponent.addComponentEventListener(IEvents.keydown, (e) => {
      if (e instanceof KeyboardEvent && e.key === "Enter") {
        if (this.validationPassword()) {
          this.validationPasswordMessage.addClassIfHasNot("opacity");
        } else {
          this.validationPasswordMessage.removeClass("opacity");
        }
      }
    });
  }

  private addloginInputEvent() {
    this.loginComponent.addComponentEventListener(IEvents.input, () => {
      if (this.validationLogin()) {
        this.validationLoginMessage.addClassIfHasNot("opacity");
        if (this.isValidData()) {
          this.buttonComponent.removeDisabled();
        }
      } else {
        this.buttonComponent.doDisabled();
      }
    });
  }

  private addPasswordInputEvent() {
    this.passwordComponent.addComponentEventListener(IEvents.input, () => {
      if (this.validationPassword()) {
        this.validationPasswordMessage.addClassIfHasNot("opacity");
        if (this.isValidData()) {
          this.buttonComponent.removeDisabled();
        }
      } else {
        this.buttonComponent.doDisabled();
      }
    });
  }

  private isValidData() {
    return this.validationLogin() && this.validationPassword();
  }
}
