
 <template>
  <v-app>
    <v-img :src="`https://uajy.ac.id/_nuxt/img/sport-and-cultural.7952c6b.jpeg`" cover>
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="8">
              <v-card class="elevation-12">
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <v-row>
                      <v-col cols="12" md="8">
                        <v-card-text class="mt-12">
                          <h1
                            class="text-center display-2 teal--text text--accent-3"
                          >Log In</h1>
                          
                          <h4 class="text-center mt-4"></h4>
                          <v-form v-model="validLogin" ref="form">
                            <v-text-field
                              label="Email"
                              name="Email"
                              prepend-icon="email"
                              type="text"
                              color="teal accent-3"
                              v-model="emailLogin"
                              required
                              :rules="emailRules"
                            />

                            <v-text-field
                              id="password"
                              label="Password"
                              name="password"
                              prepend-icon="lock"
                              type="password"
                              color="teal accent-3"
                              v-model="passwordLogin"
                              required
                              :rules="passwordRules"
                            />
                          </v-form>
                          <div style="text-align: center;">
                            <button></button>
                          </div>
                        </v-card-text>
                        <div class="text-center mt-3" style="margin-bottom: 20px;">
                          <v-btn rounded color="#16347A" style="color: white;" dark @click="login">Log In</v-btn>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4" class="teal accent-3" style="background-color: #16347A;">
                        <v-card-text class="white--text mt-12">
                          <h1 class="text-center display-1" style="line-height: 1.2; color: white;">Sistem Admin UAJY Dashboard</h1>
                          <h5 style="margin-top: 50px; color: white;"
                            class="text-center"
                          >Belum punya akun?</h5>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn rounded outlined dark @click="step++">SIGN UP</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-row class="fill-height">
                      <v-col cols="12" md="4" class="teal accent-3" style="background-color: #16347A;">
                        <v-card-text class="white--text mt-12">
                          <h1 class="text-center display-1" style="line-height: 1.2; color: white;">Sistem Admin UAJY Dashboard</h1>
                          <h5 style="margin-top: 50px; color: white;"  
                            class="text-center"
                          >Sudah punya akun?</h5>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn rounded outlined dark @click="step--">Log In</v-btn>
                        </div>
                      </v-col>

                      <v-col cols="12" md="8">
                        <v-card-text class="mt-12">
                          <h1 class="text-center display-2 teal--text text--accent-3">Create Account</h1>
                          
                          <h4 class="text-center mt-4">Pastikan Email aktif</h4>
                          <v-form v-model="validRegis" ref="formRegis">
                            <v-text-field
                              label="Nama"
                              name="Name"
                              prepend-icon="person"
                              type="text"
                              color="teal accent-3"
                              v-model="nameRegis"
                              required
                              :rules="nameRegRules"
                            />
                            <v-text-field
                              label="Email"
                              name="Email"
                              prepend-icon="email"
                              type="text"
                              color="teal accent-3"
                              v-model="emailRegis"
                              required
                              :rules="emailRegRules"
                            />
                  
                            <v-text-field
                              id="password"
                              label="Password"
                              name="password"
                              prepend-icon="lock"
                              type="password"
                              color="teal accent-3"
                              v-model="passwordRegis"
                              required
                              :rules="passwordRegRules"
                            />
                          </v-form>
                        </v-card-text>
                        <div class="text-center mt-n5" style="margin-bottom: 20px;">
                          <v-btn rounded color="#16347A" style="color: white;" dark @click="signup">SIGN UP</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-img>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom> {{ error_message }} </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    step: 1,
    load: false,
    validLogin: false,
    emailLogin: '',
    validRegis:'',
    emailRules: [
        (v) => !!v || 'E-mail tidak boleh kosong !',
    ],
    passwordLogin: '',
    passwordRules: [
        (v) => !!v || 'Password tidak boleh kosong !',
    ],
    nameRegis: '',
    nameRegRules: [
        (v) => !!v || 'Nama tidak boleh kosong !',
    ],
    emailRegis: '',
    emailRegRules: [
        (v) => !!v || 'Email tidak boleh kosong !',
    ],
    passwordRegis: '',
    passwordRegRules: [
        (v) => !!v || 'Password tidak boleh kosong !',
    ],
    color: '',
    snackbar: false,
    error_message: '',
  }),
  props: {
    source: String
  },
  methods: {
    login() {
      if(this.$refs.form.validate()){
        this.load = true;
        this.$api.post("/login", {
          email: this.emailLogin,
          password: this.passwordLogin
        })
        .then((response) => {
          if(response.data.user.email_verified_at == null) {
            this.error_message = "Verifikasi Email Terlebih Dahulu !";
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          } else {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            localStorage.setItem("id", response.data.user.users_id)
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("name", response.data.user.name);
            localStorage.setItem("email", response.data.user.email);
            localStorage.setItem("is_admin", response.data.user.is_admin);
            this.clearLogin();
            if (response.data.user.is_admin == 1){
              this.$router.push({
                name: "matkul",
              });
            } else {
              this.$router.push({
                name: "home",
              });
            }
            
          }
        }).catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          localStorage.removeItem("token");
          this.load = false;
        });
      }
    },
    async signup() {
      if(this.$refs.formRegis.validate()) {
        this.load = true;
        this.$api.post("register", {
          name: this.nameRegis,
          email: this.emailRegis,
          password: this.passwordRegis
        })
        .then((response) => {
          alert('Register Berhasil, Silahkan cek Email');
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.clearRegis();
          // this.$router.push({
          //      name: "VerifyEmail",
          // });
          // this.$api.post("/email/verification-notification", {
          //   email: this.emailRegis,
          //   password: this.passwordRegis
          // })
          // .then((response) => {
          //   console.log(response.data);
          //   alert(response.data.message);
          //   this.$router.push({
          //     name: "VerifyEmail",
          //   });
          // }).catch((error2) => {
          //   alert("masuk error 2")
          //   this.error_message = error2.response.data.message;
          //   this.color = "red";
          //   this.snackbar = true;
          // });
          //this.step = 1;
        }).catch((error) => {
          alert('Register Berhasil, Silahkan cek Email!');
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        })
      }
    },
    clearLogin(){
      this.$refs.form.reset();
    },
    clearRegis(){
      this.$refs.formRegis.reset();
    }
  },
};
</script>
