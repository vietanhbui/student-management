<template>
<v-app id="inspire">
    <toolbar />
    <v-layout fill-height>
        <navigation />
        <v-container>
            <v-card>
                <v-card-title>
                    List student in class {{ className }}
                    <v-spacer></v-spacer>
                    <v-text-field style="padding: 0; margin: 0" v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                    <v-spacer v-if="admin"></v-spacer>
                    <v-dialog v-if="admin" v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Add student</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Add student in class</span>
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="form">
                                    <v-text-field name="email" v-model="email" :rules="rules.email" label="Email"></v-text-field>
                                </v-form>
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
                        <td v-if="admin" class="justify-center layout px-0">
                            <v-icon small @click="deleteStudent(props.item)">
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
    isAuthenticated
} from '../auth/index.auth';
import {
    getStudentsInClass,
    deleteStudentInClass,
    addStudentInClass,
    getClass
} from '../api/index.api'

export default {
    name: 'ClassDetails',
    components: {
        Toolbar,
        Navigation
    },
    data() {
        return {
            admin: false,
            loading: true,
            email: '',
            selectedIndex: -1,
            className: '',
            search: '',
            error: '',
            message: '',
            rowsPerPageItems: [10, 20, {
                "text": "$vuetify.dataIterator.rowsPerPageAll",
                "value": -1
            }],
            rules: {
                email: [
                    value => !!value || "Email is required!",
                    value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return pattern.test(value) || "Invalid e-mail.";
                    }
                ]
            },
            dialog: false,
            students: []
        }
    },
    computed: {
        headers() {
            return this.admin ? [{
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
            ] : [{
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
                }
            ]
        }
    },
    mounted() {
        this.admin = isAuthenticated().student.role === 'admin'
        getStudentsInClass(isAuthenticated().token, this.$route.params.classId).then(data => {
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
        getClass(isAuthenticated().token, this.$route.params.classId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.className = data.class
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
        deleteStudent(item) {
            confirm('Are you sure you want to remove this student?') &&
                deleteStudentInClass(isAuthenticated().token, this.$route.params.classId, {
                    email: item.email
                }).then(data => {
                    if (data.error) {
                        this.error = data.error;
                        setTimeout(() => {
                            this.error = ''
                        }, 3000)
                    } else {
                        this.message = 'Remove student in this class successfully!'
                        this.students.splice(this.students.indexOf(item), 1);
                        setTimeout(() => {
                            this.message = ''
                        }, 3000)
                    }
                })
        },
        close() {
            this.email = ''
            this.dialog = false;
        },
        save() {
            if (this.$refs.form.validate()) {
                addStudentInClass(isAuthenticated().token, this.$route.params.classId, {
                    email: this.email
                }).then(data => {
                    if (data.error) {
                        this.error = data.error;
                        setTimeout(() => {
                            this.error = ''
                        }, 3000)
                    } else {
                        console.log(data);
                        data.class = this.convertClass(data.class);
                        this.students.push(data);
                        this.message = 'Add student in this class successfully!'
                        setTimeout(() => {
                            this.message = ''
                        }, 3000)
                        this.close();
                    }
                })
            }
        }
    }
}
</script>

<style scoped>

</style>
