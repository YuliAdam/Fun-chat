import { BaseComponent, type IBaseComponentParam } from "../base-component";

export class ButtonComponent extends BaseComponent {
  constructor(baseParam: IBaseComponentParam) {
    const param: IBaseComponentParam = {
      tag: "button",
      classList: baseParam.classList,
      textContent: baseParam.textContent,
    };
    super(param);
  }

  public doDisabled() {
    this.setComponentAttribute("disabled", "true");
  }
  public removeDisabled() {
    this.removeComponentAttribute("disabled");
  }

  public hideButton() {
    this.addClassIfHasNot("opacity");
    this.doDisabled();
  }

  public showButton() {
    this.removeDisabled();
    this.removeClass("opacity");
  }
}
