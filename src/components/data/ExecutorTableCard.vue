<template>
  <v-data-table
    :headers="headers"
    :items="executors"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color = '#EEEEEE'
        outlined= "True"
        height = 100
      >
        <v-toolbar-title class="font-weight-bold">Исполнители</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="#212121"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Добавить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ executorForm }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.full_name"
                      label="ФИО"
                      :rules="[rules.required, rules.counter50]"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.phone_number"
                      label="Номер телефона"
                      :rules="[rules.required, rules.counter12]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Вы уверены, что хотите удалить этого исполнителя?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="DeleteExecutor">Подтвердить</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    executors: [],
    rules: {
      required: value => !!value || 'Required.',
      counter12: value => value.length <= 12 || 'Max 12 characters',
      counter50: value => value.length <= 50 || 'Max 50 characters'
    },
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'id', value: 'id' },
      { text: 'ФИО', value: 'full_name' },
      { text: 'Номер телефона', value: 'phone_number' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      full_name: '',
      phone_number: ''
    },
    defaultItem: {
      full_name: '',
      phone_number: ''
    }
  }),
  computed: {
    executorForm () {
      return this.editedIndex === -1 ? 'Добавить исполнителя' : 'Изменение данных об исполнителе'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  created () {
    this.GetExecutors()
  },

  methods: {
    async GetExecutors () {
      const response = await this.axios.get('http://localhost:8000/adAgency/executor/',
        { headers: { Authorization: 'Token ' + localStorage.getItem('token'), 'Content-Type': 'application/json' } })

      if (response.status !== 200) {
        // throw new Error(response.status)
      }
      this.executors = response.data
      return response.data
    },
    async CreateExecutor () {
      try {
        const response = await this.axios
          .post('http://localhost:8000/adAgency/executor/create/', this.editedItem, { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        console.log(response)

        if (response.status !== 201) {
          // throw new Error(response.status)
        }
        window.location.reload()
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async UpdateExecutor () {
      this.editedIndex = 1
      try {
        const response = await this.axios
          .put('http://localhost:8000/adAgency/executor/' + this.editedItem.id + '/', this.editedItem, { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 200) {
          throw new Error(response.status)
        }
        window.location.reload()
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async DeleteExecutor () {
      this.editedIndex = 1
      this.dialogDelete = true
      try {
        const response = await this.axios
          .delete('http://localhost:8000/adAgency/executor/' + this.editedItem.id + '/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 204) {
          throw new Error(response.status)
        }
        window.location.reload()
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    editItem (item) {
      this.editedIndex = 1
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = 1
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        this.UpdateExecutor()
      } else {
        this.CreateExecutor()
      }
      this.close()
    }
  }
}
</script>
