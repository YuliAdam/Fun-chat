import { BaseComponent, IBaseComponentParam } from "../../util/base-component";

export abstract class View {
    public viewComponent: BaseComponent;
    constructor(params: IBaseComponentParam) {
        this.viewComponent = this.createView(params);
    }

    public getHTMLElement(): HTMLElement | null {
        return this.viewComponent.getElement();
    }

    private createView(params: IBaseComponentParam): BaseComponent {
        const viewParam: IBaseComponentParam = {
            tag: params.tag,
            classList: params.classList,
            textContent: params.textContent,
        };

        const view: BaseComponent = new BaseComponent(viewParam);
        return view;
    }
}
