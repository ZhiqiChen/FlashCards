<template>
<div>
  <NavBar />
  <b-alert v-model = "alert" variant="danger" dismissible>
    Error: {{error}}
  </b-alert>
  <div class="form-container d-flex flex-column justify-content-md-between align-items-center" id="loginMain" size="50">
    <input class="flex-cont inp" v-model="inputedEmail" v-on:keyup.enter = "checkValidity" type="text" name="newEmail" placeholder="Email" size="50">
    <input class="flex-cont inp" v-model="password" @keyup.enter = "checkValidity" type="password" name="password" placeholder="Password" size="50">
    <input class="flex-cont inp" v-model="password2" @keyup.enter = "checkValidity" type="password" name="password2" placeholder="Repeat Password" size="50">
    <button type="button" class="flex-cont btn btn-primary fc-elem" name="signup-submit" @click="checkValidity"> Signup</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/header.vue'
export default {
  name: 'Signup',
  components: {
    NavBar
  },
  data () {
    return {
      inputedEmail: '',
      password: '',
      password2: '',
      error: '',
      alert: false,
      user: ''
    }
  },
  mounted () {

  },
  methods: {
    validEmail: function (inputedEmail) {
      var re = /\S+@\S+\.\S+/
      return re.test(inputedEmail)
    },
    toUsers () {
      this.$router.push({ name: 'user' })
    },
    checkValidity: function () {
      if (this.inputedEmail === '' || this.password === '' || this.password2 === '') {
        this.alert = true
        this.error = 'Empty fields'
      } else if (this.password !== this.password2) {
        this.alert = true
        this.error = 'Passwords do not match'
      } else if (!this.validEmail(this.inputedEmail)) {
        this.alert = true
        this.error = 'Invalid Email'
      } else if (this.password.length < 5) {
        this.alert = true
        this.error = 'Password must be atleast 5 character'
      } else {
        this.alert = false
        this.error = ''
        axios.post('/api/signup/', { username: this.inputedEmail, password: this.password })
          .then(res => {
            this.$router.push({ name: 'login' })
          }).catch(e => alert('Signup Failed'))
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#button{
background-color:#333;
color:#fff;
padding:10px 15px;
border:none;
border-radius: 5px;
}
.flex-cont {
  margin: 0.5em;
}

.inp {
  border-radius: 0.25em;
}

#loginMain {
  width: 100%;
}

</style>
