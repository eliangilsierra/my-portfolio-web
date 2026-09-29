/**
 * The single entry point to GSAP. Core plugins are registered once here, and every component
 * imports GSAP from this module, so defaults and plugins are always in place. Plugins used by a
 * single page register themselves where they are used (Flip, in useFlip), so they stay in that
 * page's chunk instead of the first load.
 *
 * Responsibilities (see docs/design.md): GSAP owns scroll choreography, line reveals, the menu
 * timeline, list re-ordering and pointer-driven motion. CSS owns what plays before hydration.
 */
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DURATION, EASE } from '@/config/motion';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
gsap.defaults({ duration: DURATION.base, ease: EASE.out });

export { gsap, ScrollTrigger, SplitText, useGSAP };
