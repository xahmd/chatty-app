<template>
    <q-page class="text-center">
        <q-header elevated class="text-white flex flex-center" style="background-color: #181818;">
            <img
                src="~assets/logo.png"
                style="height:auto;width:60px;margin-right:auto;margin-left:25px;"
            >
            
            <a style="margin-right:auto;" >رقم الغرفة: {{this.roomid}}</a>
            <q-btn flat color="primary" label="الصفحة الرئيسية" v-go-back=" '/' " style="margin-right:10px;"/>
        </q-header>

        <div class="q-pa-md row justify-center">
            <div style="width: 100%;">
                <div v-for="Message in messages">
                    <q-chat-message 
                        style="color: white; text-align: right;"
                        v-if="Message.username == usernameIndex"
                        :name="[Message.username]"
                        text-color="white"
                        bg-color="secondary"
                        :text="[Message.content]"
                        sent              
                    />
                    <q-chat-message 
                        style="color: white; text-align: left;"
                        v-else
                        :name="[Message.username]"
                        text-color="white"
                        bg-color="primary"
                        :text="[Message.content]"              
                    />
                </div>
            </div>
        </div>
        
        <q-footer class="text-white" style="background-color: #181818;">
        <q-toolbar>
            <q-toolbar-title>
                <form action="" @submit.prevent="SendMessage()">
                    <q-input dark bottom-slots v-model="newMessage" placeholder="أكتب رسالتك هنا" dir="rtl" maxlength="200">
                        <template v-slot:append>
                        </template>

                        <template v-slot:after>
                        <q-btn round @click="SendMessage()" dense flat icon="send" />
                        </template>
                    </q-input>
                </form>
            </q-toolbar-title>
        </q-toolbar>
        </q-footer>
    </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import db from './db';

export default {
    data(){
        return{
            usernameIndex: LocalStorage.getItem('username'),
            newMessage: "",
            roomid: "",
            messages: []
        }
    },
    methods: {
    scrollToBottom() {
      setTimeout(() => {
        window.scrollTo({
          left: 0,
          top:
            document.body.scrollHeight || document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 50);
    },
    loadMessages() {
      const messageRef = db.database().ref(`messages-${this.roomid}`);
      messageRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data == null || data == undefined) {
          return;
        }
        let messages = [];
        const keys = Object.keys(snapshot.val());
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          
          const displayTime =
            i === 0
              ? true
              : data[keys[i]].time - data[keys[i - 1]].time > 300000;

          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
            time: data[key].time,
            displayTime: displayTime,
          });
        }

        this.messages = messages;

        this.scrollToBottom();
      });
    },
    SendMessage() {
      let messageRef = db.database().ref(`messages-${this.roomid}`);
      if (this.newMessage === '' || this.newMessage === null) {
        return;
      }

      let message = {
        username: this.usernameIndex,
        content: this.newMessage,
        time: Date.now(),
      };

      messageRef.push(message);
      this.newMessage = '';
    }
    },
        mounted(){
        this.roomid = this.$route.params.roomid
        this.loadMessages()
    }
}
</script>
