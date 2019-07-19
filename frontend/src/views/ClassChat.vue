<template>
<v-app id="inspire">
    <toolbar />
    <v-container fluid>
        <h1>Chat: {{ className }}</h1>
        <v-layout column class="messages">
            <div v-for="(message, index) in messages" :key="index" class="message">
                <div v-if="message.type === 'f'" class="name-f">
                    {{ message.name }}
                </div>
                <div :class="['chat-' + message.type]">
                    {{ message.message }}
                </div>
            </div>
        </v-layout>
    </v-container>
    <div class="input">
        <v-form @submit="sendMsg">
            <v-text-field v-model="msg" label="Type a message" single-line></v-text-field>
        </v-form>
    </div>
</v-app>
</template>

<script>
import Toolbar from '../components/Toolbar'
import io from 'socket.io-client';
import {
    isAuthenticated
} from '../auth/index.auth';

export default {
    name: 'ClassChat',
    components: {
        Toolbar
    },
    data() {
        return {
            msg: '',
            messages: [],
            className: '',
            socket: io('localhost:4040')
        }
    },
    methods: {
        sendMsg(e) {
            e.preventDefault();
            this.socket.emit('SEND_MESSAGE_CLASS', {
                message: this.msg,
                room: this.className,
                name: isAuthenticated().student.name
            })
            let data = {
                message: this.msg,
                name: isAuthenticated().student.name,
                type: 'u'
            }
            this.messages = [...this.messages, data];
            this.msg = '';
        }
    },
    mounted() {
        this.className = this.$route.params.className;
        this.socket.emit('JOIN_CLASS', {
            room: this.className,
            name: isAuthenticated().student.name,
            studentId: isAuthenticated().student._id
        });
        this.socket.on('NEW_STUDENT_JOIN', data => {
            this.messages = [...this.messages, data];
        });
        this.socket.on('MESSAGE_CLASS', data => {
            this.messages = [...this.messages, data];
        });
        this.socket.on('STUDENT_LEAVE', data => {
            this.messages = [...this.messages, data];
        });
    },
    destroyed() {
        this.socket.emit('LEAVE_CLASS', {
            room: this.className,
            name: isAuthenticated().student.name
        });
    }
}
</script>

<style scoped>
.input {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 8vh;
    line-height: 100%;
    padding: 0 100px;
}

.messages {
    height: 74vh;
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 30px 100px;
}

.message {
    margin-bottom: 15px;
}

.name-f {
    color: #90949c;
    font-size: 15px;
}

.chat-joined {
    text-align: center;
}

.chat-u {
    position: relative;
    padding: 9px;
    background: #3578E5;
    color: #fff;
    float: right;
    width: 60%;
    border-radius: .4em;
}

.chat-u:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: #3578E5;
    border-right: 0;
    border-bottom: 0;
    margin-top: -10px;
    margin-right: -20px;
}

.chat-f {
    position: relative;
    padding: 9px;
    background: #e9ebee;
    border-radius: .4em;
    width: 60%;
    margin-bottom: 15px;
}

.chat-f:after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-right-color: #e9ebee;
    border-left: 0;
    border-bottom: 0;
    margin-top: -10px;
    margin-left: -20px;
}
</style>
