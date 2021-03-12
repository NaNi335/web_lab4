<template>
  <v-card>
    <v-navigation-drawer
      floating
      permanent
    >
      <v-list
        dense
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click=item.link
        >
           <v-list-item-content>
            <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'NavDrawer',
  data () {
    return {
      items: [
        { title: 'Заявки', link: this.request },
        { title: 'Клиенты', link: this.client },
        { title: 'Исполнители', link: this.executor },
        { title: 'Выбранные услуги', link: this.chosenServices },
        { title: 'Выбранные материалы', link: this.chosenMaterials },
        { title: 'Прайс-лист на услуги', link: this.servicePL },
        { title: 'Прайс-лист на материалы', link: this.materialsPL },
        { title: 'Рабочие группы', link: this.workGroup },
        { title: 'Платежные поручения', link: this.paymentOrder },
        { title: 'Счета на оплату', link: this.invoice }

      ]
    }
  },

  methods: {
    client () {
      this.$router.push({ name: 'client' })
    },
    servicePL () {
      this.$router.push({ name: 'servicepl' })
    },
    materialsPL () {
      this.$router.push({ name: 'materialspl' })
    },
    executor () {
      this.$router.push({ name: 'executor' })
    },
    request () {
      this.$router.push({ name: 'request' })
    },
    chosenServices () {
      this.$router.push({ name: 'chosenservices' })
    },
    chosenMaterials () {
      this.$router.push({ name: 'chosenmaterials' })
    },
    workGroup () {
      this.$router.push({ name: 'workgroup' })
    },
    invoice () {
      this.$router.push({ name: 'invoice' })
    },
    paymentOrder () {
      this.$router.push({ name: 'paymentorder' })
    }
  }
}

</script>

<style scoped>

</style>
