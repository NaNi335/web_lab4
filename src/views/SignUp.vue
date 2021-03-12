<template>
  <div class="signup">
    <v-form
      @submit.prevent="signUp"
      ref="signUpForm"
      class="my-2"
    >
      <v-row>
        <v-col cols="3" class="mx-auto">
          <v-text-field
            label="ФИО"
            v-model="signUpForm.first_name"
            :rules="rules.required"
          />
          <v-text-field
            label="Имя пользователя"
            v-model="signUpForm.username"
            :rules="rules.required"
          />
          <v-select
            :items="roles"
            label="Роль"
            v-model="signUpForm.role"
            :rules="rules.required"
          ></v-select>
          <v-text-field
            label="Номер телефона"
            v-model="signUpForm.phone_number"
            :rules="rules.required"
          />
          <v-text-field
            label="Email"
            v-model="signUpForm.email"
            :rules="rules.required"
          />
          <v-text-field
            label="Введите пароль"
            v-model="signUpForm.password"
            type="password"
            :rules="[rules.required, rules.counter9]"
          />
          <v-btn type="submit" color="#212121" dark>Зарегистрироваться</v-btn>

          <p class="mt-5">Уже зарегистрированы? <router-link to="/signin">Войти</router-link></p>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'SignUp',

  data: () => ({
    signUpForm: {
      first_name: '',
      last_name: '',
      role: '',
      phone_number: '',
      email: '',
      username: '',
      password: ''
    },

    roles: ['Администратор', 'Менеджер', 'Бухгалтер'],
    rules: {
      required: value => !!value || 'Required.',
      counter9: value => value.length <= 9 || 'Min 9 characters'
    }

  }),

  methods: {
    async signUp () {
      if (this.signUpForm.role === 'admin') {
        this.signUpForm.role = 'ad'
      } else if (this.signUpForm.role === 'manager') {
        this.signUpForm.role = 'ma'
      } else if (this.signUpForm.role === 'accountant') {
        this.signUpForm.role = 'ac'
      }
      try {
        const response = await this.axios
          .post('http://127.0.0.1:8000/auth/users/', this.signUpForm)

        if (response.status !== 201) {
          throw new Error(response.status)
        }
        this.$refs.signUpForm.reset()
      } catch (e) {
        console.error('AN API ERROR', e)
      }
    }
  }
}
</script>
