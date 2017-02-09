export class Competence {
    constructor(public id: number,
                public chapterId: number,
                public teacherText: string,
                public studentText: string,
                public number: number,
                public checked: boolean,
                public fromDate: string) {
    }
}