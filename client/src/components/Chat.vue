<template>
  <div class="chat">
		<div class="top">
      Chat with a stranger
      <div id="next-btn" v-on:click="next()">Next</div>
    </div>
    <div id="messages" v-chat-scroll>
      <div class="msg-container" v-for="message in messages">
        <div :class="message.class">{{ message.text }}</div>
      </div>
      <!--<div class="msg-client">Test message from client</div>-->
    </div>
    <input id="input" type="text" v-model.lazy="newMessage" placeholder="Write your message here..."/>
    <div id="input-btn">Send</div>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  name: 'Chat',
  data () {
    return {
      msg: 'Hello World',
      messages: [],
      newMessage: '',
      socket: null
    }
  },
  methods: {
    next() {
      this.messages = [],
      this.socket.emit('next');
    }
  },
  watch: {
    newMessage(val) {
      this.socket.emit('message', val);
      this.messages.push({class: 'msg-client', text: val});
    }
  },
  created() {
    //this.socket = io('http://localhost:9000');
    this.socket = io('https://talk-to-stangers-server.herokuapp.com');
    this.socket.on('hello', data => {
      console.log(data);
    });
    this.socket.on('message', data => {
      console.log(data);
      this.messages.push(data);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chat {
    width: 100%; height: 100%;
  }
  .top {
    position: fixed;
    top: 0px;
    left: 0px;
    text-align: left;
    width: 100%;
    padding-left: 10px;
    background: #8080ff;
    font-weight: bold;
    line-height: 25px;
    height: 25px;
    padding: 10px;
    color: white;
    box-shadow: 0px 0px 15px rgba(0,0,0,0.75);
  }
  #next-btn {
    position: fixed;
    top: 0px;
    right: 0px;
    color: white;
    text-align: center;
    line-height: 25px;
    height: 25px;
    padding: 10px;
    width: 40px;
  }
  #messages {
    margin-top: 50px;
    margin-bottom: 50px;
    padding-bottom: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 110px);
  }
  .notification {
    opacity: 0.5;
    float: left;
    text-align: left;
    width: 100%;
    margin: 10px 10px 0px 10px;
  }
  .msg-container {
  }
  .msg-stranger, .msg-client {
    padding: 10px;
    background: white;
    margin: 10px 10px 0px 10px;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.25);
    clear: both;
  }
  .msg-stranger {
    float: left;
    text-align: left;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .msg-client {
    text-align: right;
    float: right;
    display: inline-block;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  #input {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    padding: 10px;
    border: none;
    height: 25px;
    font-size: 17px;
    border-top: 1px solid #d0d0d0;
    width: calc(100% - 90px);
  }
  #input-btn {
    position: fixed;
    bottom: 0px;
    right: 0px;
    padding: 10px 15px 10px 15px;
    height: 25px;
    width: 40px;
    font-weight: bold;
    border-top: 1px solid #a0a0a0;
    line-height: 25px;
    color: white;
    background: #6060dd;
  }
</style>
