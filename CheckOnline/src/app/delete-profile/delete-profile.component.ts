import {Component, ViewChild} from '@angular/core';
import {TooltipDirective} from "ng2-bootstrap";
import {CheckDataService} from "../services/check-data.service";

@Component({
    selector: 'app-delete-profile',
    templateUrl: './delete-profile.component.html',
    styleUrls: ['./delete-profile.component.css']
})
export class DeleteProfileComponent {
    userpw: string;
    deleteProfileMsg: string;

    @ViewChild('deleteProfileTooltip') curPwTooltip: TooltipDirective;

    constructor(private checkService: CheckDataService) {
    }

    private onClickDelete() {
        // TODO: send request
        console.log("DELETE USER");
    }
}
