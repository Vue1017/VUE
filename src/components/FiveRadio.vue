<script setup lang="ts">
import { reactive, watch, inject } from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { collection, getDocs, getFirestore, where, query, updateDoc, doc, increment, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "@firebase/auth";

// const account = inject('account',{name:'未登入', email:''})
const state = reactive({ choice: 1, answer: [''], message: [''], exams: [{ title: "", answer: "" }] })
const account = reactive({
  name: '',
  email: '',
  password: '',
  uid: '',
  answerQA: 0,
})

const auth = getAuth(app)
const db = getFirestore(app);



const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    account.name = '已登入'
    account.email = user.email ? user.email : ''
    account.uid = user.uid ? user.uid : ''

    const userDoc = await getDoc(doc(db, "user", user.uid));

    if (userDoc.exists()) {
      account.name = userDoc.data().name ? userDoc.data().name : ''
      account.uid = user.uid ? user.uid : ''
    }
    else {
      account.name = '未登入'
    }
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

generateQuestions();

let units = [
  { title: '單元一', value: 1, index: 1 },
  { title: '單元二', value: 2, index: 2 },
]

async function checkAnswers() {
  let correct = 0;
  state.message = [] // clear previous messages
  console.log("state.choice:", state.choice)
  if (state.choice === 1) {

    for (let i in state.exams) {
      if (state.answer[i] !== state.exams[i].answer) {
        state.message[i] = '不正確'
      } else {
        state.message[i] = '正確'
        correct++;
      }
    }
    let incorrect = 3 - correct;
    await updateDoc(doc(db, "Users", account.uid), {
      QA1: correct,
      QA1_f: incorrect,
      QA1_count: increment(1),
    });
  }
  else {

    for (let i in state.exams) {
      if (state.answer[i] !== state.exams[i].answer) {
        state.message[i] = '不正確'
      } else {
        state.message[i] = '正確'
        correct++;
      }
    }
    let incorrect = 3 - correct;
    await updateDoc(doc(db, "Users", account.uid), {
      QA2: correct,
      QA2_f: incorrect,
      QA2_count: increment(1),
    });
  }

}


watch(() => state.choice, generateQuestions);
async function generateQuestions() {
  console.log("choice", state.choice)
  state.exams = [];
  const queryExam = query(collection(db, 'question'), where("unit", "==", state.choice));
  const querySnapshot = await getDocs(queryExam);
  querySnapshot.forEach((doc) => {
    state.exams.push({ title: doc.data().title, answer: doc.data().answer });
  });
}
</script>

<template>
  <center>
    <div style="width: 50%; margin-top: 80px;">
      <div>
        <v-select style="margin-bottom: 25px;" label="請選擇" v-model="state.choice" :items="units"> </v-select>
      </div>
      <div v-for="(exam, index) in state.exams" :key="index">
        <v-text-field style="margin-bottom: 10px;" v-model="state.answer[index]" :label="exam.title" :messages="state.message[index]">
        </v-text-field>
      </div>
    </div>
    <v-btn color="primary" style="margin-top: 50px;" @click="checkAnswers">檢查答案</v-btn>
  </center>
</template>
