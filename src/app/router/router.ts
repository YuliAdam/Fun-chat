import { MyWebSocket } from "../web-socket/web-socket";

export interface IRoutes {
  path: string;
  callBack: () => void;
}

export const Pages: {
  INDEX: string;
  LOGIN: string;
  NOT_FOUND: string;
  INFO: string;
} = {
  INDEX: "index",
  LOGIN: "login",
  NOT_FOUND: "not-found",
  INFO: "info",
};

export class Router {
  private routes;

  constructor(routes: IRoutes[], connection: MyWebSocket) {
    this.routes = routes;

    document.addEventListener("DOMContentLoaded", () => {
      const path = this.getCurrentPath();
      this.navigate(path, connection, false);
    });
    window.addEventListener(
      "popstate",
      this.browserChangeHundler.bind(this, connection),
    );
    window.addEventListener(
      "hashchange",
      this.browserChangeHundler.bind(this, connection),
    );
  }

  public navigate(
    url: string,
    connection: MyWebSocket,
    addToHistory: boolean = true,
  ) {
    let route = this.routes.find((item) => item.path === url);
    if (!route) {
      this.redirectToNotFound(connection);
      return;
    } else {
      if (route.path === Pages.INDEX && !connection.user.isLogined) {
        this.redirectToLogin(connection);
      } else {
        route.callBack();
        if (addToHistory) {
          window.history.pushState({}, "", `/${url}`);
        }
      }
    }
  }

  private redirectToNotFound(connection: MyWebSocket): void {
    const routNotFound = this.routes.find(
      (item) => item.path === Pages.NOT_FOUND,
    );
    if (routNotFound) {
      this.navigate(routNotFound.path, connection);
    }
  }

  private redirectToLogin(connection: MyWebSocket): void {
    const routLogin = this.routes.find((item) => item.path === Pages.LOGIN);
    if (routLogin) {
      this.navigate(routLogin.path, connection);
    }
  }

  private browserChangeHundler(connection: MyWebSocket): void {
    const path = this.getCurrentPath();
    this.navigate(path, connection, false);
  }

  private getCurrentPath(): string {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    } else {
      return window.location.pathname.slice(1);
    }
  }
}
