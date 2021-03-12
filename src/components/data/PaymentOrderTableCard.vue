<template>
  <v-data-table
    :headers="headers"
    :items="paymentorders"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
        color = '#EEEEEE'
        outlined= "True"
        height = 100
      >
        <v-toolbar-title class="font-weight-bold">Платежные поручения</v-toolbar-title>
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
              <span class="headline">{{ paymentorderForm }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      :items=requests
                      item-text="id"
                      item-value="id"
                      label="Заявка"
                      v-model="editedItem.request"
                      :rules="rules.requireds"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      :items=clients
                      item-text="contact_person"
                      item-value="id"
                      label="Клиент"
                      v-model="editedItem.client"
                      :rules="rules.requireds"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-select
                      :items=invoices
                      item-text="id"
                      item-value="id"
                      label="Счет"
                      v-model="editedItem.invoice"
                      :rules="rules.requireds"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.pay_date"
                      label="Оплата до"
                      type="date"
                      :rules="rules.required"
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
            <v-card-title class="headline">Вы уверены, что хотите удалить платежное поручение?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="DeletePaymentOrder">Подтвердить</v-btn>
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
    paymentorders: [],
    invoices: [],
    clients: [],
    requests: [],
    rules: {
      required: value => !!value || 'Required.',
      requireds: [(value) => value.length > 0 || 'Required.']
    },
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'id', value: 'id' },
      { text: 'Заявка', value: 'request.id' },
      { text: 'Клиент', value: 'client.contact_person' },
      { text: 'Счет', value: 'invoice.id' },
      { text: 'Оплата до', value: 'pay_date' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      request: 0,
      client: 0,
      invoice: 0,
      pay_date: '2021-01-01'
    },
    defaultItem: {
      request: 0,
      client: 0,
      invoice: 0,
      pay_date: '2021-01-01'
    }
  }),
  computed: {
    paymentorderForm () {
      return this.editedIndex === -1 ? 'Добавить платежное поручение' : 'Изменение данных о платежном поручении'
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
    this.GetPaymentOrder()
    this.GetRequests()
    this.GetClients()
    this.GetInvoice()
  },

  methods: {
    async GetPaymentOrder () {
      try {
        const response = await this.axios
          .get('http://127.0.0.1:8000/adAgency/paymentorder/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 200) {
          throw new Error(response.status)
        }
        this.paymentorders = response.data
        return response.data
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async GetRequests () {
      try {
        const response = await this.axios
          .get('http://127.0.0.1:8000/adAgency/request/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 200) {
          throw new Error(response.status)
        }
        this.requests = response.data
        return response.data
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async GetClients () {
      try {
        const response = await this.axios
          .get('http://127.0.0.1:8000/adAgency/client/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 200) {
          throw new Error(response.status)
        }
        this.clients = response.data
        return response.data
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async GetInvoice () {
      try {
        const response = await this.axios
          .get('http://127.0.0.1:8000/adAgency/invoice/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 200) {
          throw new Error(response.status)
        }
        this.invoices = response.data
        return response.data
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async CreatePaymentOrder () {
      try {
        const response = await this.axios
          .post('http://127.0.0.1:8000/adAgency/paymentorder/create/', { request: this.editedItem.request, client: this.editedItem.client, invoice: this.editedItem.invoice, pay_date: this.editedItem.pay_date }, { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 201) {
          throw new Error(response.status)
        }
        window.location.reload()
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async UpdatePaymentOrder () {
      this.editedIndex = 1
      try {
        const response = await this.axios
          .put('http://127.0.0.1:8000/adAgency/paymentorder/' + this.editedItem.id + '/', { request: this.editedItem.request.id, client: this.editedItem.client.id, invoice: this.editedItem.invoice.id, pay_date: this.editedItem.pay_date }, { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

        if (response.status !== 200) {
          throw new Error(response.status)
        }
        window.location.reload()
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    },
    async DeletePaymentOrder () {
      this.editedIndex = 1
      this.dialogDelete = true
      try {
        const response = await this.axios
          .delete('http://127.0.0.1:8000/adAgency/paymentorder/' + this.editedItem.id + '/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } })

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
        this.UpdatePaymentOrder()
      } else {
        this.CreatePaymentOrder()
      }
      this.close()
    }
  }
}
</script>
