import { CheckDataService } from '../check-data.service'
import { Component } from '@angular/core';

@Component({
    selector: 'app-change-avatar',
    templateUrl: './change-avatar.component.html',
    styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent {

    constructor(protected checkService: CheckDataService) {

    }
}
