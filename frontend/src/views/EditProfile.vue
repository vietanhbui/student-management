<template>
<v-app id="inspire">
    <toolbar />
    <v-layout fill-height>
        <navigation />
        <v-container fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Edit Profile</v-toolbar-title>
                        </v-toolbar>
                        <v-form @submit.prevent="handleSave" ref="form">
                            <v-card-text>
                                <v-text-field disabled @input="handleInputChange" name="email" label="Email" v-model="email" id="email"></v-text-field>
                                <v-text-field @input="handleInputChange" name="name" :rules="rules.name" label="Name" v-model="name" id="name"></v-text-field>
                                <v-text-field disabled @input="handleInputChange" v-model="grade" type="text" name="grade" label="Class"></v-text-field>
                                <div style="text-align: center">
                                    <v-btn type="submit" color="success">Save</v-btn>
                                </div>
                                <br />
                            </v-card-text>
                        </v-form>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-alert transition="scale-transition" style="position: fixed; bottom: 0; right: 0" :value="error" type="error">
            {{ error }}
        </v-alert>
        <v-alert transition="scale-transition" style="position: fixed; bottom: 0; right: 0" :value="message" type="success">
            {{ message }}
        </v-alert>
    </v-layout>
</v-app>
</template>

<script>
import Toolbar from '../components/Toolbar'
import Navigation from '../components/Navigation'
import {
    getStudent,
    updateStudent
} from "../api/index.api";
import {
    isAuthenticated
} from '../auth/index.auth';

export default {
    name: "EditProfile",
    components: {
        Toolbar,
        Navigation
    },
    data() {
        return {
            email: "",
            name: "",
            grade: [],
            message: '',
            error: '',
            rules: {
                name: [value => !!value || "Name is required!"],
            }
        };
    },
    watch: {
        '$route'(to, from) {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.error = '';
            this.message = '';
            const studentId = this.$route.params.studentId;
            const token = isAuthenticated().token;
            getStudent(studentId, token).then(data => {
                if (data.error) {
                    this.error = data.error;
                } else {
                    this.email = data.email;
                    this.name = data.name;
                    this.grade = this.convertClass(data.class).join(', ')
                }
            })
        },
        convertClass(classArray) {
            for (let i = 0; i < classArray.length; i++) {
                classArray[i] = classArray[i].class;
            }
            return classArray;
        },
        handleSave(e) {
            e.preventDefault();
            if (this.$refs.form.validate()) {
                var data = {
                    name: this.name
                };
                updateStudent(this.$route.params.studentId, isAuthenticated().token, data).then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.message = 'Edit profile successfully'
                    }
                });
            }
        },
        handleInputChange() {
            this.success = false;
            this.error = '';
            this.message = '';
        }
    }
};
</script>

<style scoped>

</style>
