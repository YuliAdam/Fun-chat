import { BaseComponent, type IBaseComponentParam } from "../base-component";

export class LableComponent extends BaseComponent {
  constructor(baseParam: IBaseComponentParam) {
    const param: IBaseComponentParam = {
      tag: "lable",
      classList: baseParam.classList,
      textContent: baseParam.textContent,
    };
    super(param);
  }
}
