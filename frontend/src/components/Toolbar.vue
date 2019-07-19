<template>
<v-toolbar dark color="primary">
    <v-btn @click="handleHome" icon>
        <v-icon>home</v-icon>
    </v-btn>
    <v-toolbar-title class="white--text">Student management</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-title class="white--text">{{ name }}</v-toolbar-title>
    <v-menu bottom left>
        <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
                <v-icon>more_vert</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-tile v-for="(item, i) in items" :key="i" @click="handleMoreButton(i)">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Choose class</span>
            </v-card-title>
            <v-card-text>
                <v-select v-model="grade" :items="itemsClass" label="Class" required></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="handleChooseClass">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-toolbar>
</template>

<script>
import {
    isAuthenticated
} from '../auth/index.auth';
import {
    getStudent
} from '../api/index.api';
export default {
    name: "Toolbar",
    data() {
        return {
            items: [{
                    title: "Edit Profile"
                },
                {
                    title: "Class chat"
                },
                {
                    title: "Sign out"
                }
            ],
            itemsClass: [],
            labelChat: '',
            dialog: false,
            grade: '',
        };
    },
    computed: {
        name() {
            return isAuthenticated().student.name;
        }
    },
    methods: {
        handleMoreButton(index) {
            if (index === 2) {
                sessionStorage.removeItem('jwt');
                this.$router.replace('/signin');
            } else if (index === 0) {
                this.$router.push('/student/edit/' + isAuthenticated().student._id);
            } else {
                this.dialog = true;
                getStudent(isAuthenticated().student._id, isAuthenticated().token).then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        for (let i = 0; i < data.class.length; i++) {
                            data.class[i] = data.class[i].class;
                        }
                        this.itemsClass = data.class;
                    }
                })
            }
        },
        handleHome() {
            this.$router.push('/');
        },
        handleChooseClass() {
            this.$router.push('/chat/class/' + this.grade);
        }
    }
};
</script>

<style scoped>

</style>
