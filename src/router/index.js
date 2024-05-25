import { createRouter, createWebHistory } from 'vue-router'
import { setLoggedUser } from '../states/loggedUser';
import { isUserLoggedIn } from '../states/loggedUser';


function redirect_home_if_logged_in(to, from, next) {
  if (isUserLoggedIn()) {
    next({ name: 'home' }); 
  } else {
    next(); 
  }
}

function redirect_log_in_if_not_logged_in(to, from, next) {
  if (isUserLoggedIn()) {
    next(); 
  } else {
    next({ name: 'sign_in' }); 
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: { name: 'home' }
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: () => import('../views/SignInView.vue'),
      beforeEnter: redirect_home_if_logged_in
    },
    {
      path: '/sign_up',
      name: 'sign_up',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportPageView.vue'),
      beforeEnter: redirect_log_in_if_not_logged_in
    },
    {
      path: '/organization',
      name: 'organization',
      component: () => import('../views/OrganizationView.vue'),
      beforeEnter: redirect_log_in_if_not_logged_in
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationView.vue'),
      beforeEnter: redirect_log_in_if_not_logged_in
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomePageView.vue') ,
      beforeEnter: redirect_log_in_if_not_logged_in
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      beforeEnter: redirect_log_in_if_not_logged_in
    },
    {
      path: '/about_us',
      name: 'about_us',
      component: () => import('../views/AboutUs.vue'),
    },
    {
      path: '/after_sign_up',
      name: 'after_sign_up',
      // make request to back end with the token
      beforeEnter: async function(to, from, next) {
        let response = to.query.response;
        response = JSON.parse(response);
        setLoggedUser(response);
        next({ name: 'home' })
      } 
    },
    {
      path: '/after_sign_in',
      name: 'after_sign_in',
      beforeEnter: async function(to, from, next) {
        let response = to.query.response;
        response = JSON.parse(response);
        setLoggedUser(response);
        next({ name: 'home' })
      } 
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not_found',
      component: () => import('../views/Error404.vue'),
    }
  ]
})

export default router
