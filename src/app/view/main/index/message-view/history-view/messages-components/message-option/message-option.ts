import "./message-option.css";
import {
  BaseComponent,
  IBaseComponentParam,
  IEvents,
} from "../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../util/components/button-component";
import { ISendMessageResponse } from "../../../../../../../web-socket/web-socket-interface";
import { User } from "../../../../../../../web-socket/user";
import { MyWebSocket } from "../../../../../../../web-socket/web-socket";
import { HistoryMessageView } from "../message-view";
import { DialogView } from "./change-message-dialog/change-message-dialog";

const CssClasses = {
  option: ["message_option"],
  state: ["option_state"],
  button: ["option_button"],
  wrapper: ["option_wrapper"],
};

const CHANGE_BUTTON_TEXT = "change";
const DELETE_BUTTON_TEXT = "delete";
const EDITED_TEXT = "(edited)";

export class MessageOptionComponent extends BaseComponent {
  public stateComponent: BaseComponent;
  public changeButtonComponent: ButtonComponent;
  public deleteButtonComponent: ButtonComponent;
  public messageEditorComponent: DialogView;
  public editedStateComponent: BaseComponent;
  constructor(
    message: ISendMessageResponse,
    connection: MyWebSocket,
    historyMessage: HistoryMessageView,
  ) {
    const params: IBaseComponentParam = {
      classList: CssClasses.option,
    };
    super(params);
    this.stateComponent = this.createStateComponent(this.getStatus(message));
    this.changeButtonComponent = this.createChangeButtonComponent();
    this.deleteButtonComponent = this.createDeleteButtonComponent();
    this.messageEditorComponent = this.getMessageEditorComponent(
      connection,
      historyMessage,
    );
    this.editedStateComponent = this.createEditedComponent(
      message.status.isEdited,
    );
    this.configComponent(message, connection.user, connection, historyMessage);
  }

  public hideEditedStateComponent() {
    this.editedStateComponent.addClassIfHasNot("display-none");
  }

  public showEditedStateComponent() {
    this.editedStateComponent.removeClass("display-none");
  }

  private configComponent(
    message: ISendMessageResponse,
    user: User,
    connection: MyWebSocket,
    historyMessageView: HistoryMessageView,
  ) {
    const wrapper = new BaseComponent({ classList: CssClasses.wrapper });
    wrapper.appendChildComponents([
      this.deleteButtonComponent,
      this.changeButtonComponent,
      this.messageEditorComponent.viewComponent,
    ]);
    this.addDeleteMessageEvent(message, user, connection, historyMessageView);
    this.appendChildComponents([
      wrapper,
      this.editedStateComponent,
      this.stateComponent,
    ]);
  }

  private getMessageEditorComponent(
    connection: MyWebSocket,
    message: HistoryMessageView,
  ) {
    return new DialogView(message, connection);
  }

  private createStateComponent(state: string) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.state,
      textContent: state,
    };
    return new BaseComponent(params);
  }

  private createEditedComponent(isEdit: boolean) {
    const params: IBaseComponentParam = {
      tag: "p",
      classList: CssClasses.state,
      textContent: EDITED_TEXT,
    };
    const editedComponent = new BaseComponent(params);
    if (!isEdit) {
      editedComponent.addClassIfHasNot("display-none");
    }
    return editedComponent;
  }

  private getStatus(message: ISendMessageResponse) {
    const SENDING_TEXT = "sended";
    const READING_TEXT = "readed";
    const DELIVERY_TEXT = "delivered";
    return message.status.isReaded
      ? READING_TEXT
      : message.status.isDelivered
        ? DELIVERY_TEXT
        : SENDING_TEXT;
  }

  private createChangeButtonComponent() {
    const params: IBaseComponentParam = {
      classList: CssClasses.button,
      textContent: CHANGE_BUTTON_TEXT,
    };
    const changeButtonComponent = new ButtonComponent(params);
    changeButtonComponent.addComponentEventListener(IEvents.click, () =>
      this.openMessageEditor(),
    );
    return changeButtonComponent;
  }

  private createDeleteButtonComponent() {
    const params: IBaseComponentParam = {
      classList: CssClasses.button,
      textContent: DELETE_BUTTON_TEXT,
    };
    const deleteButtonComponent = new ButtonComponent(params);
    return deleteButtonComponent;
  }

  public addDeleteMessageEvent(
    message: ISendMessageResponse,
    user: User,
    connection: MyWebSocket,
    historyMessageView: HistoryMessageView,
  ) {
    this.deleteButtonComponent.addComponentEventListener(IEvents.click, () => {
      user.deleteMessageRequest(message, connection);
      this.removeMessageFromHistory(historyMessageView);
    });
  }

  public removeMessageFromHistory(historyMessageView: HistoryMessageView) {
    historyMessageView.viewComponent.removeComponent();
  }

  public openMessageEditor() {
    this.messageEditorComponent.openDialog();
  }
}
