import scrollChangerHeaderBg from "./animation/header-scroll-behaviour.js";
import {changeHamburgerIcon} from './responsive_navbar/mobile-responsive-nav.js';
import menu from "./Main/Menu/menu-filter.js";
import {clientTestimonial} from "./Main/Testimonial/testimonial.js";
import sendEmailToOwner from "./Main/contact/contactForm.js";
import {menuDialog} from './diloag_menu/dialog-menu.js';
import countCartNotificaton from "./cart/cart.js";
import { CartDialog } from "./cart/cart-dialog.js";
import { initRevealOnScroll } from "./animation/reveal-on-scroll.js";

function cafeBrewBean(){
        scrollChangerHeaderBg();
        changeHamburgerIcon();
        menu();
        clientTestimonial();
        sendEmailToOwner();
        menuDialog();
        countCartNotificaton();
        CartDialog();
        initRevealOnScroll();
}

cafeBrewBean();
