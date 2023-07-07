<template>
  
  <v-main>
    <v-container>
      <h1>Capaian Pembelajaran Mata Kuliah (CPMK)</h1>
      <div class="toolBar" style="margin-top: 10px;">
        <v-card class="fill-height fill-width" elevation="4">  
          <v-row class="d-flex align-items-center">
            <v-col md="5" class="d-flex" style="height: 122px;">
              <v-select
                class="align-self-end"
                style="margin-left: 10px;"
                variant="outlined"
                v-model="matkulID"
                label="Mata Kuliah"
                :items="matkulsOption"
                @update:modelValue="readCPMK"
              ></v-select>
              
            </v-col>
            <v-col md="4"></v-col>
            <v-col md="3" class="d-flex justify-center align-center">
              <v-btn v-if="admin == 1"
                class="align-self-center" 
                style="background-color: #16347A; color: white; width: 100px;" 
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
                No
              </th>
              <th class="text-left" style="color: aliceblue;">
                Deskripsi
              </th>
              <th class="text-left" style="color: aliceblue;">
                Bobot
              </th>
              <th class="text-left" style="color: aliceblue;" v-if="admin == 1">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="dataAvail">
            <tr
              v-for="item in cpmkList"
              :key="item.cpmk_id"
            >
              <td>{{ item.number }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.percentage }} %</td>
              <td v-if="admin == 1">
                <v-icon size="large" class="mr-2" @click="editHandler(item)"><Icon  icon="material-symbols:edit-document" color="green"/></v-icon>
                <v-icon size="large" class="mr-2" @click="deleteHandler(item.cpmk_id)"><Icon  icon="ic:baseline-delete-forever" color="red"/></v-icon>
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
                <span>{{ formtitle }} CPMK</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-select v-if="selectInputAble"
                      v-model="matkulInput"
                      label="Mata Kuliah"
                      :items="matkulsOption"
                      @update:modelValue="readCPMKInput"
                    ></v-select>
                    <v-textarea v-model="form.description" label="Deskripsi"></v-textarea>
                    <v-text-field v-model.number="form.percentage" type="number" label="Bobot" suffix="%"></v-text-field>
                </v-container>
            </v-card-text>
            <v-card-action class="text-right">
                <v-spacer></v-spacer>
                <v-btn class="ml-5 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="close">Cancel</v-btn>
                <v-btn class="mb-3" style="margin-right: 10px;" color="#ce453d" text @click="save">Save</v-btn>
            </v-card-action>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogConfirm" persistent max-width="500px">
          <v-card style="width: 600px">
              <v-card-title>
                  <span class="headline">Warning!</span>
              </v-card-title>
              <v-card-text>Anda yakin ingin menghapus CPMK ini?</v-card-text>
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
    load: false,
    error_message: "",
    snackbar: false,
    inputType: "Tambah",
    dialog: false,
    color: "",
    matkuls: new Array(),
    matkulsOption: new Array(),
    matkulID: null,
    cpmkList: new Array(),
    listForm: new FormData,
    matkulInput: null,
    selectInputAble: true,
    form: {
      description: null,
      percentage: null,
    },
    dataAvail: false,
    deleteID: null,
    editID: null,
    dialogConfirm: false,
    thresholdPercent: 0,
    totalPercent: 0,
  }),
  methods: {
    readDataMatkul() {
      this.$api.get("/matkul", {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.matkuls = response.data.data;
        this.move();
      })
    },
    readCPMK() {
      var split = this.matkulID.split(" ");
      var code = split[0]
      for (let i=0; i<this.matkuls.length; i++) {
        if (this.matkuls[i].code == code){
          var id = this.matkuls[i].matkul_id;
          break;
        }
      }
      this.$api.get("/cpmk/showMatkul/" + id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.cpmkList = response.data.data;
        this.giveNumber();
        this.dataAvail = true;
      }).catch(() => {
        this.dataAvail = false;
      })
    },
    readCPMKInput() {
      var split = this.matkulInput.split(" ");
      var code = split[0]
      for (let i=0; i<this.matkuls.length; i++) {
        if (this.matkuls[i].code == code){
          var id = this.matkuls[i].matkul_id;
          break;
        }
      }
      this.$api.get("/cpmk/showMatkul/" + id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        var cpmk = response.data.data;
        this.thresholdPercent = 0;
        for (let i=0; i<cpmk.length; i++) {
          this.thresholdPercent = this.thresholdPercent + Number(cpmk[i].percentage)
        }
      }).catch(() => {
        this.thresholdPercent = 0;
      })
    },
    move() {
      for (let i=0; i<this.matkuls.length; i++) {
        this.matkulsOption.push(this.matkuls[i].code + " - " + this.matkuls[i].matkul_name)
      }
    },
    giveNumber() {
      let number = {}
      let temp = 1
      for(let i=0; i<this.cpmkList.length; i++) {
        number = {number:temp};
        this.cpmkList[i] = Object.assign(this.cpmkList[i], number);
        temp = temp+1;
      }
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
    },
    addHandler() {
      this.resetForm();
      this.dialog = true;
      this.inputType = "Tambah";
      this.selectInputAble = true;
      this.matkulInput = null;
    },
    editHandler(item) {
      this.inputType = 'Ubah';
      this.selectInputAble = false;
      this.editID = item.cpmk_id;
      this.form.description = item.description;
      this.form.percentage = item.percentage;
      this.totalPercent = 0;
      for (let i=0; i<this.cpmkList.length; i++) {
        if (this.cpmkList[i].cpmk_id != this.editID) {
          this.totalPercent = this.totalPercent + Number(this.cpmkList[i].percentage)
        }
      }
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteID = id;
      this.dialogConfirm = true;
    },
    deleteData() {
      this.load = true;
      this.$api.delete("/cpmk/delete/" + this.deleteID, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = false;
        this.close();
        this.readCPMK();
        this.inputType = "Tambah";
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;
      })
    },
    save() {
      if (this.inputType == 'Tambah') {
        if (this.matkulInput == null) {
          this.snackbar = true;
          this.color = "red";
          this.error_message = "Pilih Mata Kuliah Dahulu";
        } else if (this.thresholdPercent + this.form.percentage > 100) {
          this.snackbar = true;
          this.color = "red";
          this.error_message = "Bobot Total Melebihi 100%";
        } else {
          this.load = true;
          var split = this.matkulInput.split(" ");
          var code = split[0]
          for (let i=0; i<this.matkuls.length; i++) {
            if (this.matkuls[i].code == code){
              var id = this.matkuls[i].matkul_id;
              break;
            }
          }
          this.$api.post("/cpmk/create/" + id, this.form, {
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
            if (this.matkulID != null) {
              this.readCPMK();
            }
          }).catch(error => {
            this.error_message = error.response.data.message;
            this.color = 'red';
            this.snackbar = true;
            this.load = false;
          });
        }
      } else {
        if (Number(this.form.percentage) + this.totalPercent > 100) {
          this.snackbar = true;
          this.color = "red";
          this.error_message = "Bobot Total Melebihi 100%";
        } else {
          this.load = false;
          this.$api.put("cpmk/update/" + this.editID, this.form, {
            headers: {
              'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
          }).then(response => {
            this.error_message = response.data.message;
            this.color = 'green';
            this.snackbar = true;
            this.load = false;
            this.inputType = "Tambah";
            this.selectInputAble = true;
            this.close();
            this.resetForm();
            this.readCPMK();
          }).catch(error => {
            this.error_message = error.response.data.message;
            this.color = 'red';
            this.snackbar = true;
            this.load = false;
            this.inputType = "Tambah";
            this.selectInputAble = true;
            this.close();
            this.resetForm();
            this.readCPMK();
          });
        }
      }
    },
    resetForm() {
      this.form = {
        description: null,
        percentage: null,
      };
    },
  },
  computed: {
    formtitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readDataMatkul();
  },

}
</script>