<script setup lang="ts">
import { reactive , watch} from 'vue'
import app from '@/components/settings/FirebaseConfig.vue'
import { collection, getDocs, getFirestore, where, query } from 'firebase/firestore'

const state = reactive({ choice: { title: '單元一', value: 1, index:1 }, answer: [''], message: [''],exams:[{title:"",answer:""}]})

const db = getFirestore(app)
// const querySnapshot = await getDocs(query(collection(db, 'question'), orderBy('unit')))
generateQuestions();
// const querySnapshot = await getDocs(query(collection(db, 'question'), where('unit', '==', state.choice.value)))
// let exams: { title: string; answer: string }[] = []
// querySnapshot.forEach((doc) => {
//   exams.push({ title: doc.data().title, answer: doc.data().answer })
//   console.log(`${doc.id} => ${doc.data()}`)
// })

// const state = reactive({ message: [""], currentQuestion: 0, answer:[""] });
// const queryExam = query(collection(db, 'question'), where("unit", "==", state.choice.value));
let units=[
  {title:'單元一', value:1, index:1},
  {title:'單元二', value:2, index:2},
]
// let exams = [
//   { question: '白痴的英文「idiot」願意是指哪種人？', answer: '不關心政治的人', options: ['不關心政治的人', '看喜劇沒笑的人', '上學沒交作業的人', '數學不好的人'] },
//   { question: '古時候的香草味會用哪種材料製作？', answer: '河狸的肛門腺', options: ['鯨魚的排泄物', '河狸的肛門腺', '麝鼠的膽結石', '古龍的大寶玉'] },
//   { question: '貓其實吃不出：', answer: '甜味', options: ['苦味', '酸味', '甜味', '辣味'] },
//   { question: '「school」的原意是？', answer: '休閒時間', options: ['玩樂時間', '休閒時間', '睡覺時間', '讀書時間'] },
//   { question: '在瑞士只養一隻「？」是犯法的',answer:'天竺鼠',options:['狗','貓','天竺鼠','鸚鵡']}
// ]
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


// function generateQuestion() {
//   if (exams[state.currentQuestion].answer === state.answer) {
//     state.message = "答案正確";
//     if (state.currentQuestion + 1 < exams.length) {
//       state.currentQuestion++;
//     }
//   } else {
//     state.message = "答案錯誤";
//   }

// }

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
