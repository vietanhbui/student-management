<template>
    <v-toolbar dark color="primary">
        <v-btn @click="handleHome" icon>
            <v-icon>home</v-icon>
        </v-btn>
        <v-toolbar-title class="white--text">Student management</v-toolbar-title>
        <v-spacer></v-spacer>
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
    </v-toolbar>
</template>

<script>
import { isAuthenticated } from '../auth/index.auth';
export default {
    name: "Toolbar",
    data() {
        return {
            items: [
                { title: "Edit Profile" },
                { title: "Sign out" }
            ]
        };
    },
    methods: {
        handleMoreButton(index) {
            if (index) {
                sessionStorage.removeItem('jwt');
                this.$router.replace('/signin');
            } else {
                this.$router.push('/student/edit/' + isAuthenticated().student._id);
            }
        },
        handleHome() {
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>

</style>