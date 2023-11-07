<script setup lang="ts">
import { reactive, watch, inject } from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { collection, getDocs, getFirestore, where, query } from 'firebase/firestore'

const account = inject('account',{name:'未登入', email:''})
const state = reactive({ choice: { title: '單元一', value: 1, index:1 }, answer: [''], message: [''],exams:[{title:"",answer:""}]})

const db = getFirestore(app)

generateQuestions();

let units=[
  {title:'單元一', value:1, index:1},
  {title:'單元二', value:2, index:2},
]

function checkAnswers() {
  state.message = [] // clear previous messages
  for (let i in state.exams) {
    if (state.answer[i] !== state.exams[i].answer) {
      state.message[i] = '不正確'
    } else {
      state.message[i] = '正確'
    }
  }
}


watch(() => state.choice,generateQuestions);
async function generateQuestions(){ 
  console.log("choice",state.choice)
  state.exams=[];
  const queryExam = query(collection(db, 'question'), where("unit", "==", state.choice));
  const querySnapshot = await getDocs(queryExam);
  querySnapshot.forEach((doc) => {
    state.exams.push({title:doc.data().title, answer:doc.data().answer});
  });
}
</script>

<template>
  <div>
    {{ account.name }}
    <v-select label="請選擇" v-model="state.choice" :items="units"> </v-select>
  </div>
  <div v-for="(exam, index) in state.exams" :key="index">
    <v-text-field
      v-model="state.answer[index]"
      :label="exam.title"
      :messages="state.message[index]"
    >
    </v-text-field>
  </div>
  <v-btn color="primary" @click="checkAnswers">檢查答案</v-btn>
</template>
