<template>
<v-app id="inspire">
    <toolbar />
    <v-container fluid>
        <h1>Chat: {{ receiverName }}</h1>
        <v-layout column class="messages">
            <div v-for="(message, index) in messages" :key="index" class="message">
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
import io from 'socket.io-client';
import Toolbar from '../components/Toolbar';
import {
    isAuthenticated
} from '../auth/index.auth';
import {
    getStudent
} from '../api/index.api';

export default {
    name: 'PrivateChat',
    components: {
        Toolbar,
    },
    data() {
        return {
            msg: '',
            messages: '',
            receiverId: '',
            receiverName: '',
            socket: io('localhost:4040')
        }
    },
    methods: {
        sendMsg(e) {
            e.preventDefault();
            this.socket.emit('PRIVATE_MESSAGE', {
                message: this.msg,
                receiver: this.receiverId,
                sender: isAuthenticated().student._id
            })
            let data = {
                message: this.msg,
                name: isAuthenticated().student.name,
                type: 'u'
            }
            this.messages = [...this.messages, data];
            this.msg = ''
        }
    },
    mounted() {
        this.receiverId = this.$route.params.studentId;
        getStudent(this.receiverId, isAuthenticated().token).then(data => {
            this.receiverName = data.name;
        })
        this.socket.emit('JOIN_PRIVATE', {
            name: isAuthenticated().student.name,
            sender: isAuthenticated().student._id,
            receiver: this.receiverId
        });
        this.socket.on('PERSONAL', data => {
            if (data.sender == this.receiverId) {
                this.messages = [...this.messages, data];
            }
            console.log(this.messages);
        });
    },
    destroyed() {
        this.socket.emit('LEAVE_PRIVATE', {
            sender: isAuthenticated().student._id,
            receiver: this.receiverId,
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
