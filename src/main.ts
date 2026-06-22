import { createApp } from 'vue';
import { defineAsyncComponent } from 'vue';

const App = defineAsyncComponent(() => import('./App.vue'));

createApp(App).mount('#root');
