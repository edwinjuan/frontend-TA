<template>
  
    <v-app>
      <v-overlay
        :value="drawer"
        z-index="4"
      >
      </v-overlay>
      <v-navigation-drawer
      style="background-color: #16347A;" v-model="drawer" width="256" app clipped hide-overlay>
        <v-list>
          <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg">
            <v-list-item-title style="color: white;" v-text="name"></v-list-item-title>
            <v-list-item-subtitle style="color: white;" v-text="email"></v-list-item-subtitle>
            <template v-slot:append>
              <v-icon style="color: white;" @click.stop="drawer = !drawer">mdi-menu</v-icon>
            </template>
          </v-list-item>
          
        </v-list>

        <v-divider thickness="2"></v-divider>
        

        <v-list nav dense>
          <v-list-item
          no-action
          v-for="item in items"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
          @click="selection = item.title"
          >
            
            <v-list-item-content>
              <v-list-item-title style="color: white;">
                <v-icon><Icon :icon=item.icon color="white"/></v-icon> 
                &nbsp;&nbsp;{{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-toolbar density="compact">
        <v-btn icon style="background-color: #16347A;">
          <v-icon style="color: white;" @click.stop="drawer = !drawer">mdi-menu</v-icon>
        </v-btn>
      </v-toolbar>

      <v-main class="bg-grey-lighten-3 fullheight pa-5" :style="{ 'overflow-y': 'auto' }">
        <router-view></router-view>
      </v-main>


      <v-footer app style="height: 45px">
        <v-row justify="center" no-gutters>
          <v-col class="text-center mt-4" cols="12">
            <strong>Copyright Edwin Juan Sugianto © 2023. All rights reserved.</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  
</template>

<style scoped>
    .fullheight {
        min-height: 100vh !important;
        margin-top: -20px;
    }
</style>


<script>
import { Icon } from '@iconify/vue';

export default {
    data: () => ({
      selection: '',
      drawer: true,
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      isAdmin: false,
      items: [],
      error_message: null,
    }),
    methods: {
      logout() {
        this.$api.get("/logout", {
          headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          localStorage.removeItem('email');
          localStorage.removeItem('name');
          localStorage.removeItem('id');
          localStorage.removeItem('token');
          localStorage.removeItem('is_admin');
          location.reload();
        });
      },
      checkAdmin() {
        if (localStorage.getItem("is_admin") == 1) {
          this.isAdmin = true;
          this.items = [
            { title: "Mata Kuliah", to: "/matkul", icon: "mdi:learn-outline" },
            { title: "CPMK", to: "/cpmk", icon: "fluent-mdl2:learning-tools" },
          ];
        } else {
          this.isAdmin = false;
          this.items = [
            { title: "Kelas", to: "/home", icon: "eos-icons:storage-class-outlined" },
            { title: "Mahasiswa", to: "/students", icon: "mdi:people-group" },
            { title: "Tugas", to: "/assignment", icon: "fluent:learning-app-20-filled" },
            { title: "Nilai Mahasiswa", to: "/grade", icon: "fluent-mdl2:upgrade-analysis" },
            { title: "Mata Kuliah", to: "/matkul", icon: "mdi:learn-outline" },
            { title: "CPMK", to: "/cpmk", icon: "fluent-mdl2:learning-tools" },
          ];
        }
      }
    },
    components: {
      Icon,
    },
    mounted() {
      this.checkAdmin();
    },
  }
  </script>