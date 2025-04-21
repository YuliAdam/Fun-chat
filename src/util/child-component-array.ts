import { BaseComponent } from "./base-component";

export abstract class ComponentChildren<T extends BaseComponent> {
    public childArray: Array<T>;
    constructor() {
        this.childArray = this.getComponentArr();
    }

    protected abstract getComponentArr(): Array<T>;
}
