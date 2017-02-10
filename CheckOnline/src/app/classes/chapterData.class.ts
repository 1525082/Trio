import { Competence } from './chapterCompetence.class'
import { ChapterIllustration } from './chapterIllustration.class'

export class ChapterData {
    public competences: Array<Competence>;
    public illustration: ChapterIllustration;

    constructor(length: number) {
        this.competences = new Array<Competence>(length);
    }
}