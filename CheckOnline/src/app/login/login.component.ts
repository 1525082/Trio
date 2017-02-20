import {Component, ViewChild, OnInit} from '@angular/core';
import {TooltipDirective} from "ng2-bootstrap";
import {CheckDataService} from "../services/check-data.service";
import {Subject} from "rxjs";
import {TooltipService} from "../services/tooltip.service";
import {OperationCode} from "../classes/operationCode.enum";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    private username: string;
    private password: string;

    private tooltipMessage: Subject<string> = new Subject();

    @ViewChild('pwtooltip') pwtooltip: TooltipDirective;

    constructor(private checkService: CheckDataService) {
    }

    ngOnInit() {
        this.tooltipMessage.subscribe(
            message => {
                if (message != "") {
                    TooltipService.showTooltip(this.pwtooltip, message);
                } else {
                    TooltipService.hideTooltip(this.pwtooltip);
                }
            }
        );
        this.checkService.onAuthenticate.subscribe(
            code => code == OperationCode.ERROR ? this.tooltipMessage.next(OperationCode[code]) : null
            /*{
                if(code == OperationCode.ERROR) {
                    this.tooltipMessage.next(OperationCode[code]);
                }
            }*/
        );
    }

    login() {
        this.checkService.requestLogin(this.username, this.password);
        /*
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
         }*/
    }
}
