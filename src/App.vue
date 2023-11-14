<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { provide, reactive, readonly, ref } from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

let drawer = ref(false);
let choice = reactive({ title: '冷知識', value: "Question" });
let items = [
  { title: '冷知識', to: "/english" },
  { title: '冷知識2', to: "/fiveradio" },
  { title: '動物常識', to: "/animalapp" }
]

// const account = reactive({
//   name: '彭于芳',
//   email: 'prp00328evonne@gmail.com'})
// provide(/* key */ 'account', /* value */ account)

const account = reactive({
  name: '未登入',
  email: ''
})
const auth = getAuth(app)
const unsub = onAuthStateChanged(auth, (user) => {
  if (user) {
    account.name = '已登入'
    account.email = user.email ? user.email : ''
    console.log(user);
  }
  else {
    account.name = '未登入'
    account.email = ''
  }
  return () => {
    unsub();
  }
}
);
// provide(/* key */ 'account', /* value */ account)
provide(/* key */ 'account', /* value */ readonly(account))

</script>

<template>
  <v-app class="rounded rounded-md">
    <v-app-bar style="background-color: #fffcf0;">
      <div>
        <img src="./assets/logo.PNG" style="height: 60px;" />
      </div>
      <div id="btn">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-btn style="margin: 0px 20px 0px 10px; padding: 5px; background-color: #F58D59; color: white; font-weight: bold">登入</v-btn>
      </div>
    </v-app-bar>
    <v-navigation-drawer floating permanent v-model="drawer" style="border: 1px solid lightgray;">
      <v-list>
        <v-list-item v-for="item in items" :title="item.title" :key="item.title" :to="item.to">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #fffcf0;">
      <div>
        <v-container>
          <Suspense>
            <RouterView />
          </Suspense>
        </v-container>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr;">
        <div style="padding: 200px 110px 200px 290px">
          <p style="font-size: 50px; font-weight: bold;">用學習陪伴動物</p>
          <p style="font-size: 35.5px">與小孩共創成長回憶！</p>
        </div>
        <div>
          <img src="./assets/zoo.png" style="height: 450px" />
        </div>
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