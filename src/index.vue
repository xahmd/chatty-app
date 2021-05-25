

<template>

  <div
    class="view login"
    :style="{ backgroundColor: state.themeColor }"
    v-if="state.username === '' || state.username === null"
  >

    <form action="" class="login-form" @submit.prevent="Login">
      <div class="main-form">
        <h1 style="text-align: center;">مرحباً بك 🤩 </h1>
        <h2 style="text-align: center; font-size: 16px;"> <small> Made With 💓 By <a href="https://github.com/ahmedbinmoh" target="_blank" style="color: red; cursor: help;"> Ahmed.</a> <a href="https://github.com/alonemazin" target="_blank" style="color: red; cursor: help;"> Mazin.</a> </small> </h2> 

        <label style="text-align: right;" for="username">الاسم</label>
        <input style="text-align: right;"
          type="text"
          v-model="inputUsername"
          placeholder="قم بكتابة اسمك"
        />

        <label style="text-align: right;" for="RChat">كود الشات</label>
        <input style="text-align: right;" min="1" max="9"
          type="number"
          v-model="inputRChat"
          placeholder="أدخل رقم الشات (1-9)"
          
        />
        
        <input
          type="submit"
          value="دخـول"
          :style="{ backgroundColor: state.themeColor }"
          />
          
          <strong  style="text-align: center; position: relative; bottom: -30px; color: #000;">بمجرد دخولك  فإنك توافق على <a  href="index.html" style="color: red">  سياسة الاستخدام</a> </strong>
     
      </div>
      
    </form> 

  
  </div>

 

  
  <div class="view chat" :style="{ backgroundColor: state.themeColor }" v-else>
    <header>
      <button class="leaveChat" type="button" @click="leaveChat" >خــروج</button>
      <h3 class="room-code">رقم الغرفة: {{ state.RChat }}</h3>
     
      <div style="color: #fff; text-align: right; font-size: 15px;">مرحباً @{{ state.username }}</div>
    </header>
    <section class="mainchat" id="mainchat">
      <div v-if="state.messages.length >= 1">
        <div class="message">
          <div class="msg-ge">
            
          </div>
        </div>
      </div>
      <div
        v-for="(message, index) in state.messages"
        :key="'key' + message.id"
        :id="'id' + message.id"
        :style="{ marginTop: message.displayTime ? '30px' : '15px' }"
      >
        <span v-if="message.displayTime" class="time">{{ message.time }}</span>
        <div
          :class="
            message.username === state.username
              ? 'message current-user'
              : 'message'
          "
          :style="{ paddingTop: message.displayTime ? '10px' : '0px' }"
        >
          <div class="msg-ge">
            <div
              class="user-info"
              v-if="
                index === 0
                  ? true
                  : state.messages[index - 1].username !== message.username
              "
              :style="{
                justifyContent:
                  message.username !== state.username
                    ? 'flex-start'
                    : 'flex-end',
              }"
            >
              <div
                v-if="message.username !== state.username"
                class="avatar"
                :style="{ backgroundColor: '#808e9b' }" 
              >
                 <span>{{ message.username.slice(0, 1) }}</span> 
              </div>
              <div class="username">{{ message.username }}</div>
          
            </div>
            <div
              class="content"
              :style="{
                backgroundColor:
                  message.username == state.username
                    ? state.themeColor
                    : '#f3f3f3',
              }"
            >
              <p>{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  

  
    <footer>
      <div :style="{ display: 'flex' }">
    
        <form action="" @submit.prevent="SendMessage">
          <input
            type="text"
            v-model="Messagespace"
            placeholder="أكـتـب رسالتك"
            :style="{ caretColor: state.themeColor }" style="direction: rtl;"
          />
          <input
            type="submit"
            value="إرسال"
            :style="{ backgroundColor: state.themeColor }"
          />
        </form>
      </div>
    </footer>
  </div>


</template>



<script>

import { reactive, ref, onMounted } from 'vue';
import db from './db';
import $ from 'jquery';

export default {
  setup() {
    const inputUsername = ref('');
    const inputRChat = ref('');
    const Messagespace = ref('');

    var mainucolor = '#504C4C';
    if (typeof Storage !== 'undefined') {
      
      mainucolor =
        localStorage.getItem('maintheme') === undefined
          ? mainucolor
          : localStorage.getItem('maintheme');
    } else {
      console.log("error in locals") // error message hna
    }

    const state = reactive({
      username: '',
      RChat: '',
      messages: [],
      themeColor: mainucolor,
    });

    const Login = () => {
      if (
        inputUsername.value !== '' &&
        inputUsername.value !== null &&
        inputRChat.value !== '' &&
        inputRChat.value !== null &&
        chat3l(inputRChat.value)
      ) {
        state.username = inputUsername.value;
        state.RChat = inputRChat.value;
        inputUsername.value = '';
        inputRChat.value = '';
      }
     getmsgs();
    };

    const chat3l = (string) => {
      return /\d{1}$/.test(string);
    };

    const leaveChat = () => {
      state.username = '';
    };

    const SendMessage = () => {
      const datasend = db.database().ref(`messages-${state.RChat}`);
      if (Messagespace.value === '' || Messagespace.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: Messagespace.value,
        time: Date.now(),
      };

      datasend.push(message);
      Messagespace.value = '';
    };

    const getmsgs = () => {
      state.messages = [];
      const datasend = db.database().ref(`messages-${state.RChat}`);
      datasend.on('value', (snapshot) => {
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
            time: getDateString(data[key].time),
            displayTime: displayTime,
          });
        }

        state.messages = messages;

        maxdown();
      });
    };
   
