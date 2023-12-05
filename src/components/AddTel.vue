<script setup lang="ts">
import { getDoc, getFirestore } from '@firebase/firestore';
import { inject, reactive, watch } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { FirebaseError } from 'firebase/app';

const db = getFirestore(app);

// const account = reactive({
//   name: '',
//   tel: '',
//   password: '',
//   uid:'',
//   animalapp_1:0,
//   animalapp_2:0,
//   loginCount:0,
// })
const login = inject('account', { name: '未登入',email:'', tel: '', uid: '' })
const account = reactive({
   name: '未登入',
   email:'',
   tel: '',
   uid: '',

})
const state = reactive({
   message: '',
})

const auth = getAuth(app)
const unsub = onAuthStateChanged(auth, async (user) => {
   if (user) {
      account.name = ""
      account.uid = user.uid


      const userDoc = await getDoc(doc(db, "Users", user.uid));

      if (userDoc.exists()) {
         account.name = userDoc.data().name ? userDoc.data().name : ''
         account.uid = user.uid ? user.uid : ''
         account.email = user.email ? user.email : ''

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


async function handleClick() {
   if (account.uid === '') {
      state.message = '尚未登入無法新增'
      return
   }
   try {
      state.message = '新增中...'
      const userRef = doc(db, "Users", account.uid);
      await updateDoc(userRef, {
         tel: account.tel
      });
      state.message = '新增成功'
   } catch (e) {
      if (e instanceof FirebaseError) {
         state.message = e.message
      } else {
         state.message = '新增失敗'
      }
   }
}
// async function handleClick(){
//   const userRef = doc(db, "Users", login.uid);

//   await updateDoc(userRef, {
//     name: account.name
//   });
// }
// watch(login, () => {
//    if (login.tel !== "") {
//       account.name = login.name
//       account.uid = login.uid
//    }
// }, {
//    immediate: true
// })
</script>
<template>
   <div>
      <v-container>
         <v-text-field v-model=account.tel label="電話"></v-text-field>
         {{ state.message }}
         <v-btn color="primary" @click="handleClick()">新增</v-btn>
         <v-btn color="secondary">回首頁</v-btn>
      </v-container>


      <!-- <v-container>
    <v-text-field v-model=account.name label="姓名"></v-text-field>

    <v-btn color="primary" @click="handleClick()">更新</v-btn>
    <v-btn color="secondary" >回首頁</v-btn>    
  </v-container> -->

   </div>
</template>