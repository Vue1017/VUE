<script setup lang="ts">
import { getDoc, getFirestore } from '@firebase/firestore';
import { inject, reactive, watch } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import app from '@/components/settings/FirebaseConfig.vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { FirebaseError } from 'firebase/app';
import router from '@/router';

const db = getFirestore(app);

// const account = reactive({
//   name: '',
//   email: '',
//   password: '',
//   uid:'',
//   animalapp_1:0,
//   animalapp_2:0,
//   loginCount:0,
// })
const login = inject('account', { name: '未登入', email: '', uid: '' })
const account = reactive({
  name: '未登入',
  email: '',
  uid: '',

})
const state = reactive({
  message: '',
})

const auth = getAuth(app)
const unsub = onAuthStateChanged(auth, async (user) => {
  if (user) {
    account.name = '已登入'
    account.email = user.email ? user.email : ''
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
    state.message = '尚未登入無法更新'
    return
  }
  try {
    state.message = '更新中...'
    const userRef = doc(db, "Users", account.uid);
    await updateDoc(userRef, {
      name: account.name
    });
    state.message = '更新成功'
    router.push("/ProfileApp");
  } catch (e) {
    if (e instanceof FirebaseError) {
      state.message = e.message
    } else {
      state.message = '更新失敗'
    }
  }
}
// async function handleClick(){
//   const userRef = doc(db, "Users", login.uid);

//   await updateDoc(userRef, {
//     name: account.name
//   });
// }
watch(login, () => {
  if (login.email !== "") {
    account.name = login.name
    account.uid = login.uid
  }
}, {
  immediate: true
})
</script>
<template>
  <div>
    <center>
      <div style="margin-top: 80px;">
        <v-text-field v-model=account.name label="姓名" style="width: 50%"></v-text-field>
        <p>{{ state.message }}</p>
        <div style="margin-top: 20px;">
          <router-link to="/">
            <v-btn color="secondary" style="margin-right: 10px;">回首頁</v-btn>
          </router-link>
          <v-btn color="primary" @click="handleClick()">修改</v-btn>
        </div>
      </div>
    </center>


    <!-- <v-container>
    <v-text-field v-model=account.name label="姓名"></v-text-field>

    <v-btn color="primary" @click="handleClick()">更新</v-btn>
    <v-btn color="secondary" >回首頁</v-btn>    
  </v-container> -->

  </div>
</template>