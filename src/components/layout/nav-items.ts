import { SHEETS } from '@/config/constants';

/** Keys are shared by the dictionary (`t.nav`), the route table (`useRoutes`) and `SHEETS`. */
export const NAV_ITEMS = ['projects', 'pills', 'about', 'contact'] as const;

export type NavKey = (typeof NAV_ITEMS)[number] | 'home';

export const sheetNumber = (key: NavKey): string => SHEETS[key];
