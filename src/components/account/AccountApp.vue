<script setup lang="ts">
import { reactive, inject, watch } from 'vue'
import app from '@/components/settings/FirebaseConfig.vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, } from 'firebase/auth'
import { FirebaseError } from 'firebase/app';
import router from '@/router';
import { doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'firebase/firestore';

const login = inject('account', { name: '', email: '' })
const account = reactive({
  name: '',
  email: '',
  password: ''
})
const state = reactive({
  message: '請輸入帳號密碼',
  status: 'info' as 'info' | 'error' | 'success' | 'warning' | undefined,
  action: 'signIn' as 'signUp' | 'signIn' | 'signOut'
})

const auth = getAuth(app)
const db = getFirestore(app);

watch(login, () => {
  if (login.email !== "") {
    account.email = login.email
    account.name = login.name
    state.action = 'signOut'
  }
})

async function handleClick(status: 'signIn' | 'signUp' | 'signOut') {
  try {
    state.status = 'info'
    if (status === 'signUp') {
      state.message = '註冊中...'
      const name = account.name;
      const res = await createUserWithEmailAndPassword(auth, account.email, account.password)
      const uid = res.user.uid;

      console.log(account.name)
      await setDoc(doc(db, "Users", uid), {
        name: name
      });
      if (res.user) {
        state.status = 'success'
        state.message = '註冊成功'
      }
      router.push("/")
    }
    else if (status === 'signIn') {
      state.message = '登入中...'
      const res = await signInWithEmailAndPassword(auth, account.email, account.password)
      const uid = res.user.uid;
      const userRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userRef);
      if (res.user) {
        if (userDoc.exists()) {
          account.name = userDoc.data().name ? userDoc.data().name : ''

          await updateDoc(userRef, {
            loginCount: increment(1)
          });
        }
        state.action = 'signOut'
        state.status = 'success'
        state.message = login.email + '登入成功'
      }
      router.push("/")
    } else {
      state.message = '登出中...'
      await signOut(auth)
      state.action = "signIn"
      state.status = 'success'
      state.message = '登出成功'
    }

  } catch (e) {
    state.status = 'error'
    if (e instanceof FirebaseError) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          state.message = '此帳號已被註冊'
          break
        case 'auth/invalid-email':
          state.message = '無效的帳號'
          break
        case 'auth/operation-not-allowed':
          state.message = '此帳號已被停用'
          break
        case 'auth/missing-password':
          state.message = '請輸入密碼'
          break
        case 'auth/weak-password':
          state.message = '密碼強度不足'
          break
        case 'auth/user-disabled':
          state.message = '此帳號已被停用'
          break
        case 'auth/user-not-found':
          state.message = '此帳號不存在'
          break
        case 'auth/wrong-password':
          state.message = '密碼錯誤'
          break
        case 'auth/too-many-requests':
          state.message = '登入失敗次數過多，請稍後再試'
          break
        case 'auth/network-request-failed':
          state.message = '網路錯誤'
          break
        case 'auth/internal-error':
          state.message = '內部錯誤'
          break
        default:
          state.message = e.code
          break
      }
    } else {
      state.message = "系統錯誤"
    }
  }
}

</script>
<template>
  <v-container>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: 80px;">
      <div></div>
      <div>
        <v-text-field v-if="state.action !== 'signIn'" v-model="account.name" label="姓名"></v-text-field>
        <div v-else>
          {{ account.name }}
        </div>
        <v-text-field v-if="state.action !== 'signOut'" v-model="account.email" label="帳號"></v-text-field>
        <v-text-field v-model="account.password" label="密碼" type="password"></v-text-field>
        <v-alert :type="state.status" title="訊息" :text="state.message"></v-alert>
      </div>
      <div></div>
    </div>
    <center style="margin-top: 30px;">
      <div v-if="state.action === 'signIn'">
        <v-btn style="background-color: #f58d59; color: white; font-weight: bold; margin: 5px;"
          @click="handleClick('signIn')">登入</v-btn>
        <v-btn style="background-color: #f58d59; color: white; font-weight: bold; margin: 5px;"
          @click="() => state.action = 'signUp'">我要註冊</v-btn>
      </div>
      <div v-else-if="state.action === 'signUp'">
        <!-- <v-btn style="background-color: #f58d59; color: white; font-weight: bold; margin: 5px;" @click="handleClick('signOut')">登出</v-btn> -->
        <v-btn style="background-color: #f58d59; color: white; font-weight: bold; margin: 5px;"
          @click="() => state.action = 'signIn'">我要登入</v-btn>
        <v-btn style="background-color: #f58d59; color: white; font-weight: bold; margin: 5px;"
          @click="handleClick('signUp')">註冊</v-btn>

      </div>
      <div v-else>
        <v-btn color="secondary" @click="handleClick('signOut')">登出</v-btn>
      </div>
    </center>
  </v-container>
</template>