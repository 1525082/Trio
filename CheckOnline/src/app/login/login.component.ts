import {Component, ViewChild} from '@angular/core';
import {isNullOrUndefined} from "util";
import {AuthenticationService} from "../authentication.service";
import {TooltipDirective} from "ng2-bootstrap";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private username: string;
    private password: string;
    private message: string;

    @ViewChild('pwtooltip') pwtooltip: TooltipDirective;

    constructor(private authService: AuthenticationService) {
    }

    login() {
        // TODO: Anpassen für modalen Dialog
        if (!isNullOrUndefined(this.username) && !isNullOrUndefined(this.password)) {
            this.authService.login(this.username, this.password).subscribe(
                null,
                error => {
                    console.log(error);
                    this.showTooltip("Bitte überprüfen Sie Ihre Accountdaten.");
                }
            );

            if (!this.authService.isAuthenticated()) {
                this.showTooltip("Benutzername oder Password ist falsch.");
            }
        } else {
            this.showTooltip("Bitte Benutzernamen und Passwort angeben...");
        }
    }

    showTooltip(msg: string) {
        this.message = msg;
        this.pwtooltip.show();
    }

    hideTooltip() {
        this.pwtooltip.hide();
    }
}
