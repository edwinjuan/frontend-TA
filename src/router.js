import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import AssignmentView from './views/AssignmentView.vue'
import LoginView from './views/LoginView.vue'
import CPMKView from './views/CPMKView.vue'
import StudentsView from './views/StudentsView.vue'
import GradeView from './views/GradeView.vue'
import DashboardLayoutView from './views/DashboardLayoutView.vue'
import MatkulView from './views/MatkulView.vue'
import VerifyEmailView from './views/VerifyEmailView.vue'
import CekEmailView from './views/CekEmailView.vue'


const routes = [
  {
    path: '/',
    name: 'layout',
    meta: { title: 'layout', requiresAuth: true },
    component: DashboardLayoutView,
    children: [
      //Card class
      {
        path: '/',
        name: 'home',
        meta: { title: 'home' },
        component: HomeView
      },
      //matkul
      {
        path: '/matkul',
        name: 'matkul',
        meta: { title: 'matkul'},
        component: MatkulView
      },
      //assignment
      {
        path: '/assignment',
        name: 'assignment',
        meta: { title: 'assignment'},
        component: AssignmentView
      },
      //class Input
      {
        path: '/cpmk',
        name: 'CPMK',
        meta: { title: 'CPMK' },
        component: CPMKView
      },
      //assignment
      {
        path: '/students',
        name: 'students',
        meta: { title: 'students'},
        component: StudentsView
      },
      //assignment
      {
        path: '/grade',
        name: 'grade',
        meta: { title: 'grade'},
        component: GradeView
      },
      
    ],
    
  },
  {
    path: '/login',
    name: 'loginView',
    meta: { title: 'login' },
    component: LoginView
  },   
  {
    path: '/verify',
    name: 'VerifyEmail',
    meta: { title: 'verify' },
    component: VerifyEmailView
  },   
  {
    path: '/cek/:email/:password/:date',
    name: 'CekEmail',
    meta: { title: 'CekEmail' },
    component: CekEmailView
  },   
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Set Judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem("is_admin");
    if (to.meta.requiresAuth && token == null) {
      next("/login");
    } else if (to.name == "loginView" && token != null) {
      if (isAdmin != null) {
        next("/matkul");
      } else {
        next("/");
      }
    } else {
      next();
    }
    
});

export default router