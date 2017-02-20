import {Component, ViewChild, OnInit} from '@angular/core';
import {CheckDataService} from "../services/check-data.service";
import {TooltipDirective} from "ng2-bootstrap";
import {Subject} from "rxjs";
import {TooltipService} from "../services/tooltip.service";
import {isNullOrUndefined} from "util";
import {ModalMessageService} from "../services/modal-message.service";

@Component({
    selector: 'app-change-pw',
    templateUrl: './change-pw.component.html',
    styleUrls: ['./change-pw.component.css']
})
export class ChangePwComponent implements OnInit {
    private currentPw: string = "";
    private newPw: string = "";
    private confirmPw: string = "";

    @ViewChild('curPwTooltip') curPwTooltip: TooltipDirective;
    @ViewChild('newPwTooltip') newPwTooltip: TooltipDirective;
    @ViewChild('confirmPwTooltip') confirmPwTooltip: TooltipDirective;

    private curPwTooltipMsg: Subject<string> = new Subject();
    private newPwTooltipMsg: Subject<string> = new Subject();
    private confirmPwTooltipMsg: Subject<string> = new Subject();

    private emptyText: string = "";
    private emptyFieldMsg: string = "Dieses Feld darf nicht leer sein.";
    private inputFieldsSameMsg: string = "Das alte und das neue Passwort sind identisch.";
    private inputFiledsNotSameMsg: string = "Die Eingabe stimmt nicht mit dem neuen Passwort überein.";
    private passwordChangeSuccessMsg: string = "Das Passwort wurde erfolgreich geändert.";

    constructor(private checkService: CheckDataService,
                private modalService: ModalMessageService) {
    }

    ngOnInit() {
        this.curPwTooltipMsg.subscribe(
            message => this.handleMessage(message, this.curPwTooltip));
        this.newPwTooltipMsg.subscribe(
            message => this.handleMessage(message, this.newPwTooltip));
        this.confirmPwTooltipMsg.subscribe(
            message => this.handleMessage(message, this.confirmPwTooltip));
    }

    onClickChangePw() {
        var isValid = true;
        if (this.isEmpty(this.currentPw)) {
            this.curPwTooltipMsg.next(this.emptyFieldMsg);
            isValid = false;
        } else {
            this.curPwTooltipMsg.next();
        }
        if (this.isEmpty(this.newPw)) {
            this.newPwTooltipMsg.next(this.emptyFieldMsg);
            isValid = false;
        } else {
            this.newPwTooltipMsg.next();
        }
        if (this.isEmpty(this.confirmPw)) {
            this.confirmPwTooltipMsg.next(this.emptyFieldMsg);
            isValid = false;
        } else {
            this.confirmPwTooltipMsg.next();
        }
        if (isValid) {
            if (this.currentPw == this.newPw) {
                this.newPwTooltipMsg.next(this.inputFieldsSameMsg);
                this.confirmPwTooltipMsg.next();
            } else if (this.newPw != this.confirmPw) {
                this.confirmPwTooltipMsg.next(this.inputFiledsNotSameMsg);
                this.newPwTooltipMsg.next();
            } else {
                // Passwortänderung durchführen
                this.checkService.updatePassword(this.currentPw, this.newPw)
                    .subscribe(
                        data => {
                            this.checkService.setPassword(this.newPw);
                            this.checkService.setToken(data.token);
                            this.currentPw = this.newPw = this.confirmPw = this.emptyText;
                            this.modalService.showSuccessMsg(this.passwordChangeSuccessMsg
                                + " | " + data.token);
                        },
                        error => console.log(error));
            }
        }
    }

    private isEmpty(str: string): boolean {
        return (str == "" || isNullOrUndefined(str));
    }

    private handleMessage(message: string, tooltip: TooltipDirective) {
        if (message != this.emptyText) {
            TooltipService.showTooltip(tooltip, message);
        } else {
            TooltipService.hideTooltip(tooltip);
        }
    }
}
