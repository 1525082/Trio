import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalMessageService} from "../services/modal-message.service";
import {ModalDirective} from "ng2-bootstrap";
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
            () => this.informationModal.show());
        this.modalService.sbjSuccessMsg.subscribe(
                () => this.successModal.show());
        this.modalService.sbjErrorMsg.subscribe(
            () => this.errorModal.show());
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
