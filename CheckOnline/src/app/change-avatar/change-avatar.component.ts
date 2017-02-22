import {CheckDataService} from '../services/check-data.service'
import {Component} from '@angular/core';
import {Avatar} from "../classes/avatar.class";
import {ModalMessageService} from "../services/modal-message.service";

@Component({
    selector: 'app-change-avatar',
    templateUrl: './change-avatar.component.html',
    styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent {
    private selectedAvatar: Avatar = null;

    constructor(protected checkService: CheckDataService,
                protected modalService: ModalMessageService) {
        this.checkService.subjectAvatar.subscribe(
            avatar => this.selectAvatar(avatar));
    }

    updateSelectedAvatar() {
        if (this.selectedAvatar) {
            if (this.selectedAvatar._id == this.checkService.subjectAvatar.getValue()._id) {
                return;
            }
            this.checkService.updateAvatar(this.selectedAvatar._id)
                .subscribe(
                    () => {
                        this.modalService.showSuccessMsg("Der Avatar wurde geändert.");
                        this.checkService.setAvatar(this.selectedAvatar);
                    },
                    error => console.log(error)
                );
        }
    }

    selectAvatar(avatar: Avatar) {
        for (var ava of this.checkService.avatare) {
            var elm = document.getElementById("avatar" + ava._id);
            if (ava._id != avatar._id) {
                this.setStyle(elm, "style", "background-color: #FFFFFF;");
            } else {
                this.setStyle(elm, "style", "background-color: #D3DDF2;");
            }
        }
        this.selectedAvatar = avatar;
    }

    private setStyle(elm, attr, value) {
        if(elm) {
            elm.setAttribute(attr, value);
        }
    }

    deselectAvatar() {
        if (this.checkService.subjectAvatar.getValue() != null) {
            this.selectAvatar(this.checkService.subjectAvatar.getValue());
        }
    }
}
