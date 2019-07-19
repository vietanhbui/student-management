<template>
<v-app id="inspire">
    <toolbar />
    <v-layout fill-height>
        <navigation />
        <v-container>
            <v-card>
                <v-card-title>
                    List student
                    <v-spacer></v-spacer>
                    <v-text-field style="padding: 0; margin: 0" v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                    <v-spacer v-if="admin"></v-spacer>
                    <v-dialog v-if="admin" v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Create student</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text v-show="!edited">
                                <v-form ref="form">
                                    <v-text-field name="email" v-model="email" :rules="rules.email" label="Email"></v-text-field>
                                    <v-text-field name="password" v-model="password" :rules="rules.password" type="password" label="Password"></v-text-field>
                                    <v-text-field name="name" v-model="name" :rules="rules.name" label="Name"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-text v-show="edited">
                                <v-text-field :disabled="edited" v-model="emailEdit" :rules="rules.email" label="Email"></v-text-field>
                                <v-text-field v-model="nameEdit" :rules="rules.name" label="Name"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-data-table :loading="loading" :rows-per-page-items="rowsPerPageItems" :headers="headers" :items="students" :search="search">
                    <template v-slot:items="props">
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.email }}</td>
                        <td>{{ props.item.class.join(', ') }}</td>
                        <td class="justify-center layout px-0">
                            <v-icon small class="mr-2" @click="chatStudent(props.item)">
                                chat
                            </v-icon>
                            <v-icon v-if="admin" small class="mr-2" @click="editStudent(props.item)">
                                edit
                            </v-icon>
                            <v-icon v-if="admin" small @click="deleteStudent(props.item)">
                                delete
                            </v-icon>
                        </td>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
        <v-alert transition="scale-transition" style="position: fixed; bottom: 0; right: 0" :value="message" type="success">
            {{ message }}
        </v-alert>
        <v-alert transition="scale-transition" style="position: fixed; bottom: 0; right: 0" :value="error" type="error">
            {{ error }}
        </v-alert>
    </v-layout>
</v-app>
</template>

<script>
import Toolbar from '../components/Toolbar'
import Navigation from '../components/Navigation'
import {
    getStudents,
    getStudentByAdmin,
    updateStudentByAdmin,
    deleteStudentByAdmin,
    signup
} from '../api/index.api'
import {
    isAuthenticated
} from '../auth/index.auth';

export default {
    name: 'Home',
    components: {
        Toolbar,
        Navigation
    },
    data() {
        return {
            admin: false,
            email: '',
            emailEdit: '',
            name: '',
            nameEdit: '',
            password: '',
            editedIndex: -1,
            search: '',
            error: '',
            message: '',
            loading: true,
            rowsPerPageItems: [10, 20, {
                "text": "$vuetify.dataIterator.rowsPerPageAll",
                "value": -1
            }],
            headers: [{
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Email',
                    sortable: false,
                    value: 'email'
                },
                {
                    text: 'Class',
                    sortable: false,
                    value: 'class'
                },
                {
                    text: '',
                    sortable: false,
                    value: 'button'
                }
            ],
            rules: {
                required: value => !!value || "Required!",
                email: [
                    value => !!value || "Email is required!",
                    value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return pattern.test(value) || "Invalid e-mail.";
                    }
                ],
                name: [value => !!value || "Name is required!"],
                password: [
                    value => !!value || "Password is required!",
                    value => {
                        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                        return (
                            pattern.test(value) ||
                            "At least 8 characters, 1 number, 1 upper and 1 lowercase"
                        );
                    }
                ]
            },
            dialog: false,
            edited: false,
            students: []
        }
    },
    computed: {
        formTitle() {
            return !this.edited ? 'Create student' : 'Edit student'
        },

    },
    mounted() {
        this.admin = isAuthenticated().student.role === 'admin'
        getStudents(isAuthenticated().token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                for (let i = 0; i < data.length; i++) {
                    data[i].class = this.convertClass(data[i].class)
                }
                this.students = data;
                this.loading = false
            }
        })
    },
    watch: {
        dialog() {
            this.$refs.form.reset();
        }
    },
    methods: {
        convertClass(classArray) {
            for (let i = 0; i < classArray.length; i++) {
                classArray[i] = classArray[i].class;
            }
            return classArray;
        },
        chatStudent(item) {
            this.$router.push('/chat/student/' + item._id)
        },
        editStudent(item) {
            this.editedIndex = this.students.indexOf(item);
            this.nameEdit = item.name;
            this.emailEdit = item.email
            this.edited = true;
            this.dialog = true;
        },
        deleteStudent(item) {
            confirm('Are you sure you want to delete this student?') &&
                deleteStudentByAdmin(item._id, isAuthenticated().token).then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.message = data.message;
                        this.students.splice(this.students.indexOf(item), 1);
                        setTimeout(() => {
                            this.message = ''
                        }, 3000)
                    }
                })
        },
        close() {
            this.email = ''
            this.password = ''
            this.name = ''
            this.dialog = false;
            setTimeout(() => {
                this.edited = false
            }, 300)
        },
        save() {
            if (this.edited) {
                updateStudentByAdmin(this.students[this.editedIndex]._id, isAuthenticated().token, {
                    name: this.nameEdit
                }).then(data => {
                    if (data.error) {
                        console.log(data.error)
                        this.error = data.error.message;
                        setTimeout(() => {
                            this.error = ''
                        }, 3000)
                    } else {
                        this.students[this.editedIndex].name = data.name;
                        this.message = 'Edit student successfully!'
                        setTimeout(() => {
                            this.message = ''
                        }, 3000)
                        this.editedIndex = -1;
                    }
                });
                this.close()
            } else {
                if (this.$refs.form.validate()) {
                    signup({
                        email: this.email,
                        name: this.name,
                        password: this.password
                    }).then(data => {
                        if (data.error) {
                            console.log(data.error);
                            this.error = data.error;
                            setTimeout(() => {
                                this.error = ''
                            }, 3000)
                        } else {
                            this.message = data.message;
                            getStudents(isAuthenticated().token).then(data => {
                                this.students = data;
                            })
                            setTimeout(() => {
                                this.message = ''
                            }, 3000)
                            this.close()
                        }
                    })
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
