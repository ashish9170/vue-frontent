import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';

const routes = [
    {
        path: '/',
        redirect: '/auth/login'
    },
    MainRoutes,
    AuthRoutes,
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/authentication/Error.vue')
    }
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// ✅ Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // or Pinia auth store later

    if (to.meta.requiresAuth && !isAuthenticated) {
        // if route requires login and user is not authenticated → send to login
        next('/auth/login');
    } else if (!to.meta.requiresAuth && isAuthenticated && to.path.startsWith('/auth')) {
        // if already logged in and trying to access login/register → redirect to dashboard
        next('/main/dashboard');
    } else {
        next();
    }
});
