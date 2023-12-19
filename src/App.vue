<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { provide, reactive, readonly, ref } from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { query, collection, where, getDocs, getFirestore, doc, getDoc } from '@firebase/firestore';


let drawer = ref(false);
let choice = reactive({ title: '冷知識', value: "Question" });
let items = [
  { title: '冷知識', to: "/fiveradio" },
  { title: '動物英文', to: "/english" },
  { title: '動物常識', to: "/animalapp" },
]

type state_type = {
  choice: { title: string, value: number },
  answer: string[],
  answers: string[][],
  message: string[],
  exams: { number1: number, number2: number, title: string, answer: string, answers: string[], choice: string[] }[],
  // question: {title:number}
}
const state: state_type = reactive({
  choice: { title: '單元一', value: 1 },
  answer: [''],
  answers: [],
  message: [''],
  exams: [{ number1: 0, number2: 0, title: '', answer: '', answers: [''], choice: ['', ''] }],
  // question: [{title:0}]
  // questionChoice: [{choice:''}]
})

const db = getFirestore(app);

const account = reactive({
  name: '',
  email: '',
  password: '',
  uid: ''
})
const auth = getAuth(app)

const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    // account.name = ''
    account.email = user.email ? user.email : ''
    const userDoc = await getDoc(doc(db, "user", user.uid));
    console.log(user);
    if (userDoc.exists()) {
      account.name = userDoc.data().name ? userDoc.data().name : ''
      account.uid = user.uid ? user.uid : ''

    }
    else {
      account.name = '未登入A'
    }
  }
  else {
    account.name = '未登入B'
    account.email = ''
  }
  return () => {
    unsub();
  }
}
);

async function next() {
  const queryExam = query(collection(db, 'Users', account.uid))
  const querySnapshot = await getDocs(queryExam)
  querySnapshot.forEach((doc) => {
    console.log('g', doc.data())
    state.exams.push({
      title: doc.data().title,
      answers: doc.data().answer,
      answer: doc.data().answer,
      choice: doc.data().choice,
      number1: doc.data().animalapp_1,
      number2: doc.data().animalapp_2
    })
  })
  // showNextButton.value = true;
}

// provide(/* key */ 'account', /* value */ account)
provide(/* key */ 'account', /* value */ readonly(account))

async function onClick() {
  await signOut(auth)
}
next()
</script>

<template>
  <v-app class="rounded rounded-md">
    <v-app-bar display="flex" justify-content=" space-between" background-color="#fffcf0">
      <router-link to="/"><img src="./assets/logo.png" style="height: 60px; margin-left: 10px;" /></router-link>
      <v-spacer></v-spacer>
      <div id="btn">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <router-link to="/Account">
          <v-btn v-if="account.email == ''"
            style="margin: 0px 20px 0px 10px; padding: 5px; background-color: #f58d59; color: white; font-weight: bold;">登入</v-btn>
          <v-btn v-else
            style="margin: 0px 20px 0px 10px; padding: 5px; background-color: #f58d59; color: white; font-weight: bold;"
            @click="onClick()">登出</v-btn>
        </router-link>
      </div>
    </v-app-bar>
    <v-navigation-drawer floating permanent v-model="drawer" style="border: 1px solid lightgray;">
      <v-list>
        <v-list-item style="background-color: #F58D59; color: white; font-weight: bold; " to="/profileapp">
          個人檔案
        </v-list-item>
        <v-list-item v-for="item in items" :title="item.title" :key="item.title" :to="item.to">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #fffcf0;">
      <div>
        <!-- <v-container> -->
        <Suspense>
          <RouterView />
        </Suspense>
        <!-- </v-container> -->
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