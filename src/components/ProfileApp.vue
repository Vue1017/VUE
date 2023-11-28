<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { reactive} from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from '@firebase/firestore';

type state_type = {
  choice: {title:string, value:number},
  answer: string[],
  answers: string[][],
  message: string[],
  exams: {number1:string,number2:string,title:string, answer:string, answers:string[], choice:string[]}[],
  question:{  number1: number, number2: number,}[]

  // question: {title:number}
}
const state:state_type = reactive({
  choice: { title: '單元一', value: 1 },
  answer: [''],
  answers: [],
  message: [''],
  exams: [{number1:'' ,number2:'' ,title: '', answer:'', answers: [''], choice: ['', ''] }],
  question:[{  number1: 0, number2: 0,}]
  // question: [{title:0}]
  // questionChoice: [{choice:''}]
})
const db = getFirestore(app);

const account = reactive({
  name: '',
  email: '',
  password: '',
  uid:'',
  animalapp_1:0,
  animalapp_2:0,
})
const auth = getAuth(app)
const unsub = onAuthStateChanged(auth, async (user)=>{
  if (user) {
    account.name='已登入'
    account.email = user.email?user.email:''
    account.uid = user.uid?user.uid:''
    
    const userDoc = await getDoc(doc(db, "Users", user.uid));

    if (userDoc.exists()) {
      account.name = userDoc.data().name? userDoc.data().name:''
      account.uid = user.uid?user.uid:''
      account.animalapp_1=userDoc.data().animalapp_1? userDoc.data().animalapp_1:0
      account.animalapp_2=userDoc.data().animalapp_2? userDoc.data().animalapp_2:0
    }
    else{
      account.name = '未登入'
    }
  }
  else{
    account.name='未登入'
    account.email = ''
  }
  return () => {
    unsub();
  }}
);

</script>

<template>


  <div v-if="state.choice.value === 1">
    <BookOne />

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

</template>
