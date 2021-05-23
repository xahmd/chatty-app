<template>
  <q-page class="flex flex-center">
    <div class="card text-center">
      <img
        src="~assets/logo.png"
        style="height:auto;width:100px;"
      >
      <q-input ref="username" dark dir="rtl" v-model="username" placeholder="الاسم" :rules="[ username => username.length > 2 || 'الرجاء وضع اسم لايقل عن ثلاث خانات']" />
      <q-input ref="idroom" type="number" readline= true min="1" max="9" dark dir="rtl" v-model="room" placeholder="رقم الغرفة" :rules="[val => !!val || 'يجب وضع رقم الغرفة']" />
      <br>
      <q-btn @click="click" push color="primary" type="submit" text-color="white" class="full-width" label="دخول" />
      <p style="color:white;margin-top:10px;">بمجرد دخولك فإنك توافق على <a style="color:#43B3C0;text-decoration: blink;" href="#/tos">سياسة الاستخدام</a></p>
    </div>
    <q-footer class="text-white text-center" style="background-color: #1E1E1E;">
      <q-toolbar>
        <q-toolbar-title>
          <p style="font-size: 15px;">Made With ❤️ By <a style="color:#43B3C0;text-decoration: blink;" href="https://github.com/ahmedbinmoh">Ahmed</a> & <a style="color:#43B3C0;text-decoration: blink;" href="https://instagram.com/alonemazin">Mazin</a></p>
        </q-toolbar-title>
      </q-toolbar>
  </q-footer>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  data(){
    return{
      username:"",
      room:""
    }
  },
  methods: {
    click(){
      this.$refs.username.validate()
      this.$refs.idroom.validate()
      if(this.$refs.username.validate() == true && this.$refs.idroom.validate() == true){
        LocalStorage.set("username", this.username)
        this.$router.push("/chat/"+ this.room)
      }
    }
  }
}
</script>
