import router from '@/router/index';
import store from '@/store';
import App from './App.vue';
import '@/assets/styles/index.scss';
import 'virtual:windi.css';

//auto-animate 
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App);

app.use(router).use(store).use(autoAnimatePlugin);

app.mount('#app');
