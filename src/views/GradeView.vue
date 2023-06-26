<template>
  
  <v-main>
    <v-container>
      <h1>Nilai Mahasiswa</h1>
      <div class="toolBar" style="margin-top: 10px;">
        <v-card class="fill-height fill-width" elevation="4">  
          <v-row class="d-flex align-items-center">
            <v-col md="4" class="d-flex" style="height: 122px;">
              <v-select
                class="align-self-end my-select"
                style="margin-left: 10px;"
                variant="outlined"
                v-model="classID"
                label="Kelas"
                :items="classesOption"
                @update:modelValue="readAssignment"
              ></v-select>
            </v-col>
            <v-col md="4" class="d-flex" style="height: 122px;">
              <v-select
                class="align-self-end my-select"
                style="margin-left: 10px; max-width: 400px;"
                variant="outlined"
                v-model="assignmentID"
                label="Tugas"
                :items="assignmentOption"
                @update:modelValue="readGrade"
              ></v-select>
            </v-col>
            
            <v-col md="1.5" class="d-flex justify-center align-right">
              <v-btn 
                class="align-self-center" 
                style="background-color: #16347A; color: white; width: 100px;" 
                @click="uploadHandler" 
              >Import</v-btn>
            </v-col>
            <v-col md="1.5" class="d-flex justify-center align-center">
              <v-btn 
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
                NPM
              </th>
              <th class="text-left" style="color: aliceblue;">
                Nama
              </th>
              <th class="text-left" style="color: aliceblue;" v-for="no in listNoCPMK" :key="no">
                CPMK {{ no }}
              </th>
              <th class="text-left" style="color: aliceblue;">
                Nilai Tugas
              </th>
              <th class="text-left" style="color: aliceblue;">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="dataAvail">
            <tr
              v-for="item in studentsGrade.slice(startIndex, endIndex)"
              :key="item.grade_id"
            >
              <td>{{ item.npm }}</td>
              <td>{{ item.name }}</td>
              <td v-for="column in dynamicColumns(item)" :key="column">
                {{ item[column] }}
              </td>
              <td>{{ item.grade }}</td>
              <td>
                <v-icon size="large" class="mr-2" @click="editHandler(item)"><Icon  icon="material-symbols:edit-document" color="green"/></v-icon>
                <v-icon size="large" class="mr-2" @click="deleteHandler(item.grade_id)"><Icon  icon="ic:baseline-delete-forever" color="red"/></v-icon>
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
                <span>{{ formtitle }} Nilai</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-select v-if="inputType == 'Tambah'"
                      style="margin-left: 10px;"
                      v-model="classIDInput"
                      label="Kelas"
                      :items="classesOption"
                      @update:modelValue="readAssignmentInput"
                    ></v-select>
                    <v-select v-if="inputType == 'Tambah'"
                      style="margin-left: 10px;"
                      v-model="assignmentIDInput"
                      label="Tugas"
                      :items="assignmentInputOption"
                      @update:modelValue="readStudentsClass"
                    ></v-select>
                    <v-autocomplete v-if="inputType == 'Tambah'"
                      style="margin-left: 10px;"
                      v-model="class_mahasiswa_ID"
                      label="Pilih Mahasiswa"
                      :items="studentsOption"
                    ></v-autocomplete>
                    <!-- <v-text-field v-model.number="form.grade" type="number" label="Nilai"></v-text-field> -->
                    <div v-for="(item, index) in listCPMKInput" :key="index">
                        <v-text-field v-model.number="item.value" type="number" :label="item.label" style="margin-left: 10px;"></v-text-field>
                    </div>
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
                <span>Upload File Nilai</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                  <v-select
                    style="margin-left: 10px;"
                    v-model="classIDInput"
                    label="Kelas"
                    :items="classesOption"
                    @update:modelValue="readAssignmentInput"
                  ></v-select>
                  <v-select
                    style="margin-left: 10px;"
                    v-model="assignmentIDInput"
                    label="Tugas"
                    :items="assignmentInputOption"
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
              <v-card-text>Anda yakin ingin menghapus Nilai ini?</v-card-text>
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
.my-select {
  width: 400px; /* set a max width for the v-select */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* prevent text from wrapping to a new line */
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
    editID: null,
    dialog: false,
    dialogConfirm: false,
    dialogUpload: false,
    color: "",
    dataAvail: false,
    classIDInput: null,
    classes: new Array(),
    classesOption: new Array(),
    classID: null,
    cpmk: new Array(),
    cpmkInput: new Array(),
    cpmkID: null,
    cpmkOption: new Array(),
    listNoCPMK: new Array(),
    assignment: new Array(),
    assignmentInput: new Array(),
    assignmentID: null,
    assignmentIDInput: null,
    assignmentOption: new Array(),
    assignmentInputOption: new Array(),
    studentsGrade: new Array(),
    studentsClass: new Array(),
    studentsOption: new Array(),
    class_mahasiswa_ID: null,
    listCPMKInput: new Array(),
    form: {
      grade: null,
      cpmk_grade: null
    },
    file: null,
    page: 1,
    itemsPerPage: 6,

  }),
  methods: {
    dynamicColumns(item) {
      return Object.keys(item).filter((key) => key.startsWith('CPMK '));
    },
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
        //this.classesOption.push(this.classes[i].code + " - " + this.classes[i].matkul_name + " - " + this.classes[i].class_order);
      }
    },
    readAssignment() {
      this.$api.get("/assignment/class/" + this.classes[this.classID].class_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.assignmentID = null;
        this.assignment = response.data.data;
        this.dataAvail = false;
        this.moveAssignment();
        this.readCPMK();
      }).catch((error) => {
        this.error_message = error.response.data.message;
        this.assignmentID = null;
        this.assignment = [];
        this.assignmentOption = [];
        this.dataAvail = false;
      })
    },
    moveAssignment() {
      this.assignmentOption = [];
      for (let i=0; i<this.assignment.length; i++) {
        let temp = { value: i, title: this.assignment[i].description };
        this.assignmentOption.push(temp);
      }
    },
    readAssignmentInput() {
      this.$api.get("/assignment/class/" + this.classes[this.classIDInput].class_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.assignmentIDInput = null;
        this.assignmentInput = response.data.data;
        this.moveAssignmentInput();
        this.readCPMKInput()
      }).catch((error) => {
        this.error_message = error.response.data.message;
        this.assignmentIDInput = null;
        this.assignmentInput = [];
        this.assignmentInputOption = [];
      })
    },
    moveAssignmentInput() {
      this.assignmentInputOption = [];
      for (let i=0; i<this.assignmentInput.length; i++) {
        let temp = { value: i, title: this.assignmentInput[i].description };
        this.assignmentInputOption.push(temp);
      }
    },
    readCPMK() {
      this.$api.get("/cpmk/showMatkul/" + this.classes[this.classID].matkul_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.cpmk = response.data.data;
        this.giveNumber();
      });
    },
    giveNumber() {
      let number = {}
      let temp = 1;
      for(let i=0; i<this.cpmk.length; i++) {
        number = {number:temp};
        this.cpmk[i] = Object.assign(this.cpmk[i], number);
        temp = temp+1;
      }
    },
    readCPMKInput() {
      this.$api.get("/cpmk/showMatkul/" + this.classes[this.classIDInput].matkul_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.cpmkInput = response.data.data;
        this.giveNumberInput();
      });
    },
    giveNumberInput() {
      let number = {}
      let temp = 1;
      for(let i=0; i<this.cpmkInput.length; i++) {
        number = {number:temp};
        this.cpmkInput[i] = Object.assign(this.cpmkInput[i], number);
        temp = temp+1;
      }
    },
    readGrade() {
      this.$api.get("/grade/showGradeClass/" + this.classes[this.classID].class_id +'/'+this.assignment[this.assignmentID].assignment_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.dataAvail = true;
        this.page = 1;
        this.studentsGrade = response.data.data;
        this.CreateListNoCPMK();
        this.ShowCPMKGrade();
      }).catch((error) => {
        this.error_message = error.response.data.message;
        this.dataAvail = false;
        this.CreateListNoCPMK();
      })
    },
    CreateListNoCPMK() {
      // mengambil list CPMK dan assignment
      let string1 = this.assignment[this.assignmentID].cpmk_list.replace('{','');
      let string2 = string1.replace('}', '');
      let listIDCPMK = string2.split(',');
      // membuat list nomor cpmk dari listIDCPMK
      this.listNoCPMK = [];
      for (let j=0; j<listIDCPMK.length; j++) {
        for (let k=0; k<this.cpmk.length; k++) {
          if (+listIDCPMK[j] == this.cpmk[k].cpmk_id) {
            this.listNoCPMK.push(this.cpmk[k].number);
            break;
          }
        }
      }
    },
    ShowCPMKGrade() {
      // --- memecah array cpmk_grade menjadi per kolom ---
      // iterasi ke semua mahasiswa
      for (let i=0; i<this.studentsGrade.length; i++) {
        // mengubah string cpmk_grade menjadi list
        let string1 = this.studentsGrade[i].cpmk_grade.replace('{','');
        let string2 = string1.replace('}', '');
        let listCPMKGrade = string2.split(',');
        // masukin semua list nilai menjadi kolom baru
        let column = {};
        let strColumn = '';
        for (let j=0; j<listCPMKGrade.length; j++) {
          strColumn = 'CPMK ' + this.listNoCPMK[j];
          column = { [strColumn]: listCPMKGrade[j] };
          this.studentsGrade[i] = Object.assign(this.studentsGrade[i], column);
        }
      }
    },
    readStudentsClass() {
      this.makeInputCPMKGrade();
      this.$api.get("/ClassMahasiswa/showOnStudentsClass/" + this.classes[this.classIDInput].class_id, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.studentsClass = response.data.data;
        this.moveStudents();
      }).catch((error) => {
        this.error_message = error.response.data.message;
      })
    },
    makeInputCPMKGrade() {
      this.listCPMKInput = [];
      // convert cpmk_list dari string ke list
      let string1 = this.assignmentInput[this.assignmentIDInput].cpmk_list.replace('{','');
      let string2 = string1.replace('}', '');
      let listCPMK = string2.split(',');
      // get cpmk number
      for (let x=0; x<listCPMK.length; x++) {
        for (let y=0; y<this.cpmkInput.length; y++) {
          if (+listCPMK[x] == this.cpmkInput[y].cpmk_id) {
            let dict = {value: 0, label: 'CPMK ' + (this.cpmkInput[y].number).toString()}
            this.listCPMKInput.push(dict);
            break;
          }
        }
      }
    },
    moveStudents() {
      this.studentsOption = [];
      for (let i=0; i<this.studentsClass.length; i++) {
        let temp = { value: this.studentsClass[i].class_mahasiswa_id, title: this.studentsClass[i].npm + ' - ' + this.studentsClass[i].name };
        this.studentsOption.push(temp);
      }
    },
    addHandler() {
      this.resetForm();
      this.listCPMKInput = [];
      this.dialog = true;
      this.inputType = "Tambah";
      this.classIDInput = null;
      this.assignmentIDInput = null;
      this.class_mahasiswa_ID = null;
      //this.readStudentsClass();
    },
    editHandler(item) {
      this.inputType = 'Ubah';
      this.editID = item.grade_id;
      // input data cpmk untuk di edit
      this.listCPMKInput = [];
      let cpmkColumns = Object.keys(item).filter(key => key.startsWith('CPMK'));
      let cpmkValues = cpmkColumns.map(column => item[column]);
      for (let i=0; i<cpmkColumns.length; i++) {
        this.listCPMKInput.push({ value: cpmkValues[i], label: cpmkColumns[i] })
      }
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteID = id;
      this.dialogConfirm = true;
    },
    uploadHandler() {
      this.file = null;
      this.dialogUpload = true;
      this.classIDInput = null;
      this.assignmentIDInput = null;
    },
    deleteData() {
      this.load = true;
      this.$api.delete("/grade/delete/" + this.deleteID, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = false;
        this.close();
        this.readGrade();
        this.inputType = "Tambah";
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;
      })
    },
    resetForm() {
      this.class_mahasiswa_ID = null;
      this.form = {
        grade: null,
      };
    },
    close() {
      this.dialogUpload = false;
      this.dialog = false;
      this.dialogConfirm = false;
    },
    save() {
        if (this.inputType == 'Tambah') {
          if (this.class_mahasiswa_ID == null) {
            this.error_message = 'Silahkan lengkapi data'
            this.color = 'red';
            this.snackbar = true;
          } else {
            this.load = true;
            // masukin value listCPMKInput
            let listGrade = [];
            let grade = 0;
            for (let i=0; i<this.listCPMKInput.length; i++) {
              if (this.listCPMKInput[i].value == '') {
                listGrade.push(0);
                grade = grade + 0;
              } else {
                listGrade.push(this.listCPMKInput[i].value);
                grade = grade + parseFloat(this.listCPMKInput[i].value);
              }
            }
            // ngitung nilai akhir assignment
            grade = grade / this.listCPMKInput.length;
            // masukin list nilai ke form
            this.form.cpmk_grade = '{' + String(listGrade) + '}';
            this.form.grade = grade;
            // post api
            this.$api.post("/grade/create/" + this.class_mahasiswa_ID + '/' + this.assignmentInput[this.assignmentIDInput].assignment_id, this.form, {
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
                this.readGrade();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = 'red';
                this.snackbar = true;
                this.load = false;
                });
          }
        } else {
            this.load = true;
            // masukin value listCPMKInput
            let listGrade = [];
            let grade = 0;
            for (let i=0; i<this.listCPMKInput.length; i++) {
              if (this.listCPMKInput[i].value == '') {
                listGrade.push(0);
                grade = grade + 0;
              } else {
                listGrade.push(this.listCPMKInput[i].value);
                grade = grade + parseFloat(this.listCPMKInput[i].value);
              }
            }
            // ngitung nilai akhir assignment
            //alert(grade)
            grade = grade / this.listCPMKInput.length;
            //alert(grade)
            // masukin list nilai ke form
            this.form.cpmk_grade = '{' + String(listGrade) + '}';
            this.form.grade = grade;
            // post api
            this.$api.put("/grade/update/" + this.editID, this.form, {
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
                this.readGrade();
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
    async saveUploaded() {
      if (this.assignmentIDInput == null) {
        this.error_message = 'Pilih kelas dan assignment dahulu';
        this.color = 'red';
        this.snackbar = true;
      } else {
        this.load = true;
        const formData = new FormData();
        formData.append("file", this.file[0]);
        this.$api.post("/grade/createList/" + this.classes[this.classIDInput].class_id + "/" + this.assignmentInput[this.assignmentIDInput].assignment_id, formData, {
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
          this.readGrade();
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
        });
      }
    },
  },
  computed: {
    formtitle() {
      return this.inputType;
    },
    numPages() {
      if (this.dataAvail == true) {
        return Math.ceil(this.studentsGrade.length / this.itemsPerPage);
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