<template>
  
  <v-main>
    <v-container>
      <h1>Tugas</h1>
      <div class="toolBar" style="margin-top: 10px;">
        <v-card class="fill-height fill-width" elevation="4">  
          <v-row class="d-flex align-items-center">
            <v-col md="4" class="d-flex" style="height: 122px;">
              <v-select
                class="align-self-end"
                variant="outlined"
                style="margin-left: 10px;"
                v-model="classID"
                label="Kelas"
                :items="classesOption"
                @update:modelValue="readCPMK"
              ></v-select>
              
            </v-col>
            <v-col md="5"></v-col>
            <v-col md="3" class="d-flex justify-center align-center">
              <v-btn
                class="align-self-center" 
                style="background-color: #16347A; color: white;" 
                @click="addHandler" 
              >Tambah Assignment</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <v-card elevation="4" style="margin-top: 10px;">
        <v-table>
          <thead style="background-color: gray;">
            <tr>
              <th class="text-left" style="color: aliceblue;">
                Deskripsi
              </th>
              <th class="text-left" style="color: aliceblue;">
                CPMK
              </th>
              <th class="text-left" style="color: aliceblue;">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="dataAvail">
            <tr
              v-for="item in assignmentList"
              :key="item.assignment_id"
            >
              <td>{{ item.description }}</td>
              <td>{{ item.cpmkShow }}</td>
              <td>
                <v-icon size="large" class="mr-2" @click="editHandler(item)"><Icon  icon="material-symbols:edit-document" color="green"/></v-icon>
                <v-icon size="large" class="mr-2" @click="deleteHandler(item.assignment_id)"><Icon  icon="ic:baseline-delete-forever" color="red"/></v-icon>
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

      <!-- <div class="toolBar2" style="margin-top: 10px;" >
        <v-card style="height: 60px;" class="d-flex align-center">  
          <h3 
          class="align-self-center" 
          style="font-size: medium; margin-left: 15px;"
          >Total Percentage: <u style="font-size: x-large;">{{ this.totalPercent }}</u> / 100</h3>
        </v-card>
      </div> -->
      

      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card style="width: 600px">
            <v-card-title class="text-center">
                <span>{{ formtitle }} Tugas</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-select
                      v-model="classInput"
                      label="Mata Kuliah"
                      :items="classesOption"
                      @update:modelValue="readCPMKInput"
                    ></v-select>
                    <v-card elevation="2" style="margin-bottom: 20px;">
                      <v-card-title>CPMK:</v-card-title>
                      <v-card-text v-if="checkboxItems.length == 0">Silahkan pilih Mata Kuliah dahulu</v-card-text>
                      <div v-for="(item, index) in checkboxItems" :key="index">
                        <v-checkbox v-model="selectedCheckbox" :label="item.label" :value="item.value"></v-checkbox>
                      </div>
                    </v-card>
                    <v-textarea v-model="form.description" label="Description"></v-textarea>
                </v-container>
            </v-card-text>
            <v-card-action class="text-right">
                <v-spacer></v-spacer>
                <v-btn class="ml-5 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="close">Cancel</v-btn>
                <v-btn class="mb-3" style="margin-right: 10px;" color="#ce453d" text @click="save">Save</v-btn>
            </v-card-action>
        </v-card>
      </v-dialog>

       <!-- <v-dialog v-model="dialogWeight" persistent max-width="500px">
        <v-card style="width: 600px">
            <v-card-title class="text-center">
                <span>Bobot per-CPMK</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-text-field v-model.number="form.percentage" type="number" suffix="%" label="Percentage" disabled></v-text-field>
                    <div v-for="(item, index) in cpmk_percentage_list" :key="index">
                        <v-text-field v-model.number="item.value" type="number" suffix="%" :label="item.label"></v-text-field>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-action class="text-right">
                <v-spacer></v-spacer>
                <v-btn class="ml-5 mb-3" style="margin-right: 5px;" color="#ce453d" text @click="close">Cancel</v-btn>
                <v-btn class="mb-3" style="margin-right: 10px;" color="#ce453d" text @click="save">Save</v-btn>
            </v-card-action>
        </v-card>
      </v-dialog> -->

      <v-dialog v-model="dialogEdit" persistent max-width="500px">
        <v-card style="width: 600px">
            <v-card-title class="text-center">
                <span>{{ formtitle }} Assignment</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-textarea v-model="form.description" label="Deskripsi"></v-textarea>
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
              <v-card-text>Anda yakin ingin menghapus Tugas ini?</v-card-text>
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
    dialogEdit: false,
    dialogConfirm: false,
    dialogWeight: false,
    color: "",
    totalPercent: 0,
    deleteID: null,
    editID: null,
    dataAvail: false,
    classID: null,
    matkul_calculate_id: null,
    classInput: null,
    classes: new Array(),
    classesOption: new Array(),
    cpmkID: null,
    cpmk: new Array(),
    cpmkInput: new Array(),
    cpmkOption: new Array(),
    cpmkDisabled: true,
    assignmentList: new Array(),
    checkboxItems: new Array(),
    selectedCheckbox: new Array(),
    cpmk_percentage_list: new Array(),
    cpmk_percent_form: new Array(),
    cpmk_percent_edit: new Array(),
    form: {
      description: null,
      cpmk_list: null,
    },

  }),
  methods: {
    readDataClass() {
      this.$api.get("/class/show/" + localStorage.getItem("id"), {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.cpmkID = null;
        this.assignmentID = null;
        this.classes = response.data.data;
        this.move();
      })
    },
    move() {
      for (let i=0; i<this.classes.length; i++) {
        let text = this.classes[i].code + " - " + this.classes[i].matkul_name + " - " + this.classes[i].class_order;
        let id = i;
        let temp = { value: id, title: text };
        this.classesOption.push(temp);
      }
    },
    readCPMK() {
      this.dataAvail = false;
      this.totalPercent = 0;
      this.cpmkID = null;
      this.$api.get("/cpmk/showMatkul/" + this.classes[this.classID].matkul_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.cpmkID = null;
        this.cpmk = response.data.data;
        this.giveNumber();
        this.readAssignment();
        //this.moveCPMK();
      }).catch(() => {
        this.cpmkOption = [];
        this.cpmkID = null;
      })
    },
    giveNumber() {
      let number = {}
      let temp = 1
      for(let i=0; i<this.cpmk.length; i++) {
        number = {number:temp};
        this.cpmk[i] = Object.assign(this.cpmk[i], number);
        temp = temp+1;
      }
    },
    readAssignment() {
      if (this.classID != null) {
        this.$api.get("/assignment/class/" + this.classes[this.classID].class_id, {
          headers: {
            'Authorization' : 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.assignmentList = response.data.data;
          //this.moveCPMK();
          this.dataAvail = true;
          this.getCPMKName();
        }).catch(() => {
          this.cpmkOption = [];
          this.cpmkID = null;
          this.dataAvail = false;
        })
      }
    },
    getCPMKName() {
      // membari list cpmk pada setiap data assignment di table
      let cpmkShow = {};
      for(let i=0; i<this.assignmentList.length; i++) {
        let ans = "";
        let string1 = this.assignmentList[i].cpmk_list.replace('{','');
        let string2 = string1.replace('}', '');
        let listStr = string2.split(',');
        for (let x=0; x<listStr.length; x++) {
          for (let y=0; y<this.cpmk.length; y++) {
            if (+listStr[x] == this.cpmk[y].cpmk_id) {
              ans = ans.concat(", ", "CPMK "+this.cpmk[y].number)
            }
          }
        }
        ans = ans.slice(2);
        cpmkShow = {cpmkShow:ans};
        this.assignmentList[i] = Object.assign(this.assignmentList[i], cpmkShow);
      }
    },
    // moveCPMK() {
    //   this.cpmkOption = [];
    //   for (let i=0; i<this.cpmk.length; i++) {
    //     this.cpmkOption.push(this.cpmk[i].cpmk_id + " - " + this.cpmk[i].description)
    //   }
    // },
    // readAssignment() {
    //   var split = this.cpmkID.split(" ");
    //   var id = split[0]
    //   this.$api.get("/assignment/show/" + id, {
    //     headers: {
    //       'Authorization' : 'Bearer ' + localStorage.getItem('token')
    //     }
    //   }).then(response => {
    //     this.assignmentList = response.data.data;
    //     this.dataAvail = true;
    //     this.countPercent();
    //   }).catch((error) => {
    //     this.error_message = error.response.data.message;
    //     this.dataAvail = false;
    //     this.totalPercent = 0;
    //   })
    // },
    countPercent() {
      this.totalPercent = 0;
      for (let i=0; i<this.assignmentList.length; i++) {
        this.totalPercent = Number(this.totalPercent) + Number(this.assignmentList[i].percentage);
      }
    },
    addHandler() {
      this.resetForm();
      this.dialog = true;
      this.classInput = null;
      this.inputType = "Tambah";
    },
    editHandler(item) {
      this.inputType = 'Ubah';
      // masukin data ke form
      this.editID = item.assignment_id;
      this.form.description = item.description;
      // // mengambil data list
      // this.cpmk_percent_edit = [];
      // // convert data bobot cpmk
      // let string1 = item.cpmk_percent_list.replace('{','');
      // let string2 = string1.replace('}', '');
      // let list = string2.split(',');
      // // convert data list cpmk
      // string1 = item.cpmk_list.replace('{','');
      // string2 = string1.replace('}', '');
      // let listCPMK = string2.split(',');
      // // masukin value bobot dan nomor cpmk untuk ditampilin
      // for (let i=0; i<list.length; i++) {
      //   for (let j=0; j<this.cpmk.length; j++) {
      //     if (+listCPMK[i] == this.cpmk[j].cpmk_id) {
      //       this.cpmk_percent_edit.push({
      //         label: this.cpmk[j].number,
      //         value: +list[i]
      //       });
      //     }
      //   }
      //}
      this.dialogEdit = true;
    },
    deleteHandler(id) {
      this.deleteID = id;
      this.dialogConfirm = true;
    },
    deleteData() {
      this.load = true;
      this.$api.delete("/assignment/delete/" + this.deleteID, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = false;
        this.close();
        this.readAssignment();
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
        if (this.selectedCheckbox.length == 0) {
          this.error_message = "Silahkan isi CPMK terlebih dulu";
          this.color = 'red';
          this.snackbar = true;
        } else {
          this.load = true;
          //check jika jumlah weight sudah sesuai dan pindahkan ke list
          // let total = 0;
          // this.cpmk_percent_form = [];
          // for (let i=0; i<this.cpmk_percentage_list.length; i++) {
          //   if (this.cpmk_percentage_list[i].value != null) {
          //     total = total + this.cpmk_percentage_list[i].value;
          //     this.cpmk_percent_form.push(this.cpmk_percentage_list[i].value);
          //   } else {
          //     this.cpmk_percent_form.push(0);
          //   }
          
          // // check jika nilai cpmk bobot sesuai dengan bobot total
          // if (total == this.form.percentage) {
          //   // masukin list bobot cpmk ke dalam form input database
          //   this.form.cpmk_percent_list = '{' + String(this.cpmk_percent_form) + '}';
          // masukin list cpmk ke dalam form input database
          this.form.cpmk_list = '{' + String(this.selectedCheckbox.sort()) + '}';
          this.$api.post("/assignment/create/" + this.selectedCheckbox[0] + "/" + this.classes[this.classInput].class_id, this.form, {
            headers: {
              'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
          }).then(response => {
            this.error_message = response.data.message;
            this.color = 'green';
            this.snackbar = true;
            
          }).catch(error => {
            this.error_message = error.response.data.message;
            this.color = 'red';
            this.snackbar = true;
            //this.load = false;
          });
          this.load = false;
          this.close();
          this.resetForm();
          this.readAssignment();
          // if (this.dataAvail) {
          //   this.readAssignment();
          // }
          
        }
      } else {
        this.load = false;
        this.$api.put("assignment/update/" + this.editID, this.form, {
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
          this.readAssignment();
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
          this.inputType = "Tambah";
          this.close();
          this.resetForm();
          this.readAssignment();
        });
      }
    },
    resetForm() {
      this.form = {
        description: null,
        cpmk_list: null,
      };
    },
    close() {
      this.resetForm();
      this.matkulInput = null;
      this.selectedCheckbox = [];
      this.checkboxItems = [];
      this.dialog = false;
      this.dialogWeight = false;
      this.dialogEdit = false;
      this.dialogConfirm = false;
    },
    readCPMKInput() {
      this.$api.get("/cpmk/showMatkul/" + this.classes[this.classInput].matkul_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.cpmkInput = response.data.data;
        this.makeCheckbox();
      }).catch(() => {
        this.selectedCheckbox = [];
        this.checkboxItems = [];
      })
    },
    makeCheckbox() {
      this.selectedCheckbox = [];
      this.checkboxItems = [];
      for (let i=0; i<this.cpmkInput.length; i++) {
        this.checkboxItems.push({
          label: this.cpmkInput[i].description,
          value: this.cpmkInput[i].cpmk_id,
          checked: false
        });
      }
    },

  },
  computed: {
    formtitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readDataClass();
  },
}
</script>