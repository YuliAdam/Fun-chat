import "./img-footer.css";
import {
    type IImgParam,
    ImgComponent,
} from "../../../../../util/components/img-component";
import { IBaseComponentParam } from "../../../../../util/base-component";

const imgParams: { gitHub: IImgParam; rsSchool: IImgParam } = {
    gitHub: {
        src: "github-logo.svg",
        alt: "GitHub logo",
    },
    rsSchool: {
        src: "rsSchool-logo.svg",
        alt: "RSSchool logo",
    },
};

const CssClasses: { gitHubImg: string[]; rsSchoolImg: string[] } = {
    gitHubImg: ["link_git-hub"],
    rsSchoolImg: ["link_rs-school"],
};

export class FooterImgComponents {
    public gitHubImg: ImgComponent;
    public rSSchoolImg: ImgComponent;
    constructor() {
        this.gitHubImg = this.createGitHubImg();
        this.rSSchoolImg = this.createRSSchoolImg();
    }

    private createGitHubImg(): ImgComponent {
        const imgParamGitHub: IBaseComponentParam = {
            classList: CssClasses.gitHubImg,
        };
        return new ImgComponent(imgParamGitHub, imgParams.gitHub);
    }
    private createRSSchoolImg(): ImgComponent {
        const imgParamRsSchool: IBaseComponentParam = {
            classList: CssClasses.rsSchoolImg,
        };
        return new ImgComponent(imgParamRsSchool, imgParams.rsSchool);
    }
}
