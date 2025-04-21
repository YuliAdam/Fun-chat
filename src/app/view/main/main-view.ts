import "./main-view.css";
import {
    BaseComponent,
    type IBaseComponentParam,
} from "../../../util/base-component";
import { View } from "../view";

const CssClasses: { main: string[]; main_wrapper: string[] } = {
    main: ["main"],
    main_wrapper: ["main_wrapper"],
};

export class MainView extends View {
    constructor() {
        const mainParam: IBaseComponentParam = {
            tag: "main",
            classList: CssClasses.main,
        };
        super(mainParam);
    }

    public setContent(content: BaseComponent) {
        this.cleanMain();
        this.viewComponent.appendChildComponents([content]);
    }

    public cleanMain() {
        const mainEl: HTMLElement | null = this.viewComponent.getElement();
        if (mainEl) {
            while (mainEl.firstChild) {
                mainEl.firstChild.remove();
            }
        }
    }
}
