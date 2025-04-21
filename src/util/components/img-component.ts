import { BaseComponent, type IBaseComponentParam } from "../base-component";

export interface IImgParam {
  src: string;
  alt: string;
}

export class ImgComponent extends BaseComponent {
  constructor(baseParam: IBaseComponentParam, imgParam: IImgParam) {
    const param: IBaseComponentParam = {
      tag: "img",
      classList: baseParam.classList,
      textContent: baseParam.textContent,
    };
    super(param);
    this.configurateComponent(imgParam);
  }

  private configurateComponent(imgParam: IImgParam) {
    this.setSrc(imgParam.src);
    this.setAlt(imgParam.alt);
  }

  private setSrc(src: string): void {
    this.setComponentAttribute("src", src);
  }

  private setAlt(alt: string = "img"): void {
    this.setComponentAttribute("alt", alt);
  }
}
