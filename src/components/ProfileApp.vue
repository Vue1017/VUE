<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { reactive } from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from '@firebase/firestore';
import { deleteDoc, deleteField, updateDoc } from 'firebase/firestore';

type state_type = {
  choice: { title: string, value: number },
  answer: string[],
  answers: string[][],
  message: string[],
  exams: { number1: string, number2: string, title: string, answer: string, answers: string[], choice: string[] }[],
  question: { number1: number, number2: number, }[]

  // question: {title:number}
}
const state: state_type = reactive({
  choice: { title: '單元一', value: 1 },
  answer: [''],
  answers: [],
  message: [''],
  exams: [{ number1: '', number2: '', title: '', answer: '', answers: [''], choice: ['', ''] }],
  question: [{ number1: 0, number2: 0, }]
  // question: [{title:0}]
  // questionChoice: [{choice:''}]
})
const db = getFirestore(app);

const account = reactive({
  name: '',
  email: '',
  password: '',
  uid: '',
  tel: '',
  animalapp_1: 0,
  animalapp_2: 0,
  animalapp1_f: 0,
  animalapp2_f: 0,
  animal1_count:0,
  animal2_count:0,
  QA1:0,
  QA2:0,
  QA1_f:0,
  QA2_f:0,
  QA1_count:0,
  QA2_count:0,

  loginCount: 0,
})
const auth = getAuth(app)
const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    account.name = '已登入'
    account.email = user.email ? user.email : ''
    account.uid = user.uid ? user.uid : ''
    const userDoc = await getDoc(doc(db, "Users", user.uid));
    if (userDoc.exists()) {
      account.name = userDoc.data().name ? userDoc.data().name : ''
      account.uid = user.uid ? user.uid : ''
      account.email = user.email ? user.email : ''
      account.tel = userDoc.data().tel ? userDoc.data().tel : ''
      account.loginCount = userDoc.data().loginCount ? userDoc.data().loginCount : ''
      account.animalapp_1 = userDoc.data().animalapp_1 ? userDoc.data().animalapp_1 : 0
      account.animalapp_2 = userDoc.data().animalapp_2 ? userDoc.data().animalapp_2 : 0
      account.animalapp1_f = userDoc.data().animalapp1_f ? userDoc.data().animalapp1_f : 0
      account.animalapp2_f = userDoc.data().animalapp2_f ? userDoc.data().animalapp2_f : 0
      account.animal1_count = userDoc.data().animal1_count ? userDoc.data().animal1_count : 0
      account.animal2_count = userDoc.data().animal2_count ? userDoc.data().animal2_count : 0
      account.QA1 = userDoc.data().QA1 ? userDoc.data().QA1 : 0
      account.QA2 = userDoc.data().QA2 ? userDoc.data().QA2 : 0
      account.QA1_f = userDoc.data().QA1_f ? userDoc.data().QA1_f : 0
      account.QA2_f = userDoc.data().QA2_f ? userDoc.data().QA2_f : 0
      account.QA1_count = userDoc.data().QA1_count ? userDoc.data().QA1_count : 0
      account.QA2_count = userDoc.data().QA2_count ? userDoc.data().QA2_count : 0 
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

async function onClick() {
  const userDocRef = doc(db, "Users", account.uid);

  try {
    await updateDoc(userDocRef, {
      tel: deleteField()
    });

    account.tel = '';
    alert("刪除成功！")
  } catch (error) {
    console.error("刪除錯誤");
  }
}




</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
    <div></div>
    <div
      style="background-color: #f58d59; width: 510px; height: 550px; padding-top: 5px; border-radius: 80px; margin-top: 40px;">
      <center>
        <p
          style="color: white; font-weight: bold; font-size: 25px; background-color: #844200; width: 160px; border-radius: 30px; margin-bottom: 15px; line-height: 40px; margin-top: 10px;">
          個人檔案</p>
      </center>
      <div style="margin-top: 30px; line-height: 46px; font-weight: bold;">
        <div style="font-size: 18px; margin-left: 15%;">
          <p>姓名：{{ account.name }}<a class="button" href="./updateprofile" style="margin-left: 5px;"><img
                src="../assets/pen.png" style="width: 19px;"></a></p>
          <p>電子郵件：{{ account.email }}</p>
          <div style="display: flex; justify-content: space-between;">
            <div style="display: flex;">
              <p>聯絡電話：{{ account.tel }}</p>&nbsp;
              <v-btn style="margin-right:50px;margin-top: 10px;height: 25px;" @click="onClick">刪除</v-btn>
            </div>
            <v-btn style="margin-right:50px;margin-top: 10px;height: 25px;" href="./AddTel">新增</v-btn>
          </div>
          <p>登入次數：{{ account.loginCount }}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; margin: 0px 40px 0px 40px;">
          <div style="margin-right: 5px;">
            <div style="margin-top: 8px">
              <p>【答題記錄】</p>
              <div>
                <table style="background-color: #FEF1E6; border-radius: 20px;">
                  <thead>
                    <tr>
                      <th style="width: 120px">冷知識(一)</th>
                      <th style="width: 150px">動物常識(一)</th>
                    </tr>
                  </thead>
                  <tbody style="text-align: center;">
                    <tr>
                      <td>{{ account.QA1_count }}</td>
                      <td>{{ account.animal1_count }}</td>
                    </tr>
                  </tbody>
                  <thead>
                    <tr>
                      <th>冷知識(二)</th>
                      <th>動物常識(二)</th>
                    </tr>
                  </thead>
                  <tbody style="text-align: center;">
                    <tr>
                      <td>{{ account.QA2_count }}</td>
                      <td>{{ account.animal2_count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div style="margin-left: 5px;">
            <div style="margin-top: 8px;">
              <p>【答對/答錯記錄】</p>
              <div>
                <table style="background-color: #FEF1E6; border-radius: 20px;">
                  <thead>
                    <tr>
                      <th style="width: 120px">冷知識(一)</th>
                      <th style="width: 150px">動物常識(一)</th>
                    </tr>
                  </thead>
                  <tbody style="text-align: center;">
                    <tr>

                      <td>{{account.QA1}}/{{ account.QA1_f }}</td>
                      <td>{{ account.animalapp_1 }}/{{account.animalapp1_f}}</td>

                    </tr>
                  </tbody>
                  <thead>
                    <tr>
                      <th>冷知識(二)</th>
                      <th>動物常識(二)</th>
                    </tr>
                  </thead>
                  <tbody style="text-align: center;">
                    <tr>

                      <td>{{account.QA2}}/{{ account.QA2_f }}</td>
                      <td>{{ account.animalapp_2 }}/{{account.animalapp2_f}}</td>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>
