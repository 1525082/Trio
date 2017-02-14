import { Competence } from './chapterCompetence.class'
export class EducationalPlan {
    public educationalContent: EducationalPlanContent;
    constructor(public _id: number,
                public name: string,
                public thema: string) {
    }
}

export class EducationalPlanContent {
    public competencesForDisplay: EducationalCompetence[] = [];
    constructor(public id: number,
                public educationalPlanId: number,
                public competences: CompetenceNote[]) {
    }
}

export class CompetenceNote {
    constructor(public competenceId: number,
                public note: string,
                public order: number) {
    }
}

export class EducationalCompetence {
    constructor(public id: number,
                public chapterId: number,
                public teacherText: string,
                public studentText: string,
                public number: number,
                public checked: boolean,
                public fromDate: string,
                public note: string) {
    }
     
    static create(comp: Competence, compNote: CompetenceNote) {
        return new EducationalCompetence(
            comp.id,
            comp.chapterId,
            comp.teacherText,
            comp.studentText,
            comp.number,
            comp.checked,
            comp.fromDate,
            compNote.note
        );
    }
    
    static clone(comp: EducationalCompetence) {
        return new EducationalCompetence(
            comp.id,
            comp.chapterId,
            comp.teacherText,
            comp.studentText,
            comp.number,
            comp.checked,
            comp.fromDate,
            comp.note
        );
    }
}

