import {Component, Input} from '@angular/core';
declare let jQuery: any;

const SPEED = 25;
const SCROLL = 25;

@Component({
    selector: 'app-scroll-buttons',
    templateUrl: './scroll-buttons.component.html',
    styleUrls: ['./scroll-buttons.component.css']
})
export class ScrollButtonsComponent {
    @Input()
    protected scrollUpBtnUrl: string;

    @Input()
    protected scrollDownBtnUrl: string;

    constructor() {
        jQuery(document).ready(function () {
            /*
             ONLOAD:
             */
            var navAndFooterHeight = 110; // 110 = navbar + footer heights
            var scrollBtn = 80 + 20; // 80 = 2 * scollButton height + 20 (margin-top/bottom)
            var marginRight = 40 + 10; // 10 for distance from right side, 40 is scroll-Btn width

            var curWidth = jQuery(window).width();
            var curHeight = jQuery(window).height();
            var contentContainerHeight = curHeight - navAndFooterHeight;
            var contentScrollbar = contentContainerHeight - scrollBtn;

            jQuery('#content-scrollbar').css("margin-left", jQuery('#content-container').width() - marginRight);
            jQuery('#content-container').height(contentContainerHeight);
            jQuery('.scrollDown').css("margin-top", contentScrollbar);

            jQuery(window).on('resize', function () {
                var newHeight = jQuery(window).height();
                var newWidth = jQuery(window).width();
                if (newWidth != curWidth) {
                    newWidth = (newWidth > 1080) ? 1080 : newWidth;
                    // widths
                    jQuery('#content-scrollbar').css("margin-left", jQuery('#content-container').width() - marginRight);
                    curWidth = newWidth;
                }
                if (newHeight != curHeight) {
                    // heights
                    jQuery('#content-container').height(newHeight - navAndFooterHeight);
                    jQuery('.scrollDown').css("margin-top", newHeight - (navAndFooterHeight + scrollBtn));
                    curHeight = newHeight;
                }
            });

            let ele = jQuery('#content-container');
            let scrolling;

            jQuery('.scrollUp').mousedown(function () {
                // Scroll the element up
                scrolling = window.setInterval(function () {
                    ele.scrollTop(ele.scrollTop() - SCROLL);
                }, SPEED);
            });

            jQuery('.scrollDown').mousedown(function () {
                // Scroll the element down
                scrolling = window.setInterval(function () {
                    ele.scrollTop(ele.scrollTop() + SCROLL);
                }, SPEED);
            });

            jQuery(document).bind({
                mousewheel: function (e) {
                    // cross-browser wheel delta
                    var e = window.event || e;
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                    //scrolling down?
                    if (delta < 0) {
                        ele.scrollTop(ele.scrollTop() + (2* SCROLL));
                    }

                    //scrolling up?
                    else {
                        ele.scrollTop(ele.scrollTop() - (2* SCROLL));
                    }
                    return false;
                }
            });

            jQuery('.scrollUp, .scrollDown').bind({
                click: function (e) {
                    // Prevent the default click action
                    e.preventDefault();
                },
                mouseup: function () { // wenn mousedown verwendet wird
                    if (scrolling) {
                        window.clearInterval(scrolling);
                        scrolling = false;
                    }
                },
                mouseleave: function () { // wenn mousedown verwendet wird
                    if (scrolling) {
                        window.clearInterval(scrolling);
                        scrolling = false;
                    }
                }
            });
        });
    }

}
