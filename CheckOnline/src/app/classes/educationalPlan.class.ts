import { Competence } from './chapterCompetence.class'
export class EducationalPlan {
    public educationalContent: EducationalPlanContent;
    constructor(public _id: number,
                public name: string,
                public thema: string) {
    }

    public static setContent(plan: EducationalPlan, content: EducationalPlanContent) {
        plan.educationalContent = content;
    }

    public static getContent(plan: EducationalPlan) {
        return plan.educationalContent;
    }
}

export class EducationalPlanContent {
    public competencesForDisplay: EducationalCompetence[] = [];
    constructor(public id: number,
                public educationalPlanId: number,
                public competences: CompetenceNote[]) {
    }

    /**
     * Sets the competences which will be used to show on site educational plan.
     * @param competences
     * @param counter   real content of variable 'competences'. Maybe some notes have no competence!
     */
    static setCompetencesForDisplay(content: EducationalPlanContent,
                                    competences: EducationalCompetence[], counter: number) {
        // it could be that a note has no competence
        if (counter != competences.length) {
            content.competencesForDisplay = new Array<EducationalCompetence>(counter);
            for (let i = 0; i < counter; i++) {
                content.competencesForDisplay[i] = EducationalCompetence.clone(competences[i]);
            }
        } else {
            content.competencesForDisplay = competences;
        }
    }

    static getCompetencesForDisplay(content: EducationalPlanContent) {
        return content.competencesForDisplay;
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

