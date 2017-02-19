import { CheckDataService } from '../services/check-data.service'
import { EducationalPlan, EducationalPlanContent } from '../classes/educationalPlan.class'
import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-educational-plan',
    templateUrl: './educational-plan.component.html',
    styleUrls: ['./educational-plan.component.css']
})
export class EducationalPlanComponent implements DoCheck {
    private selectedID: number;

    constructor(protected checkService: CheckDataService,
        private route: ActivatedRoute) {
    }

    ngDoCheck() {
        let id = +this.route.snapshot.params['id'];
        if (id && this.selectedID != id) {
            this.selectedID = id;
            this.checkService.selectPlan(id);
            //this.loadData();
        }
    }

    loadData() {
        if (this.checkService.educationalPlans.length == 0) {
            this.checkService.getEducationalPlans().subscribe(
                plans => this.checkService.educationalPlans = plans as EducationalPlan[],
                error => console.error("ERROR!: ", error),
                () => {
                    for (let plan of this.checkService.educationalPlans) {
                        if (this.selectedID == plan._id) {
                            this.checkService.getEducationalPlanContentById(plan._id).subscribe(
                                content => plan.educationalContent = content[0] as EducationalPlanContent,
                                error => console.error("ERROR!: ", error),
                                () => {
                                    this.filter();
                                }
                            );
                        }
                    }
                }
            );
        } else {
            for (let plan of this.checkService.educationalPlans) {
                if (plan._id == this.selectedID) {
                    if (plan.educationalContent) {
                        this.filter();
                    } else {
                        this.checkService.getEducationalPlanContentById(plan._id).subscribe(
                            content => plan.educationalContent = content[0] as EducationalPlanContent,
                            error => console.error("ERROR!: ", error),
                            () => {
                                this.filter();
                            }
                        );
                    }
                }
            }
        }
    }

    filter() {
        /*
        let plan = this.checkService.educationalPlans.find(
            plan => plan._id == this.selectedID
        );
        if (!plan || !plan.educationalContent || !this.checkService.competences) {
            console.log("Plan empty");
        }

        let counter = 0;
        let arr = new Array<EducationalCompetence>(plan.educationalContent.competences.length);
        
        for (let compNote of plan.educationalContent.competences) {
            let comp = this.checkService.competences.find(comp => comp.id == compNote.competenceId);
            if (comp) {
                arr[counter] = EducationalCompetence.create(comp, compNote);
                counter++;
            }
        }
        
        // it could be that a note has no competence
        if (counter < arr.length) {
            this.checkService.educationalCompetences = new Array<EducationalCompetence>(counter);
            for (let i = 0; i < counter; i++) {
                this.checkService.educationalCompetences[i] = EducationalCompetence.clone(arr[i]);
            }
        } else {
            this.checkService.educationalCompetences = arr;
        }*/
    }

    getImageUrl(checked: boolean) {
        if (checked) {
            return "../../images/achievedCompetences-active.png";
        } else {
            return "../../images/achievedCompetences-inactive.png";
        }
    }
}
