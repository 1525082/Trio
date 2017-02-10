import {Component} from '@angular/core';
import {isNullOrUndefined} from "util";
import {AuthenticationService} from "../authentication.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private username: string;
    private password: string;
    private message: string;

    constructor(private authService: AuthenticationService) {
    }

    login() {
        // TODO: Anpassen für modalen Dialog
        if (!isNullOrUndefined(this.username) && !isNullOrUndefined(this.password)) {
            this.authService.login(this.username, this.password);

            if (!this.authService.isAuthenticated()) {
                this.message = "Benutzername oder Password ist falsch.";
            }
        } else {
            this.message = "Bitte Benutzernamen und Passwort angeben...";
        }
    }
}
