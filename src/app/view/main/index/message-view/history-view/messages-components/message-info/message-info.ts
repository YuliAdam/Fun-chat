import "./message-info.css";
import {
  BaseComponent,
  IBaseComponentParam,
} from "../../../../../../../../util/base-component";
import { MyWebSocket } from "../../../../../../../web-socket/web-socket";
import { ISendMessageResponse } from "../../../../../../../web-socket/web-socket-interface";

const CssClasses = {
  info: ["message_info"],
  text: ["info"],
};

const YOU_MESSAGE_USERNAME = "You";

export class MessageInfoComponent extends BaseComponent {
  public usernameComponent: BaseComponent;
  private dateComponent: BaseComponent;
  constructor(message: ISendMessageResponse, connection: MyWebSocket) {
    const params: IBaseComponentParam = {
      classList: CssClasses.info,
    };
    super(params);
    this.usernameComponent = this.createUsernameComponent(
      message.from,
      connection,
    );
    this.dateComponent = this.createDateComponent(message.datetime);
    this.configView();
  }

  private configView() {
    this.appendChildComponents([this.usernameComponent, this.dateComponent]);
  }

  private createUsernameComponent(username: string, connection: MyWebSocket) {
    const params: IBaseComponentParam = {
      classList: CssClasses.text,
      textContent:
        username === connection.user.username ? YOU_MESSAGE_USERNAME : username,
    };
    return new BaseComponent(params);
  }

  private createDateComponent(date: number) {
    const params: IBaseComponentParam = {
      classList: CssClasses.text,
      textContent: this.getFormatDate(new Date(date)),
    };
    return new BaseComponent(params);
  }

  private getFormatDate(date: Date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const hour =
      date.getHours() >= 10 ? `${date.getHours()}` : `0${date.getHours()}`;
    const min =
      date.getMinutes() >= 10
        ? `${date.getMinutes()}`
        : `0${date.getMinutes()}`;
    const sec =
      date.getSeconds() >= 10
        ? `${date.getSeconds()}`
        : `0${date.getSeconds()}`;
    return `${day}/${month}/${year}, ${hour}:${min}:${sec}`;
  }
}
