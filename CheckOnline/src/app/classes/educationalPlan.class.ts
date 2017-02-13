export class EducationalPlan {
    public educationalContent: EducationalPlanContent;
    constructor(public _id: number,
                public name: string,
                public thema: string) {
    }
}

export class EducationalPlanContent {
    constructor(public id: number,
                public educationalPlanId: number,
                public compNote: CompetenceNote) {
    }
}

export class CompetenceNote {
    constructor(public competenceId: number,
                public note: string,
                public order: number) {
    }
}