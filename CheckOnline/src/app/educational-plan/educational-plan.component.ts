import {CheckDataService} from '../services/check-data.service'
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router'

@Component({
    selector: 'app-educational-plan',
    templateUrl: './educational-plan.component.html',
    styleUrls: ['./educational-plan.component.css']
})
export class EducationalPlanComponent implements OnInit {
    private selectedID: number;
    private body: HTMLElement;
    private params;

    constructor(protected checkService: CheckDataService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.setBody(document.getElementsByTagName("body").item(0));
        this.route.params.subscribe(
            params => {
                this.setStyle("#8da6d6");
                this.setParams(params);
                this.onParamChanged(this);
            }
        );
    }

    private onParamChanged(scope: EducationalPlanComponent) {
        let id = scope.getParams().id;
        if (id) {
            this.selectedID = id;
            this.checkService.selectPlan(id); // TODO: possible that no plan selectable => add EventEmitter!
        }
    }

    getImageUrl(checked: boolean) {
        if (checked) {
            return "../../images/achievedCompetences-active.png";
        } else {
            return "../../images/achievedCompetences-inactive.png";
        }
    }

    private setStyle(color: string) {
        if (this.getBody()) {
            this.getBody().setAttribute("style", "background-color: " + color);
        }
    }

    /*
     *              GETTER && SETTER
     *-----------------------------------------------
     */

    private setBody(html: HTMLElement) {
        this.body = html;
    }

    private getBody(): HTMLElement {
        return this.body;
    }

    private setParams(params) {
        this.params = params;
    }

    private getParams() {
        return this.params;
    }
}