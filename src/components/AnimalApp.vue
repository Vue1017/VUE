<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import app from '@/components/settings/FirebaseConfig.vue'
import { collection, getDocs, getFirestore, where, query } from 'firebase/firestore'
import BookOne from '@/components/bookOne.vue'
import BookTwo from '@/components/bookTwo.vue'

type state_type = {
  choice: {title:string, value:number},
  answer: string[],
  answers: string[][],
  message: string[],
  exams: {title:string, answer:string, answers:string[], choice:string[]}[]
}
const state:state_type = reactive({
  choice: { title: '單元一', value: 1 },
  answer: [''],
  answers: [],
  message: [''],
  exams: [{ title: '', answer:'', answers: [''], choice: ['', ''] }]
  // questionChoice: [{choice:''}]
})

const db = getFirestore(app)
generateQuestions()

// let questionChoice = [
//   { options: ["老鼠", "鴨嘴獸", "大象", "南極藍鯨"] , unit:1},
//   { options: ["樹懶", "熊貓", "邱柏儒", "無尾熊"] , unit:2},
//   { options: ["YT", "輔大官網", "國家地理", "EducationZone"], unit:3
//   },
// ];

let units = [
  { title: '單元一', value: 1 },
  { title: '單元二', value: 2 }
]

function checkAnswers() {
  if (state.choice.value === 1) {
    state.message = []
    for (let i in state.exams) {
      if (state.answer[i] !== state.exams[i].answer) {
        state.message[i] = '不正確?'
      } else {
        state.message[i] = '正確'
      }
    }
  } else {
    state.message = []
    for (let i in state.exams) {
      if (state.exams[i].answers.length === state.answers[i].length) {
        let correct = 0;
      for (let item of state.exams[i].answers) {

        if(state.exams[i].answer.includes(item)){
         correct ++;
        }
      }
       if(correct == state.exams[i].answers.length){
        state.message[i] = '正確'
       }
       else {
        console.log(correct);
        state.message[i] = '不正確2'
       
      }  }
      else {
        state.message[i] = '不正確1'
     
       }
    }
  }
}

async function next() {
  const queryExam = query(collection(db, 'Animal'), where('unit', '==', state.choice.value))
  const querySnapshot = await getDocs(queryExam)
  querySnapshot.forEach((doc) => {
    console.log('g', doc.data())
    state.exams.push({
      title: doc.data().title,
      answers: doc.data().answer,
      answer: doc.data().answer,
      choice: doc.data().choice
    })
  })
  showNextButton.value = true;
}

watch(() => state.choice.value, generateQuestions)
async function generateQuestions() {
  console.log('choice', state.choice)
  state.exams = []
  const queryExam = query(collection(db, 'Animal'), where('unit', '==', state.choice.value))
  const querySnapshot = await getDocs(queryExam)
  let i = 0;
  querySnapshot.forEach((doc) => {
    console.log('g', doc.data())
    state.answers.push([])
    state.exams.push({
      title: doc.data().title,
      answers: doc.data().answer,
      answer: doc.data().answer,
      choice: doc.data().choice
    })
    i++;
  })
}

const showNextButton = ref(true)
</script>

<template>
  <div>
    <v-select label="請選擇" v-model="state.choice.value" :items="units"> </v-select>
  </div>

  <div v-if="state.choice.value === 1">
    <BookOne />
    <v-btn @click="next" v-if="showNextButton">查看問題</v-btn>
    <div v-for="(exam, index) in state.exams" :key="index">
      <v-radio-group
        v-model="state.answer[index]"
        :label="exam.title"
        :messages="state.message[index]"
      >
        <v-radio
          v-for="(c, index) in exam.choice"
          :key="index"
          v-model="state.answer[index]"
          :value="c"
          :label="c"
        >
        </v-radio>
      </v-radio-group>
    </div>
  </div>

  <div v-if="state.choice.value === 2">
    <BookTwo />
    <v-btn @click="next" v-if="showNextButton">查看問題</v-btn>
    <div v-for="(exam, index) in state.exams" :key="index">

      <div

        :label="exam.title"
        :messages="state.message[index]"
      >
      {{ exam.title }}
      {{ state.message[index] }}
{{ state.answers[index] }}

      <v-checkbox
          v-for="(c, i) in exam.choice"
          :key="i"
          v-model="state.answers[index]"
          :value="c"
          :label="c"
        >
        </v-checkbox>
      </div>

    </div>
  </div>
  <v-btn color="primary" @click="checkAnswers">檢查答案</v-btn>
</template>
