import {Component, ViewChild} from '@angular/core';
import {CheckDataService} from "../services/check-data.service";
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

    constructor(private checkService: CheckDataService) {
    }

    onClickChangePw() {
        var isValid = true;
        if(this.isAFieldEmpty()) {
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
            this.checkService.updatePassword(
                this.currentPw,
                this.newPw
            ).subscribe(
                success => console.log("CHECKSERVICE ÜBERGEBEN -> NEUER TOKEN"), // TODO: check for errors
                error => console.log(error)
            );
            // passwortänderung durchführen
        }
    }

    private isAFieldEmpty(): boolean {
        return this.currentPw == "" || this.newPw == "" || this.confirmPw == "";
    }
}
