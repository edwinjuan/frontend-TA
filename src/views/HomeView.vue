/* eslint-disable */


<template>
  
      <v-main>
        <v-container>
          <h1>Kelas Terdaftar</h1>
          <div class="toolBar" style="margin-top: 10px;">
            <v-card height="100%" class="d-flex align-center" elevation="4">
              <v-spacer></v-spacer>
              <v-btn 
                class="align-self-center" 
                style="background-color: #16347A; color: white; margin-right: 40px;" 
                @click="addHandler" 
              >Add</v-btn>
            </v-card>
          </div>

          <v-card elevation="4" style="margin-top: 10px;">
            <v-table>
              <thead style="background-color: gray;">
                <tr>
                  <th class="text-left" style="color: aliceblue;">
                    Tahun
                  </th>
                  <th class="text-left sortable" style="color: aliceblue;" @click="sort('semester')">
                    Semester
                    <v-icon icon="mdi-arrow-up" v-if="sortBy === 'semester' && sortDesc"></v-icon>
                    <v-icon icon="mdi-arrow-down" v-if="sortBy === 'semester' && !sortDesc"></v-icon>
                  </th>
                  <th class="text-left sortable" style="color: aliceblue;" @click="sort('matkul_name')">
                    Mata kuliah
                    <v-icon icon="mdi-arrow-up" v-if="sortBy === 'matkul_name' && sortDesc"></v-icon>
                    <v-icon icon="mdi-arrow-down" v-if="sortBy === 'matkul_name' && !sortDesc"></v-icon>
                  </th>
                  <th class="text-left sortable" style="color: aliceblue;" @click="sort('class_order')">
                    Kelas
                    <v-icon icon="mdi-arrow-up" v-if="sortBy === 'class_order' && sortDesc"></v-icon>
                    <v-icon icon="mdi-arrow-down" v-if="sortBy === 'class_order' && !sortDesc"></v-icon>
                  </th>
                  <th class="text-left" style="color: aliceblue;">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataAvail">
                <tr
                  v-for="item in sortedItems"
                  :key="item.class_id"
                >
                  <td>{{ item.tahun }}</td>
                  <td>{{ item.semester }}</td>
                  <td>{{ item.matkul_name }}</td>
                  <td>{{ item.class_order }}</td>
                  <td>
                    <!-- <v-btn small class="mr-2" @click="editHandler(item)"></v-btn> -->
                    <v-icon size="large" class="mr-2" @click="editHandler(item)"><Icon  icon="material-symbols:edit-document" color="green"/></v-icon>
                    <v-icon size="large" class="mr-2" @click="deleteHandler(item.class_id)"><Icon  icon="ic:baseline-delete-forever" color="red"/></v-icon>
                    <!-- <v-btn small @click="deleteHandler(item.class_id)">delete</v-btn> -->
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
                        <v-select v-if="inputType == 'Tambah'"
                          v-model="matkulSelected"
                          label="Mata Kuliah"
                          :items="matkulsOption"
                        ></v-select>
                        <v-text-field v-model="form.class_order" label="Urutan Kelas"></v-text-field>
                        <v-select
                          v-model="form.semester"
                          label="Semester"
                          :items="['Ganjil', 'Genap']"
                        ></v-select>
                        <v-row>
                          <v-col>
                            <v-text-field v-model.number="form.tahunAwal" type="number" label="Tahun Awal"></v-text-field>
                          </v-col>
                          <v-col>
                            <div class="container">
                              <h1>/</h1>
                            </div>
                          </v-col>
                          <v-col>
                            <v-text-field v-model.number="form.tahunAkhir" type="number" label="Tahun Akhir"></v-text-field>
                          </v-col>
                        </v-row>
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

.container {
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center; /* center vertically */
}

.sortable {
  cursor: pointer;
}
</style>

<script>
import { Icon } from '@iconify/vue';

