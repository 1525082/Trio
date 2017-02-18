import {Component, ViewChild} from '@angular/core';
import {CheckDataService} from "../services/check-data.service";
import {AuthenticationService} from "../services/authentication.service";
import {TooltipDirective} from "ng2-bootstrap";

@Component({
    selector: 'app-change-pw',
    templateUrl: './change-pw.component.html',
    styleUrls: ['./change-pw.component.css']
})
export class ChangePwComponent {
    private currentPw: string = "";
    private newPw: string = "";
    private confirmPw: string = "";

    private curPwMsg: string = "MINDESTENS EIN FELD IST LEER!";
    private newPwMsg: string = "ALTES UND NEUES PASSWORT SIND GLEICH!";
    private confirmPwMsg: string = "DIE EINGABEN DES NEUEN PASSWORTS SIND IDENTISCH";

    @ViewChild('curPwTooltip') curPwTooltip: TooltipDirective;
    @ViewChild('newPwTooltip') newPwTooltip: TooltipDirective;
    @ViewChild('confirmPwTooltip') confirmPwTooltip: TooltipDirective;

    constructor(private authService: AuthenticationService,
                private checkService: CheckDataService) {
    }

    onClickChangePw() {
        var isValid = true;
        if(this.currentPw == "" || this.newPw == "" || this.confirmPw == "") {
            console.log(this.curPwTooltip.tooltip);
            this.curPwTooltip.show();
            isValid = false;
            // ein Textfeld ist leer
        }
        if(this.currentPw == this.newPw) {
            this.newPwTooltip.show();
            isValid = false;
            // Password nicht geändert
        }
        if(this.newPw != this.confirmPw) {
            this.confirmPwTooltip.show();
            isValid = false;
            // neues Passwort nicht gleich
        }
        if (isValid) {
            this.checkService.updatePassword(this.authService.getToken(),
                this.currentPw,
                this.newPw
            ).subscribe(
                success => this.authService.setToken(success.token), // TODO: check for errors
                error => console.log(error)
            );
            // passwortänderung durchführen
        }
    }
}
