import {Component} from '@angular/core';
import {ModalMessageService} from "../services/modal-message.service";

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html'
})
export class ModalDialogComponent {
    constructor(public modalService: ModalMessageService) {
    }
}
