import { CheckDataService } from '../check-data.service'
import { Component } from '@angular/core';
import {restUrls} from "../classes/restUrls.class";
import {Avatar} from "../classes/avatar.class";
import {ModalMessageService} from "../modal-message.service";
import {AuthenticationService} from "../authentication.service";

@Component({
    selector: 'app-change-avatar',
    templateUrl: './change-avatar.component.html',
    styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent {
    private selectedAvatar: Avatar = null;

    constructor(protected authService: AuthenticationService,
                protected checkService: CheckDataService,
                protected modalService: ModalMessageService) {
    }

    updateSelectedAvatar() {
        if(this.selectedAvatar) {
            console.log(this.authService.getToken());
            this.checkService.updateAvatar(this.authService.getToken(),
            this.selectedAvatar._id).subscribe(
                success => this.modalService.showSuccessMsg(success.message),
                error => this.modalService.showErrorMsg(error.message)
            );
        }
    }

    selectAvatar(avatar: Avatar) {
        this.selectedAvatar = avatar;
    }
}
