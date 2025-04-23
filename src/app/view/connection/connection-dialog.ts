import "./connection-dialog.css";
import {
  BaseComponent,
  IBaseComponentParam,
} from "../../../util/base-component";
import { View } from "../view";

const CssClasses = {
  dialog: ["connection_dialog"],
  text: ["dialog_text"],
};

const CONNECTING_TEXT = "Connecting...";

export class ConnectionDialog extends View {
  public textComponent: BaseComponent;
  constructor() {
    const dialogParams: IBaseComponentParam = {
      tag: "dialog",
      classList: CssClasses.dialog,
    };
    super(dialogParams);
    this.textComponent = this.createTextComponent();
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

  public closeDialog(): void {
    const dialog: HTMLElement | null = this.getHTMLElement();
    if (dialog && dialog instanceof HTMLDialogElement) {
      dialog.classList.add("open");
      dialog.close();
      setTimeout(() => {
        dialog.classList.remove("open");
      }, 100);
    }
  }

  private configView() {
    this.viewComponent.appendChildComponents([this.textComponent]);
  }

  private createTextComponent() {
    const textParams: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.text,
      textContent: CONNECTING_TEXT,
    };
    return new BaseComponent(textParams);
  }
}
