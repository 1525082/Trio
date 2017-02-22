import {Component} from '@angular/core';
import {TooltipService} from "./services/tooltip.service";
import {CheckDataService} from "./services/check-data.service";
import {ModalMessageService} from "./services/modal-message.service";
import {Router} from "@angular/router";
import {Http} from "@angular/http";
declare let jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private checkService: CheckDataService,
                private modalService: ModalMessageService,
                private tooltipService: TooltipService,
                private http: Http,
                private router: Router) {
    }
}
