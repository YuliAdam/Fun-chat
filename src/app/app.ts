import { FooterView } from "./view/footer/footer-view";
import { HeaderView } from "./view/header/header-view";
import { Pages, Router, type IRoutes } from "./router/router";
import { MainView } from "./view/main/main-view";
import { NotFoundView } from "./view/main/not-found/not-found";
import { LoginView } from "./view/main/login/login-view";
import { MyWebSocket } from "./web-socket/web-socket";
import { IndexView } from "./view/main/index/index-view";
import { InfoView } from "./view/main/info/info-view";
import { User } from "./web-socket/user";

export class App {
  private connection: MyWebSocket;
  private router: Router;
  private main: MainView;
  private notFound: NotFoundView;
  private login: LoginView;
  public header: HeaderView;
  public index: IndexView;
  private info: InfoView;
  private user: User;
  constructor() {
    this.user = new User();
    this.connection = new MyWebSocket(this.user, this);
    this.router = new Router(this.createRoutes(), this.connection);
    this.main = new MainView();
    this.notFound = new NotFoundView(this.router, this.connection);
    this.header = new HeaderView(this.router, this.connection);
    this.index = new IndexView(this.connection);
    this.login = new LoginView(this.router, this.header, this.connection);
    this.info = new InfoView(this.router, this.header, this.connection);
    this.createView();
  }

  private createView(): void {
    const footerView: HTMLElement | null = new FooterView().getHTMLElement();
    App.appendElements([
      this.header.getHTMLElement(),
      this.main.getHTMLElement(),
      footerView,
    ]);
  }

  private static appendElements(el: Array<HTMLElement | null>): void {
    el.forEach((e) => {
      if (e instanceof Node) {
        document.body.append(e);
      }
    });
  }

  private createRoutes(): IRoutes[] {
    return [
      {
        path: Pages.INDEX,
        callBack: () => {
          this.main.setContent(this.index.viewComponent);
          this.index.messageView.historyComponent.goToLastMessage();
          this.header.navComponent.buttonsArr.infoButtonComponent.showButton();
          this.header.navComponent.buttonsArr.logoutButtonComponent.showButton();
        },
      },
      {
        path: Pages.LOGIN,
        callBack: () => {
          this.user = new User();
          this.index = new IndexView(this.connection);
          this.main.setContent(this.login.viewComponent);
          this.header.navComponent.buttonsArr.infoButtonComponent.showButton();
          this.header.navComponent.buttonsArr.logoutButtonComponent.hideButton();
        },
      },
      {
        path: "",
        callBack: () => {
          this.main.setContent(this.login.viewComponent);
          this.header.navComponent.buttonsArr.infoButtonComponent.showButton();
        },
      },
      {
        path: Pages.NOT_FOUND,
        callBack: () => {
          this.main.setContent(this.notFound.viewComponent);
          this.header.navComponent.buttonsArr.infoButtonComponent.showButton();
        },
      },
      {
        path: Pages.INFO,
        callBack: () => {
          this.main.setContent(this.info.viewComponent);
          this.header.navComponent.buttonsArr.infoButtonComponent.hideButton();
        },
      },
    ];
  }
}
