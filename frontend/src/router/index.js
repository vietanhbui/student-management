import Vue from 'vue'
import Router from 'vue-router'
import { isAuthenticated } from '../auth/index.auth'
const Signup = () => import('@/views/Signup')
const Signin = () => import('@/views/Signin')
const Home = () => import('@/views/Home')
const EditProfile = () => import('@/views/EditProfile')
const Classes = () => import('@/views/Classes')
const ClassDetails = () => import('@/views/ClassDetails')

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '/signin',
            name: 'Signin',
            component: Signin
        },
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/student/edit/:studentId',
            name: 'EditProfile',
            component: EditProfile
        },
        {
            path: '/classes',
            name: 'Classes',
            component: Classes
        },
        {
            path: '/class/:classId',
            name: 'ClassDetails',
            component: ClassDetails,
            props: true
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (isAuthenticated()) {
        if (to.name === "Signin") {
            next('/');
        } else {
            next();
        }
    } else {
        if (to.path !== '/signin' && to.path !== '/signup') {
            next('/signin');
        } else {
            next();
        }
    }
})

export default router;
