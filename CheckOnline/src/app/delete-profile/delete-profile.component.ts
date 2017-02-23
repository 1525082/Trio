import {Component, ViewChild, OnInit} from '@angular/core';
import {TooltipDirective} from "ng2-bootstrap";
import {CheckDataService} from "../services/check-data.service";
import {Subject} from "rxjs";
import {isNullOrUndefined} from "util";
import {TooltipService} from "../services/tooltip.service";
import {ModalMessageService} from "../services/modal-message.service";

@Component({
    selector: 'app-delete-profile',
    templateUrl: './delete-profile.component.html',
    styleUrls: ['./delete-profile.component.css']
})
export class DeleteProfileComponent implements OnInit {
    userpw: string;
    private deleteProfileMsg: Subject<string> = new Subject();

    @ViewChild('deleteProfileTooltip')
    curPwTooltip: TooltipDirective;

    constructor(private checkService: CheckDataService,
                private modalService: ModalMessageService) {
    }

    ngOnInit() {
        this.deleteProfileMsg.subscribe(
            message => {
                if (message != "") {
                    TooltipService.showTooltip(this.curPwTooltip, message);
                } else {
                    TooltipService.hideTooltip(this.curPwTooltip);
                }
            }
        );
    }

    protected onClickDelete() {
        if (this.userpw == "" || isNullOrUndefined(this.userpw)) {
            this.deleteProfileMsg.next("Bitte geben Sie Ihr Passwort ein.");
        } else {
            if (this.userpw != this.checkService.getPassword()) {
                this.deleteProfileMsg.next("Bitte geben Sie Ihr korrekte Passwort ein.");
            } else {
                this.checkService.deleteProfile().subscribe(
                    data => {
                        this.userpw = "";
                        if(data.message) {
                            this.modalService.showSuccessMsg(data.message);
                        }
                        this.checkService.logout();
                    });
            }
        }
    }
}
