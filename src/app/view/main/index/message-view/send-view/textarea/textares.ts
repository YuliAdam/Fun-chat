import "./textarea.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../../../util/base-component";
import { SendButton } from "../send-button/send-button";

const CssClasses = {
  textarea: ["send_textarea"],
};

const TEXTAREA_PLACEHOLDER = "Send message...";

export class Textarea extends BaseComponent {
  constructor(sendButton: SendButton) {
    const params: IBaseComponentParam = {
      tag: "textarea",
      classList: CssClasses.textarea,
    };
    super(params);
    this.setComponentAttribute("placeholder", TEXTAREA_PLACEHOLDER);
    this.addInputEvent(sendButton);
    this.addEnterSendEvent(sendButton);
    this.setComponentAttribute("disabled", "true");
  }

  private addInputEvent(sendButton: SendButton) {
    this.addComponentEventListener(IEvents.input, () => {
      const textElement = this.getElement();
      if (textElement && textElement instanceof HTMLTextAreaElement) {
        const length = textElement.value.length;
        if (length > 0) {
          sendButton.removeDisabled();
        } else {
          sendButton.doDisabled();
        }
      }
    });
  }

  private addEnterSendEvent(sendButton: SendButton) {
    this.addComponentEventListener(IEvents.keydown, (e) => {
      if (e instanceof KeyboardEvent && e.key === "Enter") {
        e.preventDefault();
        const textElement = this.getElement();
        const buttonEl = sendButton.getElement();
        if (
          textElement &&
          textElement instanceof HTMLTextAreaElement &&
          buttonEl
        ) {
          const length = textElement.value.length;
          if (length > 0) {
            buttonEl.click();
            sendButton.doDisabled();
          }
        }
      }
    });
  }

  public getValue() {
    const textElement = this.getElement();
    let value = "";
    if (textElement && textElement instanceof HTMLTextAreaElement) {
      value = textElement.value;
    }
    return value;
  }

  public setValue(text: string) {
    const textElement = this.getElement();
    if (textElement && textElement instanceof HTMLTextAreaElement) {
      textElement.value = text;
    }
  }
}
