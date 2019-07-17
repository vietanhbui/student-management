<template>
<v-navigation-drawer v-if="admin" permanent>
    <v-toolbar flat class="transparent">
        <v-list class="pa-0">
            <v-list-tile avatar>
                <v-list-tile-avatar>
                    <v-icon>gavel</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>Admin</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-toolbar>
    <v-list three-line class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="(item, index) in items" :key="item.title" @click="handleNavigation(index)">
            <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</v-navigation-drawer>
</template>

<script>
import {
    isAuthenticated
} from '../auth/index.auth';
export default {
    name: 'Navigation',
    data() {
        return {
            admin: false,
            items: [{
                    title: 'List class',
                    icon: 'dashboard',
                    subtitle: "Show/create/edit/delete class, show/add/remove student in class"
                },
                {
                    title: 'List student',
                    icon: 'account_box',
                    subtitle: "Show/create/edit/delete student"
                }
            ]
        }
    },
    mounted() {
        if (isAuthenticated().student.role === 'admin') {
            this.admin = true;
        }
    },
    methods: {
        handleNavigation(index) {
            if (index) {
                this.$router.push('/');
            } else {
                this.$router.push('/classes');
            }
        }
    }
}
</script>

<style scoped>

</style>
