import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ModalMessageService {
    public sbjInfoMsg: BehaviorSubject<string> = new BehaviorSubject("");
    public sbjSuccessMsg: BehaviorSubject<string> = new BehaviorSubject("");
    public sbjErrorMsg: BehaviorSubject<string> = new BehaviorSubject("");

    constructor() {
    }

    showErrorMsg(msg: string) {
        this.sbjErrorMsg.next(msg);
    }

    showSuccessMsg(msg: string) {
        this.sbjSuccessMsg.next(msg);
    }

    showMsg(msg: string) {
        this.sbjInfoMsg.next(msg);
    }

    public getInfoSubject(): BehaviorSubject<string> {
        return this.sbjInfoMsg;
    }

    public getSuccessSubject(): BehaviorSubject<string> {
        return this.sbjSuccessMsg;
    }

    public getErrorSubject(): BehaviorSubject<string> {
        return this.sbjErrorMsg;
    }
}


