import "./change-message-dialog.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../../../../../util/base-component";
import { View } from "../../../../../../../view";
import { ButtonComponent } from "../../../../../../../../../util/components/button-component";
import { MyWebSocket } from "../../../../../../../../web-socket/web-socket";
import { HistoryMessageView } from "../../message-view";

const CssClasses = {
  dialog: ["option_dialog"],
  text: ["dialog_text"],
  btn: ["dialog_button"],
  wrapper: ["dialog_wrap"],
};

const CLOSE_BUTTON_TEXT = "Close";
const CHANGE_BUTTON_TEXT = "Change";

export class DialogView extends View {
  public id: string;
  public text: string;
  public closeButtonComponent: ButtonComponent;
  public textareaComponent: BaseComponent;
  public changeButtonComponent: ButtonComponent;
  constructor(message: HistoryMessageView, connection: MyWebSocket) {
    const dialogParams: IBaseComponentParam = {
      tag: "dialog",
      classList: CssClasses.dialog,
    };
    super(dialogParams);
    this.id = message.id;
    this.text = message.textComponent.getTextContent() ?? "";
    this.textareaComponent = this.createTextareaComponent();
    this.closeButtonComponent = this.createCloseComponent();
    this.changeButtonComponent = this.createChangeComponent(
      connection,
      message,
    );
    this.configView();
  }

  public openDialog() {
    const dialog: HTMLElement | null = this.getHTMLElement();
    if (
      dialog instanceof HTMLDialogElement &&
      !dialog.classList.contains("open")
    ) {
      dialog.showModal();
    }
  }

  private configView() {
    const buttonWrapper = new BaseComponent({ classList: CssClasses.wrapper });
    buttonWrapper.appendChildComponents([
      this.changeButtonComponent,
      this.closeButtonComponent,
    ]);
    this.viewComponent.appendChildComponents([
      this.textareaComponent,
      buttonWrapper,
    ]);
  }

  private createTextareaComponent() {
    const textParams: IBaseComponentParam = {
      tag: "textarea",
      classList: CssClasses.text,
      textContent: this.text,
    };
    return new BaseComponent(textParams);
  }

  private createCloseComponent() {
    const closeButtonParams: IBaseComponentParam = {
      classList: CssClasses.btn,
      textContent: CLOSE_BUTTON_TEXT,
    };
    const closeButtonComponent: ButtonComponent = new ButtonComponent(
      closeButtonParams,
    );
    closeButtonComponent.addComponentEventListener(IEvents.click, () =>
      this.closeDialog(),
    );
    return closeButtonComponent;
  }

  private createChangeComponent(
    connection: MyWebSocket,
    message: HistoryMessageView,
  ) {
    const changeButtonParams: IBaseComponentParam = {
      classList: CssClasses.btn,
      textContent: CHANGE_BUTTON_TEXT,
    };
    const changeButtonComponent: ButtonComponent = new ButtonComponent(
      changeButtonParams,
    );
    changeButtonComponent.addComponentEventListener(IEvents.click, () =>
      this.changeMessage(connection, message),
    );
    return changeButtonComponent;
  }

  private closeDialog(): void {
    const dialog: HTMLElement | null = this.getHTMLElement();
    if (dialog && dialog instanceof HTMLDialogElement) {
      dialog.classList.add("open");
      dialog.close();
      setTimeout(() => {
        dialog.classList.remove("open");
      }, 100);
    }
  }

  private changeMessage(
    connection: MyWebSocket,
    message: HistoryMessageView,
  ): void {
    const textareaEl = this.textareaComponent.getElement();
    if (textareaEl && textareaEl instanceof HTMLTextAreaElement) {
      const newText = textareaEl.value;
      connection.changeMessageRequest(this.id, newText);
      message.textComponent.setTextContent(newText);
      message.optionComponent.showEditedStateComponent();
      this.closeDialog();
    }
  }
}
