import { initializeCarousel } from './carousel.js';
import { initializeChat } from './chat.js';
import {initializeForm} from './form.js';
import {initializeKit} from 'https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous';
import {initalizeShareDots} from './sharedots.js';
import {initializeTopBtns} from './topbuttons.js';

initializeCarousel();
initializeChat();
initializeForm();
initializeKit();
initializeTopBtns();
initalizeShareDots();

document.addEventListener('DOMContentLoaded', () => {