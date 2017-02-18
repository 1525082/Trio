import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {CheckDataService} from "./check-data.service";
import {restUrls} from "../classes/restUrls.class";
import {Http, Headers, Response} from "@angular/http";

@Injectable()
export class AuthenticationService {
    private isAuth: boolean = false;
    private token: string;

    private localStorageTokenID = "token";
    private loginPath = "/home";
    private logoutPath = "";

    constructor(private router: Router,
                private http: Http,
                private checkService: CheckDataService) {
        let token = localStorage.getItem(this.localStorageTokenID);
        if (token != null) {
            this.success(token);
        } else {
            this.redirect(this.logoutPath);
        }
    }

    public login(username, password) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let observable = this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({username, password}),
            {headers: headers})
            .map((res: Response) => res.json());
        observable.subscribe(
            data => this.handleSuccess(data, this),
            this.handleError
        );
        return observable;
    }

    public logout() {
        localStorage.removeItem(this.localStorageTokenID);
        this.redirect(this.logoutPath);
    }

    private handleSuccess(data, obj: AuthenticationService) {
        if (data) {
            if (data.token) {
                obj.success(data.token);
            }
        }
    }

    private success(token) {
        if (this.checkService) {
            this.checkService.preloadData(token);
        }
        localStorage.setItem(this.localStorageTokenID, token);
        this.setToken(token);
        this.setIsAuth(true);
        this.redirect(this.loginPath);
    }

    public handleError(error: any) {
        //console.error("FEHLER:", error);
    }

    /**
     * Navigates the router to the given path.
     * @param path where to navigate
     */
    private redirect(path) {
        this.router.navigate([path]);
    }

    public setToken(token: string) {
        this.token = token;
    }

    public getToken() {
        return this.token;
    }

    private setIsAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    public isAuthenticated(): boolean {
        return this.isAuth;
    }
}