// لا تسوي خوي هنا يغبي
    const getDateString = (previousTime) => {
      var result = '';
      const currentTime = Date.now();

      if (
        DateDiff.inMinutes(new Date(previousTime), new Date(currentTime)) < 5
      ) {
        result = '';
      } else if (
        DateDiff.inMinutes(new Date(previousTime), new Date(currentTime)) < 60
      ) {
        result =
          DateDiff.inMinutes(new Date(previousTime), new Date(currentTime)) +
          ' mins ago';
      } else if (
        DateDiff.inHours(new Date(previousTime), new Date(currentTime)) < 12
      ) {
        result = new Date(previousTime).customFormat('#hhh#:#mm#');
      } else if (
        DateDiff.inDays(new Date(previousTime), new Date(currentTime)) < 7
      ) {
        result = new Date(previousTime).customFormat('#DDD# #hhh#:#mm#');
      } else if (
        DateDiff.inYears(new Date(previousTime), new Date(currentTime)) > 0
      ) {
        result = new Date(previousTime).customFormat(
          '#YYYY# #MMM# #DD# #hhh#:#mm#'
        );
      } else {
        result = new Date(previousTime).customFormat('#MMM# #DD# #hhh#:#mm#');
      }
      return result;
    };

    var DateDiff = {
      inMinutes: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (60 * 1000));
      },
      inHours: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (3600 * 1000));
      },
      inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
      },
      inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
      },
      inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return d2M + 12 * d2Y - (d1M + 12 * d1Y);
      },
      inYears: function(d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
      },
    };


    Date.prototype.customFormat = function(formatString) {
      var YYYY,
        YY,
        MMMM,
        MMM,
        MM,
        M,
        DDDD,
        DDD,
        DD,
        D,
        hhhh,
        hhh,
        hh,
        h,
        mm,
        m,
        ss,
        s,
        ampm,
        AMPM,
        dMod,
        th;
      YY = ((YYYY = this.getFullYear()) + '').slice(-2);
      MM = (M = this.getMonth() + 1) < 10 ? '0' + M : M;
      MMM = (MMMM = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ][M - 1]).substring(0, 3);
      DD = (D = this.getDate()) < 10 ? '0' + D : D;
      DDD = (DDDD = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][this.getDay()]).substring(0, 3);
      th =
        D >= 10 && D <= 20
          ? 'th'
          : (dMod = D % 10) == 1
          ? 'st'
          : dMod == 2
          ? 'nd'
          : dMod == 3
          ? 'rd'
          : 'th';
      formatString = formatString
        .replace('#YYYY#', YYYY)
        .replace('#YY#', YY)
        .replace('#MMMM#', MMMM)
        .replace('#MMM#', MMM)
        .replace('#MM#', MM)
        .replace('#M#', M)
        .replace('#DDDD#', DDDD)
        .replace('#DDD#', DDD)
        .replace('#DD#', DD)
        .replace('#D#', D)
        .replace('#th#', th);
      h = hhh = this.getHours();
      if (h == 0) h = 24;
      if (h > 12) h -= 12;
      hh = h < 10 ? '0' + h : h;
      hhhh = hhh < 10 ? '0' + hhh : hhh;
      AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
      mm = (m = this.getMinutes()) < 10 ? '0' + m : m;
      ss = (s = this.getSeconds()) < 10 ? '0' + s : s;
      return formatString
        .replace('#hhhh#', hhhh)
        .replace('#hhh#', hhh)
        .replace('#hh#', hh)
        .replace('#h#', h)
        .replace('#mm#', mm)
        .replace('#m#', m)
        .replace('#ss#', ss)
        .replace('#s#', s)
        .replace('#ampm#', ampm)
        .replace('#AMPM#', AMPM);
    };

    const maxdown = () => {
      setTimeout(() => {
        window.scrollTo({
          left: 0,
          top:
            document.body.scrollHeight || document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 50);
    };


    const hslToHex = (h, s, l) => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0'); 
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const ScrollTo = (positionName) => {
      if (positionName === 'top') {
        setTimeout(() => {
          window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth',
          });
        }, 50);
      } else if (positionName === 'bottom') {
        setTimeout(() => {
          window.scrollTo({
            left: 0,
            top:
              document.body.scrollHeight ||
              document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }, 50);
      }
    };

    window.addEventListener('scroll', () => resetOpacity());

    const resetOpacity = () => {
      
      $('.message').each(function() {
        var scrollTop = $(window).scrollTop(),
          elementOffset = $(this).offset().top,
          distance = elementOffset - scrollTop;
        $(this).css('opacity', distance / 300 + 0.2);
        

      });
    };



    return {
      inputUsername,
      inputRChat,
      state,
      Login,
      Messagespace,
      SendMessage,
      leaveChat,
    };
  },
};
</script>

<style lang="scss">
@import './style.scss';
</style>
