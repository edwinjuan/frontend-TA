<template>
  
    <v-main>
      <v-container>
        <h1>Mata Kuliah</h1>
        <div class="toolBar" style="margin-top: 10px;">
          <v-card class="fill-height fill-width" elevation="4">
            <v-row class="d-flex align-items-center">
            <!-- <v-spacer></v-spacer> -->
                <v-col md="9"></v-col>
                <v-col md="3" class="d-flex justify-center align-center" style="height: 122px;">
                    <v-btn  v-if="admin == 1"
                    class="align-self-center" 
                    style="background-color: #16347A; color: white;" 
                    @click="addHandler" 
                    >Add</v-btn>
                </v-col>
            </v-row>
          </v-card>
        </div>

        <v-card elevation="4" style="margin-top: 10px;">
          <v-table>
            <thead style="background-color: gray;">
              <tr>
                <th class="text-left" style="color: aliceblue;">
                  Kode
                </th>
                <th class="text-left" style="color: aliceblue;">
                  Nama Mata Kuliah
                </th>
                <th class="text-left" style="color: aliceblue;" v-if="admin == 1">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
                <template v-if="dataAvail">
                    <tr
                        v-for="item in matkuls"
                        :key="item.matkul_id"
                    >
                        <td>{{ item.code }}</td>
                        <td>{{ item.matkul_name }}</td>
                        <td v-if="admin == 1">
                            <v-icon size="large" class="mr-2" @click="editHandler(item)"><Icon  icon="material-symbols:edit-document" color="green"/></v-icon>
                            <v-icon size="large" class="mr-2" @click="deleteHandler(item.matkul_id)"><Icon  icon="ic:baseline-delete-forever" color="red"/></v-icon>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td>Data tidak ditemukan</td>
                    </tr>
                </template>
            </tbody>
          </v-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card style="width: 600px">
              <v-card-title class="text-center">
                  <span>{{ formtitle }} Kelas</span>
              </v-card-title>
              <v-card-text>
                  <v-container>
                      <v-text-field v-model="form.code" label="Kode"></v-text-field>
                      <v-text-field v-model="form.matkul_name" label="Nama Mata Kuliah"></v-text-field>
                  </v-container>
              </v-card-text>
              <v-card-action class="text-right">
                  <v-spacer></v-spacer>
                  <v-btn class="ml-5 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="cancel">Cancel</v-btn>
                  <v-btn class="mb-3" style="margin-right: 10px;" color="#ce453d" text @click="save">Save</v-btn>
              </v-card-action>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="500px">
            <v-card style="width: 600px">
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>Anda yakin ingin menghapus kelas ini?</v-card-text>
                <v-card-action class="text-right">
                    <v-btn class="ml-2 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="dialogConfirm = false">Cancel</v-btn>
                    <v-btn class="mb-3" color="#ce453d" style="margin-right: 5px;" text @click="deleteData">Delete</v-btn>
                </v-card-action>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>

      </v-container>
    </v-main>


</template>

<style scoped>
.toolBar {
  height: 100px;
}
.fill-height {
  height: 100%; /* make the card fill the height of its parent */
}

.fill-width {
  width: 100%; /* make the card fill the width of its parent */
}
</style>

<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
		Icon,
	},
    data: () => ({
        admin: localStorage.getItem('is_admin'),
        matkuls: new Array(),
        load: false,
        dataAvail: false,
        color: '',
        snackbar: false,
        error_message: '',
        inputType: 'Tambah',
        dialog: false,
        dialogConfirm: false,
        editID: null,
        deleteID: null,
        form: {
            code: null,
            matkul_name: null,
        },
    }),
    methods: {
        readData() {
            this.$api.get("/matkul", {
                headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.matkuls = response.data.data;
                this.dataAvail = true;
            }).catch((error) => {
                this.error_message = error.response.data.message;
                this.dataAvail = false;
                this.totalPercent = 0;
            })
        },
        addHandler() {
            this.resetForm();
            this.dialog = true;
        },
        resetForm() {
            this.form = {
                code: null,
                matkul_name: null,
            };
        },
        cancel() {
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
        },
        save() {
            if (this.inputType == 'Tambah') {
                this.load = true;
                this.$api.post("/matkul/create", this.form, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = 'green';
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.resetForm();
                }).catch(error => {
                    alert(error.response)
                    this.error_message = error.response.data.message;
                    this.color = 'red';
                    this.snackbar = true;
                    this.load = false;
                    });
            } else {
                this.load = true;
                this.$api.put("/matkul/update/" + this.editID, this.form, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = 'green';
                    this.snackbar = true;
                    this.load = false;
                    this.inputType = "Tambah";
                    this.close();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = 'red';
                    this.snackbar = true;
                    this.load = false;
                    this.inputType = "Tambah";
                    this.close();
                    this.resetForm();
                });
            }
        },
        close() {
            this.dialog = false;
            this.dialogConfirm = false;
            this.readData();
        },
        deleteHandler(id) {
            this.deleteID = id;
            this.dialogConfirm = true;
        },
        deleteData() {
            this.load = true;
            this.$api.delete("/matkul/delete/" + this.deleteID, {
                headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.inputType = "Tambah";
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            })
        },
        editHandler(item) {
            this.inputType = 'Ubah';
            this.editID = item.matkul_id;
            this.form.matkul_name = item.matkul_name;
            this.form.code = item.code;
            this.dialog = true;
        },
    },
    computed: {
        formtitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.readData();
    },
}

</script>