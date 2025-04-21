import "./link-basic.css";
import { BaseComponent, type IBaseComponentParam } from "../../base-component";

const LINK_BASIC_STYLE = "link-basic";

export class LinkComponent extends BaseComponent {
  constructor(baseParam: IBaseComponentParam, href: string) {
    const param: IBaseComponentParam = {
      tag: "a",
      classList: [...(baseParam.classList ?? []), LINK_BASIC_STYLE],
      textContent: baseParam.textContent,
    };
    super(param);
    this.configurateComponent(href);
  }

  private configurateComponent(href: string) {
    this.setHref(href);
  }

  private setHref(href: string): void {
    this.setComponentAttribute("href", href);
  }
}
