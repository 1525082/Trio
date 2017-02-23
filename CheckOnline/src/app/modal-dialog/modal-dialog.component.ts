import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalMessageService} from "../services/modal-message.service";
import {ModalDirective} from "ng2-bootstrap";
import {APP_CONSTS} from "../app.config";
declare let jQuery: any;

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
	styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit {

    @ViewChild('informationModal')
    informationModal: ModalDirective;
    @ViewChild('errorModal')
    errorModal: ModalDirective;
    @ViewChild('successModal')
    successModal: ModalDirective;

    constructor(private modalService: ModalMessageService) {
    }

    ngOnInit() {
        this.modalService.sbjInfoMsg.subscribe(
            (msg) => (msg !== APP_CONSTS.EMPTY_STRING) ? this.informationModal.show() : null);
        this.modalService.sbjSuccessMsg.subscribe(
                (msg) => (msg !== APP_CONSTS.EMPTY_STRING) ? this.successModal.show() : null);
        this.modalService.sbjErrorMsg.subscribe(
            (msg) => (msg !== APP_CONSTS.EMPTY_STRING) ? this.errorModal.show() : null);
        this.resizingModals();
    }

    private resizingModals() {
        var modalVerticalCenterClass = ".modal";
        function centerModals($element) {
            var $modals;
            if ($element.length) {
                $modals = $element;
            } else {
                $modals = jQuery(modalVerticalCenterClass + ':visible');
            }
            $modals.each( function(i) {
                var $clone = jQuery(this).clone().css('display', 'block').appendTo('body');
                var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
                top = top > 0 ? top : 0;
                $clone.remove();
                jQuery(this).find('.modal-content').css("margin-top", top);
            });
        }
        centerModals(jQuery(modalVerticalCenterClass));
        jQuery(window).on('resize', centerModals);
    }

    hide(modal: ModalDirective) {
        modal.hide();
    }
}
