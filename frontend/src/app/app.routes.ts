import { Routes } from '@angular/router';
import { About } from './about/about';
import { Men } from './men/men';
import { Women } from './women/women';
import { Home } from './home/home';
import { Login } from './login/login';
import { Shopping } from './shopping/shopping';
import { Favorites } from './favorites/favorites';
import { Signup } from './signup/signup';
import { Checkout } from './checkout/checkout';

export const routes: Routes = [
    { path: 'about' , component: About},
    { path: 'men' , component: Men},
    { path: 'women' , component: Women},
    { path: 'home' , component: Home},
    { path: 'login' , component: Login},
    { path: 'shopping' , component: Shopping},
    { path: 'favorites' , component: Favorites},
    { path: 'signup' , component: Signup},
    { path: '',      component: Home },
    { path: 'shopping/checkout',   component: Checkout },
    
];
