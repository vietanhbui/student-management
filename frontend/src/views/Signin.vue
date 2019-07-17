<template>
    <v-app id="inspire">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Sign in</v-toolbar-title>
                        </v-toolbar>
                        <v-form @submit.prevent="handleSave" ref="form">
                            <v-card-text>
                                <v-text-field @input="handleInputChange" name="email" :rules="rules.email" label="Email" v-model="email" id="email"></v-text-field>
                                <v-text-field @input="handleInputChange" v-model="password" :rules="rules.password" type="password" name="input-10-1" label="Password"></v-text-field>
                                <div style="text-align: center">
                                    <v-btn type="submit" color="success">Sign in</v-btn>
                                </div>
                                <br />
                                <div class="sub-heading" style="color: red; text-align: center">
                                    {{ message }}
                                </div>
                                <div v-if="!success" class="sub-heading" style="text-align: center">
                                    You don't have an account? You can
                                    <router-link to="/signup">create one</router-link>
                                </div>
                            </v-card-text>
                        </v-form>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
import { signin } from "../api/index.api";
import { authenticate } from "../auth/index.auth";

export default {
    name: "Sigin",
    data() {
        return {
            email: "",
            password: "",
            message: '',
            success: false,
            rules: {
                // required: value => !!value || "Required!",
                email: [
                    value => !!value || "Email is required!",
                    value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return pattern.test(value) || "Invalid e-mail.";
                    }
                ],
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
            }
        };
    },
    methods: {
        handleSave(e) {
            e.preventDefault();
            if (this.$refs.form.validate()) {
                signin({
                    email: this.email,
                    password: this.password
                }).then(data => {
                    if (data.error) {
                        this.message = data.error;
                    } else {
                        authenticate(data);
                        this.$router.push('/');
                    }
                });
            }
        },
        handleInputChange() {
            this.success = false;
            this.message = '';
        }
    }
};
</script>

<style scoped>

</style>