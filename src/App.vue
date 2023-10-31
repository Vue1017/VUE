<script setup lang="ts">

import FiveRadio from './components/FiveRadio.vue';
import { reactive, ref } from "vue";
import Question from "./components/EnglishDB.vue"; 
let drawer = ref(false);
let choice = reactive({title:'冷知識', value:"Question"});
let items=[
  {title:'冷知識', value:"Question"},
  {title:'冷知識2', value:"FiveRadio"},
]
</script>

<template>
  <v-app class="rounded rounded-md">
    <v-app-bar title="Education Zoo">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">menu</v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer floating permanent v-model="drawer" style="border: 1px solid lightgray;">
      <v-list>
        <v-list-item v-for="item in items"
          :title="item.title" 
          :key="item.value" 
          :active="item.value === choice.value"
          @click="choice.value = item.value">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div>
        <v-container>
      <v-select label="請選擇" v-model="choice.value" :items="items" item-title="title" item-value="value">
    </v-select>
    <Suspense>
      <Question v-if="choice.value === 'Question'" />
    </Suspense>
    <Suspense>
      <FiveRadio v-if="choice.value === 'FiveRadio'" />
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
