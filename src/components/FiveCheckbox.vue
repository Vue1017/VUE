<script setup lang="ts">
import { reactive } from 'vue'
const state = reactive({ message: '', currentQuestion: 0, answer: [] })
let exams = [
  { question: '地球上只有兩種動物會吃辣：', answer: ['人', '樹鼩'], options: ['人', '樹鼩', '貓', '猴子'] },
  { question: 'goole logo沒有什麼顏色', answer: ['黑', '紫'], options: ['黑', '紫', '紅', '綠'] },
  { question: '1200定期票:', answer: ['新北', '台北', '桃園'], options: ['新北', '台北', '桃園', '新竹']},
  { question: '三原色是哪三原', answer: ['紅', '黃','藍'], options: ['綠', '黃', '紅', '藍'] },
  { question: '哪些是濟聰老師開的課', answer: ['行動裝置程式設計', '進階web程式設計'], options: ['行動裝置程式設計', '進階web程式設計', 'C++', 'python']}
  
]
function generateQuestion(){
   if (exams[state.currentQuestion].answer.length === state.answer.length) {
    let correct = 0;
    for (var item of state.answer) {
      if (exams[state.currentQuestion].answer.includes(item)) {
        correct++;
      }
    }
    if (correct == exams[state.currentQuestion].answer.length) {
      state.message = "答案正確";
      if (state.currentQuestion + 1 < exams.length) {
        state.currentQuestion++;
        state.answer = []; //清空上次的答案，否則會讀到上次的值
      }
    } else {
      state.message = "答案錯誤";
    }
  } else {
    state.message = "答案錯誤";
  }
}
</script>
<template>
  <div>
    {{ exams[state.currentQuestion].question }}
    <!-- <span v-for="option in exams[state.currentQuestion].options" :key="option">
      <input type="radio" v-model="state.answer" :value="option" />
      {{ option }}
    </span> -->
    <span v-for="option in exams[state.currentQuestion].options" :key="option">
      <input type="checkbox" v-model="state.answer" :value="option" />
      {{ option }}
    </span>
    {{ state.message }}
    <button @click="generateQuestion">下一題</button>
  </div>
</template>
