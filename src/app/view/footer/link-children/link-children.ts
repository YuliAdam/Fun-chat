import "./link-footer.css";
import { ComponentChildren } from "../../../../util/child-component-array";
import { FooterImgComponents } from "./img-children/img-children";
import { LinkComponent } from "../../../../util/components/link-component/link-component";
import { ImgComponent } from "../../../../util/components/img-component";
import { IBaseComponentParam } from "../../../../util/base-component";

const hrefParams: { gitHub: string; rsSchool: string } = {
  gitHub: "https://github.com/YuliAdam",
  rsSchool: "https://rs.school/courses/javascript-ru",
};

const CssClasses = {
  title: ["footer_title"],
};

export class FooterLinkChildren extends ComponentChildren<LinkComponent> {
  constructor() {
    super();
  }

  protected getComponentArr(): Array<LinkComponent> {
    return [
      this.createGitHubImgComponent(),
      this.createGitHubComponent(),
      this.createRsSchoolComponent(),
    ];
  }

  protected createGitHubImgComponent(): LinkComponent {
    const linkGitHubComponent: LinkComponent = new LinkComponent(
      {},
      hrefParams.gitHub,
    );
    const imgChildComponent: ImgComponent = this.createImgChildren().gitHubImg;
    linkGitHubComponent.appendChildComponents([imgChildComponent]);
    return linkGitHubComponent;
  }

  protected createGitHubComponent(): LinkComponent {
    const linkParamGitHub: IBaseComponentParam = {
      classList: CssClasses.title,
      textContent: "@YuliAdam",
    };
    return new LinkComponent(linkParamGitHub, hrefParams.gitHub);
  }

  protected createRsSchoolComponent(): LinkComponent {
    const linkRsSchoolComponent: LinkComponent = new LinkComponent(
      {},
      hrefParams.rsSchool,
    );
    const imgChildComponent: ImgComponent =
      this.createImgChildren().rSSchoolImg;
    linkRsSchoolComponent.appendChildComponents([imgChildComponent]);
    return linkRsSchoolComponent;
  }

  private createImgChildren(): {
    gitHubImg: ImgComponent;
    rSSchoolImg: ImgComponent;
  } {
    const imgChildrens = new FooterImgComponents();
    const images = {
      gitHubImg: imgChildrens.gitHubImg,
      rSSchoolImg: imgChildrens.rSSchoolImg,
    };
    return images;
  }
}
