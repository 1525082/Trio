import {Component, ViewChild, OnInit} from '@angular/core';
import {TooltipDirective} from "ng2-bootstrap";
import {CheckDataService} from "../services/check-data.service";
import {Subject} from "rxjs";
import {TooltipService} from "../services/tooltip.service";
import {OperationCode} from "../classes/operationCode.enum";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    private username: string;
    private password: string;

    private bnTooltipMsg: Subject<string> = new Subject();
    private pwTooltipMsg: Subject<string> = new Subject();

    private emptyMsg: string = "";
    private msg1: string = "Bitte überprüfen Sie Ihre Eingaben.";
    private msg2: string = "Bitte einen Benutzernamen angeben.";
    private msg3: string = "Bitte ein Passwort eingeben.";

    @ViewChild('bnTooltip') bnTooltip: TooltipDirective;
    @ViewChild('pwTooltip') pwTooltip: TooltipDirective;

    constructor(private checkService: CheckDataService) {
    }

    ngOnInit() {
        this.bnTooltipMsg.subscribe(
            message => this.handleMessage(message, this.bnTooltip));
        this.pwTooltipMsg.subscribe(
            message => this.handleMessage(message, this.pwTooltip));
        this.checkService.subjectAuthentication.subscribe(
            code => code == OperationCode.ERROR ? this.pwTooltipMsg.next(this.msg1) : null
        );
    }

    login() {
        let isValid: boolean = true;
        if (this.isEmpty(this.username)) {
            isValid = false;
            this.bnTooltipMsg.next(this.msg2);
        }
        if (this.isEmpty(this.password)) {
            isValid = false;
            this.pwTooltipMsg.next(this.msg3);
        }
        if (isValid) {
            this.checkService.login(this.username, this.password);
        }
    }

    private isEmpty(str: string) {
        return (str == this.emptyMsg || isNullOrUndefined(str));
    }

    private handleMessage(message: string, tooltip: TooltipDirective) {
        if (message != this.emptyMsg) {
            TooltipService.showTooltip(tooltip, message);
        } else {
            TooltipService.hideTooltip(tooltip);
        }
    }
}
