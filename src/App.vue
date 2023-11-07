<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import FiveRadio from './components/FiveRadio.vue';
import { provide ,reactive, ref } from "vue";
import Question from "./components/EnglishDB.vue"; 
import Animal from "./components/AnimalApp.vue";
import router from './router'; 

let drawer = ref(false);
let choice = reactive({title:'冷知識', value:"Question"});
let items=[
  {title:'冷知識', to:"/english"},
  {title:'冷知識2', to:"/fiveradio"},
  {title:'動物常識', to:"/animalapp"}
]

const account = reactive({
  name: '彭于芳',
  email: 'prp00328evonne@gmail.com'})
provide(/* key */ 'account', /* value */ account)

</script>

<template>
  <v-app class="rounded rounded-md">
    <v-app-bar title="Education Zoo">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer floating permanent v-model="drawer" style="border: 1px solid lightgray;">
      <v-list>
        <v-list-item
          v-for="item in items"
          :title="item.title"
          :key="item.title"
          :to="item.to"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div>
        <v-container>
      <!-- <v-select label="請選擇" v-model="choice.value" :items="items" item-title="title" item-value="value">
    </v-select>
    <Suspense>
      <Question v-if="choice.value === 'Question'" />
    </Suspense>
    <Suspense>
      <FiveRadio v-if="choice.value === 'FiveRadio'" />
    </Suspense>
    <Suspense>
      <Animal v-if="choice.value === 'Animal'" />
    </Suspense> -->
    <Suspense>
        <RouterView />
      </Suspense>
  </v-container>
  </div>
    </v-main>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
./router