export default {
  components: {
		Icon,
	},
  data: () => ({
    kelases: new Array(),
    matkuls: new Array(),
    matkulsOption: new Array(),
    matkulSelected: null,
    search: null,
    load: false,
    color: '',
    snackbar: false,
    dataAvail: false,
    error_message: '',
    inputType: 'Tambah',
    dialog: false,
    dialogConfirm: false,
    form: {
      class_order: null,
      semester: null,
      tahunAwal: null,
      tahunAkhir: null,
    },
    header: [
      { text: "MataKuliah", value: "matkul_name", sortable: true },
      { text: "Urutan Kelas", value: "class_order", sortable: true },
      { text: "Semester", value: "semester", sortable: true },
      { text: "Tahun", value: "tahun", sortable: true },
      { text: "Actions", value: "actions", sortable: true },
    ],
    deleteID: '',
    editID: '',
    sortBy: 'class_order',
    sortDesc: false,
  }),
  methods: {
    readData() {
      this.$api.get("/class/show/" + localStorage.getItem("id"), {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.kelases = response.data.data;
        this.dataAvail = true;
      }).catch(error => {
          this.error_message = error.response.data.message;
          this.dataAvail = false;
        });
    },
    deleteHandler(id) {
      this.deleteID = id;
      this.dialogConfirm = true;
    },
    addHandler() {
      this.resetForm();
      this.readMatkul();
      this.inputType = "Tambah";
      this.dialog = true;
    },
    editHandler(item) {
      this.inputType = 'Ubah';
      this.editID = item.class_id;
      this.form.class_order = item.class_order;
      this.form.semester = item.semester;
      var split = item.tahun.split("/");
      this.form.tahunAwal = split[0];
      this.form.tahunAkhir = split[1];
      this.dialog = true;
    },
    deleteData() {
      this.load = true;
      this.$api.delete("/class/delete/" + this.deleteID, {
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
        this.readData();
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;
      })
    },
    save() {
      if (this.inputType == 'Tambah') {
        this.load = true;
        var split = this.matkulSelected.split(" ");
        var code = split[0]
        for (let i=0; i<this.matkuls.length; i++) {
          if (this.matkuls[i].code == code){
            var id = this.matkuls[i].matkul_id;
            break;
          }
        }
        let formInput = {
          matkul_id: id,
          class_order: this.form.class_order,
          semester: this.form.semester,
          tahun: this.form.tahunAwal + "/" + this.form.tahunAkhir
        }
        this.$api.post("/class/create/" + localStorage.getItem('id'), formInput, {
          headers: {
            'Authorization' : 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message = response.data.message;
          this.color = 'green';
          this.snackbar = true;
          this.load = false;
          this.dataAvail = true;
          this.close();
          this.resetForm();
          this.readData();
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
        });
      } else {
        this.load = true;
        let formInput = {
          class_order: this.form.class_order,
          semester: this.form.semester,
          tahun: this.form.tahunAwal + "/" + this.form.tahunAkhir
        }
        this.$api.put("/class/update/" + this.editID, formInput, {
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
    cancel() {
      this.readData();
      this.dialog = false;
      this.dialogConfirm = false;
    },
    resetForm() {
      this.matkulSelected = null;
      this.form = {
        class_order: null,
        semester: null,
        tahunAwal: null,
        tahunAkhir: null,
      };
    },
    readMatkul() {
      this.$api.get("/matkul", {
          headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
          }
      }).then(response => {
          this.matkuls = response.data.data;
          this.move();
      }).catch((error) => {
          this.error_message = error.response.data.message;
      })
    },
    move() {
      this.matkulsOption = [];
      for (let i=0; i<this.matkuls.length; i++) {
        this.matkulsOption.push(this.matkuls[i].code + " - " + this.matkuls[i].matkul_name)
      }
    },
    sort(column) {
      if (this.sortBy === column) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortBy = column;
        this.sortDesc = false;
      }
    },
  },
  computed: {
    formtitle() {
      return this.inputType;
    },
    sortedItems() {
      const sorted = this.kelases.slice().sort((a, b) => {
        const propA = a[this.sortBy];
        const propB = b[this.sortBy];

        if (propA < propB) {
          return this.sortDesc ? 1 : -1;
        } else if (propA > propB) {
          return this.sortDesc ? -1 : 1;
        } else {
          return 0;
        }
      });

      return sorted;
    },
  },
  mounted() {
    this.readData();
  },
}
</script>
