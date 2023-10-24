<script setup lang="ts">

import FiveRadio from './components/FiveRadio.vue';
import { ref } from "vue";
import Question from "./components/EnglishDB.vue"; 

let choice = ref("請選擇");
</script>

<template>
  <main>
    <div>
    <select v-model="choice">
      <option>請選擇</option>
      <option value="Question">冷知識</option>
      <option value="FiveRadio">冷知識22222</option>
    </select>
    <Suspense>
    <Question v-if="choice === 'Question'" />
  </Suspense>
  <Suspense>
    <FiveRadio v-if="choice === 'FiveRadio'" />
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
