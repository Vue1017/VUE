<script setup lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { reactive } from "vue";
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from '@firebase/firestore';
import BookOneVue from './bookOne.vue';
import BookTwoVue from './bookTwo.vue';

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
   animalapp_1: 0,
   animalapp_2: 0,
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
         account.animalapp_1 = userDoc.data().animalapp_1 ? userDoc.data().animalapp_1 : 0
         account.animalapp_2 = userDoc.data().animalapp_2 ? userDoc.data().animalapp_2 : 0
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

</script>

<template>
   <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 30px;">
      <div style="padding: 220px 50px 50px 250px; width: 700px">
         <p style="font-size: 50px; font-weight: bold;">用學習陪伴動物</p>
         <p style="font-size: 35.5px">與小孩共創成長回憶！</p>
      </div>
      <div>
         <img src="../assets/zoo.png" style="height: 450px; margin-right: 80px;" />
      </div>
   </div>
   <div style="background-color: #F58D59; padding: 15px 20px 20px 20px;">
      <center>
         <p
            style="color: white; font-weight: bold; font-size: 25px; background-color: #844200; width: 160px; border-radius: 30px; margin-bottom: 15px; line-height: 40px;">
            動物快照</p>
      </center>
      <v-carousel cycle>
         <v-carousel-item src="https://mediaim.expedia.com/destination/1/af240e0c9e8db19e400de545be9c62b1.jpg"
            cover></v-carousel-item>
         <v-carousel-item
            src="https://www.kkday.com/zh-tw/blog/wp-content/uploads/asia-taiwan-taipei-zooP1590413-%E6%8B%B7%E8%B2%9D.jpg"
            cover></v-carousel-item>
         <v-carousel-item
            src="https://static.gltjp.com/glt/prd/data/directory/12000/11808/20210805_201012_29f412c6_w1920.jpg"
            cover></v-carousel-item>
      </v-carousel>
   </div>
   <div style="height: 350px; display: flex; margin-bottom: 80px;">
      <div style="margin-top: 100px; margin-left: 20px;">
         <p style="color: white; font-weight: bold; font-size: 25px; background-color: #844200; width: 40px; border-radius: 30px; height: 220px; padding-top: 15px;
         margin: 120px 0px px 20px; text-align: center;">
            知識學習區</p>
      </div>
      <div style="font-size: 18px; line-height: 40px; margin: 40px 65px 40px 60px;">
         <p>【什麼是冷知識呢？】
            <BookOneVue />
         </p>
         <div style="display: flex; justify-content: space-between;">
            <div></div>
            <div>
               <router-link to="/animalapp">
                  <v-btn>前往答題</v-btn>
               </router-link>
            </div>
         </div>
         <p>【什麼是動物園呢？】
            <BookTwoVue />
         </p>

         <div style="display: flex; justify-content: space-between;">
            <div></div>
            <div>
               <router-link to="/animalapp">
                  <v-btn>前往答題</v-btn>
               </router-link>
            </div>
         </div>
      </div>
   </div>
   <div style="background-color: #F58D59; padding: 15px 20px 20px 20px;">
      <center>
         <p
            style="color: white; font-weight: bold; font-size: 25px; background-color: #844200; width: 160px; border-radius: 30px; margin-bottom: 15px; line-height: 40px;">
            聯絡我們</p>
      </center>
      <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 0px;">
         <div>
            <iframe
               src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14459.735043571738!2d121.4326549!3d25.0363219!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a7dd8be91eaf%3A0xe342a67d6574f896!2z5aSp5Li75pWZ6LyU5LuB5aSn5a24!5e0!3m2!1szh-TW!2stw!4v1700550019273!5m2!1szh-TW!2stw"
               width="1200" height="150" style="border:0;"></iframe>
         </div>
         <div style="margin-left: 30px; font-weight: bold; line-height: 30px  ;">
            <p>聯絡窗口：吳娟娟</p>
            <p>聯絡信箱：ezzoo@gmail.com</p>
            <p>聯絡電話：0972366816</p>
            <p>園區營業時間：08:00-17:00</p>
            <p>窗口聯絡時間：08:30-17:30</p>
         </div>
      </div>
   </div>
   <div style="background-color: #642100; height: 100px; padding: 36px 0px 0px 0px;">
      <center>
         <p style="color: white;">@捐捐不息股份有限公司</p>
      </center>
   </div>
</template>