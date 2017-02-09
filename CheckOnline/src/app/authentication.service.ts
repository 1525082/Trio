import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {CheckDataService} from "./check-data.service";
import {restUrls} from "./classes/restUrls.class";
import {Http, Headers, Response} from "@angular/http";

@Injectable()
export class AuthenticationService {
    private isAuth: boolean = false;
    private token: string;

    // TODO: wahrscheinlich für modalen Dialog benötigte Felder
    private isInvalid: boolean = false;
    private isError: boolean = false;

    private localStorageTokenID = "token";
    private loginPath = "/home";
    private logoutPath = "";

    constructor(private router: Router,
                private http: Http,
                private checkService: CheckDataService) {
        let token = localStorage.getItem(this.localStorageTokenID);
        console.log(localStorage.getItem(this.localStorageTokenID));
        if (token != null) {
            this.success(token);

            console.log("EINGELOGGT");
        } else {
            // not logged in
            console.log("NICHT EINGELOGGT");
            this.redirect(this.logoutPath);
        }
    }

    private login(username, password) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        this.http.put(restUrls.getLoginUrl(),
            JSON.stringify({username, password}),
            {headers: headers})
            .map((res: Response) => res.json())
            .subscribe(
                this.handleSuccess,
                this.handleError
            );
    }

    private handleSuccess(data) {
        if (data) {
            if (data.token) {
                this.success(data.token);
            }
        }
    }

    private success(token) {
        localStorage.setItem(this.localStorageTokenID, token);
        this.setToken(token);
        this.setIsAuth(true);
        this.redirect(this.loginPath);
    }

    public handleError(error: any) {
        console.error("FEHLER:", error);
    }

    /**
     * Navigates the router to the given path.
     * @param path where to navigate
     */
    private redirect(path) {
        this.router.navigate([path]);
    }

    private setToken(token: string) {
        this.token = token;
    }

    private getToken() {
        return this.token;
    }

    private setIsAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    private isAuthenticated() {
        return this.isAuth;
    }
}
