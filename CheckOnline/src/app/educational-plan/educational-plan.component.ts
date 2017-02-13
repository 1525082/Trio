import { AuthenticationService } from '../authentication.service'
import { CheckDataService } from '../check-data.service'
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-educational-plan',
    templateUrl: './educational-plan.component.html',
    styleUrls: ['./educational-plan.component.css']
})
export class EducationalPlanComponent {

    constructor(protected checkService: CheckDataService,
                private authService: AuthenticationService) {
    }
    
    getImageUrl(checked: boolean) {
        if(checked) {
            return "../../images/achievedCompetences-active.png";
        } else {
            return "../../images/achievedCompetences-inactive.png";
        }
    }
}
