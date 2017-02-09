export class Student {
    constructor(public _id: number,
                public forename: string,
                public surname: string,
                public studyGroups: StudyGroup,
                public formteacher: string,
                public school: School,
                public avatarId: number) {
    }
}

export class StudyGroup {
    constructor(public clas: string,
                public imageUrl: string,
                public imageUrlInactive: string,
                public imageUrlBig: string) {
    }
}

export class School {
    constructor(public name: string,
                public address: string,
                public country: string,
                public email: string,
                public telefon: string,
                public imageUrl: string,
                public imageUrlInactive: string,
                public imageUrlBig: string) {
    }
}
/*
 Datenbeispiel:
 {
 "_id": 4,
 "forename": "Harald",
 "surname": "Roth",
 "studyGroups":    {
 "imageUrl": "/images/studyGroup/studyGroup_10a_active.png",
 "imageUrlInactive": "/images/studyGroup/studyGroup_10a_active-big.png",
 "imageUrlBig": "/images/studyGroup/studyGroup_10a_inactive.png"
 },
 "formteacher": "Martina Kraus",
 "school":    {
 "name": "Speyer-Schifferstadt Gesamtchule",
 "address": "Am Eselsdamm 11, 67346 Speyer",
 "country": "Deutschland",
 "email": "contact@tsv-speyer.de",
 "telefon": "06232/ 23021990",
 "imageUrl": "/images/school/school-yellow-active.png",
 "imageUrlInactive": "/images/school/school-inactive.png",
 "imageUrlBig": "/images/school/school-yellow-big-active.png"
 },
 "avatarId": "7"
 }
 */