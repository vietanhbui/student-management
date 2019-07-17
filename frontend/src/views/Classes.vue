<template>
<v-app id="inspire">
    <toolbar />
    <v-layout fill-height>
        <navigation />
        <v-container>
            <v-card>
                <v-card-title>
                    List class
                    <v-spacer></v-spacer>
                    <v-text-field style="padding: 0; margin: 0" v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                    <v-spacer v-if="admin"></v-spacer>
                    <v-dialog v-if="admin" v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Create class</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text v-show="!edited">
                                <v-form @submit.prevent="save" ref="form">
                                    <v-text-field name="grade" v-model="grade" :rules="rules.grade" label="Class"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-text v-show="edited">
                                <v-text-field v-model="gradeEdit" :rules="rules.grade" label="Class"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-data-table :loading="loading" :rows-per-page-items="rowsPerPageItems" :headers="headers" :items="classes" :search="search">
                    <template v-slot:items="props">
                        <td>{{ props.item.class }}</td>
                        <td v-if="admin" class="justify-center layout px-0">
                            <v-icon small class="mr-2" @click="detailsClass(props.item)">
                                format_list_bulleted
                            </v-icon>
                            <v-icon small class="mr-2" @click="editClass(props.item)">
                                edit
                            </v-icon>
                            <v-icon small @click="deleteClass(props.item)">
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
    createClassByAdmin,
    getClasses,
    deleteClassByAdmin,
    updateClassByAdmin
} from '../api/index.api';

export default {
    name: 'Classes',
    components: {
        Toolbar,
        Navigation
    },
    data() {
        return {
            admin: false,
            grade: '',
            gradeEdit: '',
            editedIndex: -1,
            loading: true,
            search: '',
            error: '',
            message: '',
            rowsPerPageItems: [10, 20, {
                "text": "$vuetify.dataIterator.rowsPerPageAll",
                "value": -1
            }],
            rules: {
                grade: [value => !!value || "Class is required!"]
            },
            dialog: false,
            edited: false,
            classes: []
        }
    },
    computed: {
        formTitle() {
            return !this.edited ? 'Create class' : 'Edit class'
        },
        headers() {
            return this.admin ? [{
                    text: 'Class',
                    value: 'class'
                },
                {
                    text: '',
                    sortable: false,
                    value: 'button'
                }
            ] : [{
                text: 'Class',
                sortable: false,
                value: 'class'
            }]
        }
    },
    mounted() {
        this.admin = isAuthenticated().student.role === 'admin'
        getClasses(isAuthenticated().token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.classes = data;
                this.loading = false;
            }
        })
    },
    watch: {
        dialog() {
            this.$refs.form.reset();
        }
    },
    methods: {
        detailsClass(item) {
            this.$router.push({
                name: 'ClassDetails',
                params: {
                    classId: item._id,
                }
            })
        },
        editClass(item) {
            this.editedIndex = this.classes.indexOf(item);
            this.gradeEdit = item.class;
            this.edited = true;
            this.dialog = true;
        },
        deleteClass(item) {
            confirm('Are you sure you want to delete this class?') &&
                deleteClassByAdmin(item._id, isAuthenticated().token).then(data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.message = data.message;
                        this.classes.splice(this.classes.indexOf(item), 1);
                        setTimeout(() => {
                            this.message = ''
                        }, 3000)
                    }
                })
        },
        close() {
            this.grade = ''
            this.dialog = false;
            setTimeout(() => {
                this.edited = false
            }, 300)
        },
        save() {
            if (this.edited) {
                if (this.gradeEdit) {
                    updateClassByAdmin(this.classes[this.editedIndex]._id, isAuthenticated().token, {
                        class: this.gradeEdit
                    }).then(data => {
                        if (data.error) {
                            console.log(data.error)
                            this.error = data.error.message;
                            setTimeout(() => {
                                this.error = ''
                            }, 3000)
                        } else {
                            this.classes[this.editedIndex].class = data.class;
                            this.message = 'Edit student successfully!'
                            setTimeout(() => {
                                this.message = ''
                            }, 3000)
                            this.editedIndex = -1;
                        }
                    });
                    this.close()
                }
            } else {
                if (this.$refs.form.validate()) {
                    createClassByAdmin(isAuthenticated().token, {
                        class: this.grade,
                    }).then(data => {
                        if (data.error) {
                            this.error = data.error;
                            setTimeout(() => {
                                this.error = ''
                            }, 3000)
                        } else {
                            this.message = data.message;
                            getClasses(isAuthenticated().token).then(data => {
                                this.classes = data;
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
