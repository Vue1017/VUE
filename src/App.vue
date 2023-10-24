<script setup lang="ts">

import FiveRadio from './components/FiveRadio.vue';
import { reactive, ref } from "vue";
import Question from "./components/EnglishDB.vue"; 

let choice = reactive({title:'冷知識', value:"Question"});
let items=[
  {title:'冷知識', value:"Question"},
  {title:'冷知識2', value:"FiveRadio"},
]
</script>

<template>
  <main>
    <div>
      <v-select label="請選擇" :v-model="choice" :items="items" item-title="title" item-value="value">
    </v-select>
    <Suspense>
      <Question v-if="choice.value === 'Question'" />
    </Suspense>
    <Suspense>
      <FiveRadio v-if="choice.value === 'FiveRadio'" />
    </Suspense>
 
  </div>
  </main>
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
