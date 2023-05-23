<template>
    <div>
      <h1>Email Verification</h1>
      <p>Please wait while we verify your email address...</p>
    </div>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>

  </template>
  
  <script>
  export default {
    data: () => ({
        load: false,
        color: '',
        snackbar: false,
        error_message: '',
    }),
    mounted() {
      this.verifyEmail()
    },
    methods: {
      async verifyEmail() {
        this.$api.get("/api/email/verify", { params: this.$route.query } )
        .then((response) => {
          this.error_message = response.data.message;
          this.load = false;
          this.snackbar = true;
          this.$router.push({
            name: "loginView",
          });
        }).catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
      }
    }
  }
  </script>