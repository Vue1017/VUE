<script setup lang="ts">
import { reactive } from 'vue'
import app from "@/components/settings/FirebaseConfig.vue"
import { collection, getDocs, getFirestore } from "firebase/firestore"; 
const db = getFirestore(app);
const querySnapshot = await getDocs(collection(db, "question"));
let exams:{title:string, answer:string}[]=[];
querySnapshot.forEach((doc) => {
  exams.push({title:doc.data().title,answer:doc.data().answer});
  console.log(`${doc.id} => ${doc.data()}`);
});

const state = reactive({ message: "", currentQuestion: 0, answer:"" });

// let exams = [
//   { question: '白痴的英文「idiot」願意是指哪種人？', answer: '不關心政治的人', options: ['不關心政治的人', '看喜劇沒笑的人', '上學沒交作業的人', '數學不好的人'] },
//   { question: '古時候的香草味會用哪種材料製作？', answer: '河狸的肛門腺', options: ['鯨魚的排泄物', '河狸的肛門腺', '麝鼠的膽結石', '古龍的大寶玉'] },
//   { question: '貓其實吃不出：', answer: '甜味', options: ['苦味', '酸味', '甜味', '辣味'] },
//   { question: '「school」的原意是？', answer: '休閒時間', options: ['玩樂時間', '休閒時間', '睡覺時間', '讀書時間'] },
//   { question: '在瑞士只養一隻「？」是犯法的',answer:'天竺鼠',options:['狗','貓','天竺鼠','鸚鵡']}
// ]

function generateQuestion() {
  if (exams[state.currentQuestion].answer === state.answer) {
    state.message = "答案正確";
    if (state.currentQuestion + 1 < exams.length) {
      state.currentQuestion++;
    }
  } else {
    state.message = "答案錯誤";
  }

}
generateQuestion();
</script>
<template>
  <div>
    {{ exams[state.currentQuestion].title }}
    <!-- <span v-for="option in exams[state.currentQuestion].options" :key="option">
      <input type="radio" v-model="state.answer" :value="option" />
      {{ option }}
    </span> -->
    {{ state.message }}
    <button @click="generateQuestion">下一題</button>
  </div>
</template>
