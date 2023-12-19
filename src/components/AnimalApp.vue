<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import app from '@/components/settings/FirebaseConfig.vue'
import { collection, getDocs, getFirestore, where, query, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore'
import BookOne from '@/components/bookOne.vue'
import BookTwo from '@/components/bookTwo.vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { CompilerDeprecationTypes } from '@vue/compiler-core'


type state_type = {
  choice: { title: string, value: number },
  answer: string[],
  answers: string[][],
  message: string[],
  exams: { title: string, answer: string, answers: string[], choice: string[] }[]
}
const state: state_type = reactive({
  choice: { title: '單元一', value: 1 },
  answer: [''],
  answers: [],
  message: [''],
  exams: [{ title: '', answer: '', answers: [''], choice: ['', ''] }]
  // questionChoice: [{choice:''}]
})

const account = reactive({
  name: '',
  email: '',
  password: '',
  uid: '',
  answerQA: 0,
})

const auth = getAuth(app)
const db = getFirestore(app);
// generateQuestions()

// let questionChoice = [
//   { options: ["老鼠", "鴨嘴獸", "大象", "南極藍鯨"] , unit:1},
//   { options: ["樹懶", "熊貓", "邱柏儒", "無尾熊"] , unit:2},
//   { options: ["YT", "輔大官網", "國家地理", "EducationZone"], unit:3
//   },
// ];

const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    account.name = '已登入'
    account.email = user.email ? user.email : ''
    account.uid = user.uid ? user.uid : ''

    const userDoc = await getDoc(doc(db, "user", user.uid));

    if (userDoc.exists()) {
      account.name = userDoc.data().name ? userDoc.data().name : ''
      account.uid = user.uid ? user.uid : ''
      account.answerQA = userDoc.data().animal1_count ? userDoc.data().animal1_count : ''
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

let units = [
  { title: '單元一', value: 1 },
  { title: '單元二', value: 2 }
]

async function checkAnswers() {
  let correct = 0;
  if (state.choice.value === 1) {
    state.message = []
    for (let i in state.exams) {
      if (state.answer[i] == state.exams[i].answer) {
        correct++;
        state.message[i] = '正確'
      } else {
        state.message[i] = '不正確?'
      }
    }
    let incorrect = 2 - correct;
    await updateDoc(doc(db, "Users", account.uid), {
      animalapp_1: correct,
      animalapp1_f: incorrect,
      animal1_count: increment(1),
    });
  } else {
    let correctCount = 0;
    state.message = []
    for (let i in state.exams) {
      if (state.exams[i].answers.length === state.answers[i].length) {
        let correct = 0;
        for (let item of state.exams[i].answers) {

          if (state.exams[i].answer.includes(item)) {
            correct++;
          }
        }
        if (correct == state.exams[i].answers.length) {
          state.message[i] = '正確'
          correctCount++;
        }
        else {
          console.log(correct);
          state.message[i] = '不正確'
        }
      }
      else {
        state.message[i] = '不正確'
      }
    }
    let incorrect = 2 - correctCount;
    await updateDoc(doc(db, "Users", account.uid), {
      animalapp_2: correctCount,
      animalapp2_f: incorrect,
      animal2_count: increment(1),
    });
  }
}

async function next() {
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
  showNextButton.value = true;
}

// watch(() => state.choice.value, generateQuestions)
// async function generateQuestions() {
//   console.log('choice', state.choice)
//   state.exams = []
//   const queryExam = query(collection(db, 'Animal'), where('unit', '==', state.choice.value))
//   const querySnapshot = await getDocs(queryExam)
//   let i = 0;
//   querySnapshot.forEach((doc) => {
//     console.log('g', doc.data())
//     state.answers.push([])
//     state.exams.push({
//       title: doc.data().title,
//       answers: doc.data().answer,
//       answer: doc.data().answer,
//       choice: doc.data().choice
//     })
//     i++;
//   })
// }

const showNextButton = ref(false)
</script>

<template>
  <center>
    <div style="width: 50%; margin-top: 50px;">
      <div>
        <v-select label="請選擇" v-model="state.choice.value" :items="units"> </v-select>
      </div>

      <div v-if="state.choice.value === 1">
        <BookOne />
        <v-btn style="margin: 15px 0px 15px 0px;" @click="next" >查看問題</v-btn>
        <!-- <div v-if="showNextButton"> -->
        <div v-for="(exam, index) in state.exams" :key="index">
          <v-radio-group v-model="state.answer[index]" :label="exam.title" :messages="state.message[index]" v-if="showNextButton">
            <v-radio v-for="(c, index) in exam.choice" :key="index" v-model="state.answer[index]" :value="c" :label="c">
            </v-radio>
          </v-radio-group>
        </div>
        <!-- </div> -->
      </div>

      <div v-if="state.choice.value === 2">
        <BookTwo />
        <v-btn style="margin: 15px 0px 15px 0px" @click="next" >查看問題</v-btn>
        <div v-for="(exam, index) in state.exams" :key="index">
          <div :label="exam.title" :messages="state.message[index]" v-if="showNextButton">
            <p style="text-align: left; font-weight: bold">{{ exam.title }}</p>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;" >
              <p>你選擇的答案：{{ state.answers[index] }}</p>
              <p>答題結果：{{ state.message[index] }}</p>
            </div>
            <v-checkbox v-for="(c, i) in exam.choice" :key="i" v-model="state.answers[index]" :value="c" :label="c">
            </v-checkbox>
          </div>

        </div>
      </div>
    </div>
    <v-btn style="margin: 20px 0px 70px 0px;" color="primary" @click="checkAnswers">檢查答案</v-btn>
  </center>
</template>
