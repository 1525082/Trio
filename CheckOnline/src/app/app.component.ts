import {Component} from '@angular/core';
import {TooltipService} from "./services/tooltip.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private tooltipService: TooltipService) {
    }
}
