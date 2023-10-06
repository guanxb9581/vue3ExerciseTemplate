import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InfinteTable from '../views/InfinteTable.vue'


const examples = import.meta.glob('../views/examples/**/*.tsx')

const examplePromise = Object.keys(examples).map(x => examples[x]).map(f => f())

const routes= [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/infinteTable',
    name: 'infinteTable',
    component: InfinteTable
  },
  {
    path: '/componentExercise',
    name: 'componentExercise',
    component: () => import('../views/Components.vue')
  },
  {
    path: '/Map',
    name: 'map',
    component: () => import('../views/MapView.vue')
  },
  {
    path: '/WebSocket',
    name: 'WebSocket',
    component: () => import('../views/WebSocketView.vue')
  }
]
Promise.all(examplePromise).then((list) => {
  for (const module of list) {
    for (const key in module as any) {
      const Component = (module as any)[key]
      // console.log(Component)
      routes.push({
        path: '/' + key.toLocaleLowerCase(),
        name: key.toLocaleLowerCase(),
        component: Component
      })
    }
  }
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
