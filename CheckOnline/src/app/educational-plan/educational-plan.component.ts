import {CheckDataService} from '../services/check-data.service'
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {EducationalPlan, EducationalCompetence, EducationalPlanContent} from "../classes/educationalPlan.class";

@Component({
    selector: 'app-educational-plan',
    templateUrl: './educational-plan.component.html',
    styleUrls: ['./educational-plan.component.css']
})
export class EducationalPlanComponent implements OnInit, OnDestroy {
    private selectedID: number;
    private body: HTMLElement;
    private params;

    protected selectedPlan: EducationalPlan = null;
    protected educationalCompetences: EducationalCompetence[] = [];

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
            this.selectPlan();
        }
    }

    /**
     * Select the competences of a educational plan and makes it available for the educational component.
     *
     * @param id of the wanted educational plan
     */
    private selectPlan() {
        this.selectedPlan = this.checkService.educationalPlans.find(plan => plan._id == this.selectedID);
        if (this.selectedPlan) {
            this.educationalCompetences = EducationalPlan.getContent(this.selectedPlan).competencesForDisplay;
        } else {
            this.checkService.arePlansLoadedAndFiltered.subscribe(
                filtered => {
                    if (filtered && this.selectedID != null) {
                        this.selectPlan()
                    }
                }
            );
        }
    }

    ngOnDestroy() {
        if (this.getBody()) {
            this.getBody().style.backgroundColor = "#FFFFFF";
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