import { CheckDataService } from '../check-data.service'
import {Component} from '@angular/core';
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
            if(this.selectedAvatar._id == this.checkService.avatar._id) {
                console.log("GLEICHER AVATAR AUSGEWAEHLT!");
                return;
            }
            this.checkService.updateAvatar(this.authService.getToken(),
            this.selectedAvatar._id).subscribe(
                success => {
                    console.log(success);
                    this.checkService.setAvatar(this.selectedAvatar);
                },
                error => console.log(error)
            );
        }
    }

    selectAvatar(avatar: Avatar) {
        for(var ava of this.checkService.avatare) {
            var elm = document.getElementById("avatar" + ava._id);
            if(ava._id != avatar._id) {
                elm.setAttribute("style", "background-color: #FFFFFF;");
            } else {
                elm.setAttribute("style", "background-color: #D3DDF2;");
            }
        }
        this.selectedAvatar = avatar;
    }
}
