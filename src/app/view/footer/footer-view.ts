import "./footer-view.css";
import type { IBaseComponentParam } from "../../../util/base-component";
import { BaseComponent } from "../../../util/base-component";
import { View } from "../view";
import { FooterLinkChildren } from "./link-children/link-children.ts";
import { LinkComponent } from "../../../util/components/link-component/link-component.ts";

const CssClasses: { footer: string[]; title: string[] } = {
    footer: ["footer"],
    title: ["footer_title"],
};

export class FooterView extends View {
    constructor() {
        const footerParam: IBaseComponentParam = {
            tag: "footer",
            classList: CssClasses.footer,
        };
        super(footerParam);
        this.configView();
    }

    protected configView(): void {
        const childrenEl: Array<LinkComponent | BaseComponent> =
            FooterView.createChildrenComponents();
        this.viewComponent.appendChildComponents(childrenEl);
    }

    private static createTextComponent(): BaseComponent {
        const h1Param: IBaseComponentParam = {
            tag: "p",
            textContent: "/2025",
            classList: CssClasses.title,
        };
        return new BaseComponent(h1Param);
    }

    private static createChildrenComponents(): Array<
        LinkComponent | BaseComponent
    > {
        const links: Array<LinkComponent | BaseComponent> =
            new FooterLinkChildren().childArray;
        const text: BaseComponent = this.createTextComponent();
        links.splice(2, 0, text);
        return links;
    }
}
