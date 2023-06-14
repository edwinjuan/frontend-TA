<template>
  
  <v-main>
    <v-container>
      <h1>Mahasiswa</h1>
      <div class="toolBar" style="margin-top: 10px;">
        <v-card class="fill-height fill-width" elevation="4">  
          <v-row class="d-flex align-items-center">
            <v-col md="5" class="d-flex" style="height: 122px;">
              <v-select
              style="margin-left: 13px;"
                class="align-self-end"
                variant="outlined"
                v-model="classID"
                label="Kelas"
                :items="classesOption"
                @update:modelValue="readStudents"
              ></v-select>
            </v-col>
            <v-col md="2"></v-col>
            <v-col md="1" class="d-flex justify-center align-center" v-if="dataAvail">
              <v-btn
                class="align-self-center" 
                style="background-color: #16347A; color: white;" 
                @click="resetHandler" 
              >Reset</v-btn>
            </v-col>
            <v-col md="1" v-else>
            </v-col>
            <v-col md="2" class="d-flex justify-center align-center">
              <v-btn 
                class="align-self-center" 
                style="background-color: #16347A; color: white;" 
                @click="uploadHandler" 
              >Upload Excel</v-btn>
            </v-col>
            <v-col md="2" class="d-flex justify-center align-center">
              <v-btn 
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
                NPM
              </th>
              <th class="text-left" style="color: aliceblue;">
                Name
              </th>
              <th class="text-left" style="color: aliceblue;">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="dataAvail">
            <tr
              v-for="item in studentsList.slice(startIndex, endIndex)"
              :key="item.class_mahasiswa_id"
            >
              <td>{{ item.npm }}</td>
              <td>{{ item.name }}</td>
              <td>
                <v-icon size="large" class="mr-2" @click="deleteHandler(item.class_mahasiswa_id)"><Icon  icon="ic:baseline-delete-forever" color="red"/></v-icon>
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
        <v-pagination v-model="page" :length="numPages"></v-pagination>
      </v-card>

      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card style="width: 600px">
            <v-card-title class="text-center">
                <span>{{ formtitle }} List Mahasiswa</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                  <v-select
                    v-model="classIDInput"
                    label="Kelas"
                    :items="classesOption"
                  ></v-select>
                    <v-text-field v-model="form.npm" label="NPM"></v-text-field>
                    <v-text-field v-model="form.name" label="Name"></v-text-field>
                </v-container>
            </v-card-text>
            <v-card-action class="text-right">
                <v-spacer></v-spacer>
                <v-btn class="ml-5 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="close">Cancel</v-btn>
                <v-btn class="mb-3" style="margin-right: 10px;" color="#ce453d" text @click="save">Save</v-btn>
            </v-card-action>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogUpload" persistent max-width="500px">
        <v-card style="width: 600px">
            <v-card-title class="text-center">
                <span>Upload File Absen</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                  <v-select
                    v-model="classIDInput"
                    label="Kelas"
                    :items="classesOption"
                  ></v-select>
                  <v-file-input
                    enctype="multipart/form-data"
                    :rules="rules"
                    v-model=" file"
                    accept=".xlsx, .xls"
                    placeholder="Pick a File"
                    prepend-icon="mdi-file"
                    label="Upload Excel File"
                  ></v-file-input>
                </v-container>
            </v-card-text>
            <v-card-action class="text-right">
                <v-spacer></v-spacer>
                <v-btn class="ml-5 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="close">Cancel</v-btn>
                <v-btn class="mb-3" style="margin-right: 10px;" color="#ce453d" text @click="saveUploaded">Save</v-btn>
            </v-card-action>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogConfirm" persistent max-width="500px">
          <v-card style="width: 600px">
              <v-card-title>
                  <span class="headline">Warning!</span>
              </v-card-title>
              <v-card-text>Anda yakin ingin menghapus Students ini?</v-card-text>
              <v-card-action class="text-right">
                  <v-btn class="ml-2 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="dialogConfirm = false">Cancel</v-btn>
                  <v-btn class="mb-3" color="#ce453d" style="margin-right: 5px;" text @click="deleteData">Delete</v-btn>
              </v-card-action>
          </v-card>
      </v-dialog>

      <v-dialog v-model="dialogReset" persistent max-width="500px">
          <v-card style="width: 600px">
              <v-card-title>
                  <span class="headline">Warning!</span>
              </v-card-title>
              <v-card-text>Anda yakin ingin menghapus semua Students dari kelas?</v-card-text>
              <v-card-action class="text-right">
                  <v-btn class="ml-2 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="dialogReset = false">Cancel</v-btn>
                  <v-btn class="mb-3" color="#ce453d" style="margin-right: 5px;" text @click="resetData">Delete</v-btn>
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
    load: false,
    error_message: "",
    snackbar: false,
    inputType: "Tambah",
    dialog: false,
    dialogUpload: false,
    dialogReset: false,
    color: "",
    classes: new Array(),
    classesOption: new Array(),
    classID: null,
    classIDInput: null,
    studentsList: new Array(),
    dataAvail: false,
    dialogConfirm: false,
    form: {
      npm: null,
      name: null,
    },
    file: null,
    deleteID: null,
    editID: null,
    page: 1,
    itemsPerPage: 7,
  }),
  methods: {
    readDataClass() {
      this.$api.get("/class/show/" + localStorage.getItem("id"), {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.classes = response.data.data;
        this.move();
      })
    },
    move() {
      for (let i=0; i<this.classes.length; i++) {
        this.classesOption.push(this.classes[i].code + " - " + this.classes[i].matkul_name + " - " + this.classes[i].class_order)
      }
    },
    readStudents() {
      var split = this.classID.split("-");
      var code = split[0].trim();
      var class_order = split[2].trim();
      this.$api.get("/ClassMahasiswa/showOnClassCode/" + code + "/" + class_order, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.studentsList = response.data.data;
        this.dataAvail = true;
        this.page = 1;
        this.countPercent();
      }).catch((error) => {
        this.error_message = error.response.data.message;
        this.dataAvail = false;
        this.totalPercent = 0;
      })
    },
    deleteHandler(id) {
      this.deleteID = id;
      this.dialogConfirm = true;
    },
    deleteData() {
      this.load = true;
      this.$api.delete("/ClassMahasiswa/delete/" + this.deleteID, {
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
        this.readStudents();
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;
      })
    },
    resetData() {
      this.load = true;
      var split = this.classID.split("-");
      var code = split[0].trim();
      var class_order = split[2].trim();
      this.$api.delete("/ClassMahasiswa/deleteClass/" + code + "/" + class_order, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = false;
        this.close();
        this.dialogReset = false;
        this.inputType = "Tambah";
        this.refreshTable();
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;
        this.dialogReset = false;
      })
    },
    addHandler() {
      this.resetForm();
      this.dialog = true;
      this.inputType = "Tambah";
    },
    uploadHandler() {
      this.file = null;
      this.dialogUpload = true;
      this.classIDInput = null;
    },
    resetHandler() {
      if (this.classID == null) {
        // Jika kelas belum dipilih
        this.snackbar = true;
        this.color = "red";
        this.error_message = "Choose Class First";
      } else {
        this.dialogReset = true;
      }
    },
    save() {
      if (this.classIDInput == null) {
        this.snackbar = true;
        this.color = "red";
        this.error_message = "Choose Class First";
      } else {
        this.load = true;
        var split = this.classIDInput.split("-");
        var code = split[0].trim();
        var class_order = split[2].trim();
        this.$api.post("/ClassMahasiswa/createCode/" + code + "/" + class_order, this.form, {
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
          this.refreshTable();
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
        });
      }
    },
    async saveUploaded() {
      if (this.classIDInput == null) {
        // Jika kelas belum dipilih
        this.snackbar = true;
        this.color = "red";
        this.error_message = "Choose Class First";
      } else {
        this.load = true;
        var split = this.classIDInput.split("-");
        var code = split[0].trim();
        var class_order = split[2].trim();
        const formData = new FormData();
        formData.append("file", this.file[0]);
        //alert(formData.file)
        this.$api.post("/ClassMahasiswa/createList/" + code + "/" + class_order, formData, {
          headers: {
            'Authorization' : 'Bearer ' + localStorage.getItem('token'),
            "Content-Type": "multipart/form-data"
          }
        }).then(response => {
          this.error_message = response.data.message;
          this.color = 'green';
          this.snackbar = true;
          this.load = false;
          this.dialogUpload = false;
          this.close();
          this.refreshTable();
        }).catch(error => {
          alert('masuk sini')
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
        });
      }
    },
    close() {
      this.dialogUpload = false;
      this.dialog = false;
      this.dialogConfirm = false;
    },
    resetForm() {
      this.classIDInput = null;
      this.form = {
        npm: null,
        name: null,
      };
    },
    refreshTable() {
      if (this.classID != null) {
        this.readStudents();
      }
    },

  },
  computed: {
    formtitle() {
      return this.inputType;
    },
    numPages() {
      if (this.dataAvail == true) {
        return Math.ceil(this.studentsList.length / this.itemsPerPage);
      } else {
        return 0;
      }
      
    },
    startIndex() {
      return (this.page - 1) * this.itemsPerPage;
    },
    endIndex() {
      return this.startIndex + this.itemsPerPage;
    },
  },
  mounted() {
    this.readDataClass();
  },
}
</script>