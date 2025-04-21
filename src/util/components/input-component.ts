import { BaseComponent, type IBaseComponentParam } from "../base-component";

export enum IInputType {
  text = "text",
  password = "password",
  search = "search",
}

export interface IInputParam {
  type: IInputType;
  placeholder?: string;
}

export class InputComponent extends BaseComponent {
  constructor(baseParam: IBaseComponentParam, inputParam: IInputParam) {
    const param: IBaseComponentParam = {
      tag: "input",
      classList: baseParam.classList,
    };
    super(param);
    this.configurateComponent(inputParam);
  }

  public setValue(value: string) {
    if (this.component instanceof HTMLInputElement) {
      this.component.value = value;
    }
  }

  public getValue(): string {
    if (this.component instanceof HTMLInputElement) {
      return this.component.value;
    }
    return "";
  }

  public doRequired() {
    this.setComponentAttribute("required", "true");
  }

  public setMinMaxLength(min: number, max: number): void {
    this.setComponentAttribute("maxlength", max.toString());
    this.setComponentAttribute("minlength", min.toString());
  }

  private configurateComponent(inputParam: IInputParam) {
    this.setType(inputParam.type);
    if (inputParam.placeholder) {
      this.setPlaceholder(inputParam.placeholder);
    }
  }

  private setType(type: string): void {
    this.setComponentAttribute("type", type);
  }

  private setPlaceholder(text: string): void {
    this.setComponentAttribute("placeholder", text);
  }
}
