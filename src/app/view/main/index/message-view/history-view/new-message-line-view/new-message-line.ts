import './new-message-line.css'
import {
  BaseComponent,
  IBaseComponentParam,
} from "../../../../../../../util/base-component";

const CssClasses = {
  line: ["history_new-message-line"],
};

const NEW_MESSAGE_LINE_TEXT = "New Messages";

export class NewMessageLine extends BaseComponent {
  constructor() {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.line,
      textContent: NEW_MESSAGE_LINE_TEXT,
    };
    super(params);
  }

}
