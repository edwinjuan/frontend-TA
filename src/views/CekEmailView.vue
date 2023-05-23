<template>
    <div></div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: null,
        password: null,
        date: null,
      };
    },
    mounted() {
      this.email = this.$route.params.email;
      this.password = this.$route.params.password;
      this.date = this.$route.params.date;
      if (this.email != null && this.password != null && this.date != null) {
        this.$api.post("/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            if (response.data.user.email_verified_at == null) {
              var token = response.data.access_token;
              this.$api
                .put(
                  "/date/" + response.data.user.users_id,
                  {
                    date: this.date,
                  },
                  {
                    headers: {
                      Authorization: "Bearer " + token,
                    },
                  }
                )
                .then((response) => {
                  alert(response.data.message);
                  this.$router.push('/login');
                })
                .catch((error) => {
                  alert(error.response.data.message);
                });
            } else {
              alert("Link sudah tidak berlaku!");
              this.$router.push('/login');
            }
          }).catch((error) => {
            alert(error.response.data.message);
            });
      } else {
        alert("Not Found")
        // this.$router.push({
        //   name: "Not Found",
        // });
      }
    },
  };
  </script>
  