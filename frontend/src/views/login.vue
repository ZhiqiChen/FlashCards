<template>
  <div class="window">
    <NavBar />
    <b-alert v-model = "alert" variant="danger" dismissible>
      Error: {{error}}
    </b-alert>
    <div class="form-container d-flex flex-column justify-content-md-between align-items-center" id="loginMain">
      <input class="flex-cont inp" v-model="inputEmail" v-on:keyup.enter = "checkValidity" type="text" name="inputEmail" placeholder='Email' size=50>
      <input class="flex-cont inp" v-model="password" @keyup.enter = "checkValidity" type="password" name="password" placeholder="Password" size=50>
      <button type="button" class="flex-cont btn btn-primary fc-elem" v-on:click="checkValidity" name="signup-submit">Login</button>
      <b-modal id="status" title="Note" ok-only>
        <p>{{error}}</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from '@/components/header.vue'
export default {
  name: 'Login',
  data () {
    return {
      inputEmail: '',
      password: '',
      error: '',
      alert: false,
      user: ''
    }
  },
  methods: {
    /**
    Checks weather or not it logs in
    **/
    checkValidity: function () {
      if (this.inputEmail === '' || this.password === '') {
        this.alert = true
        this.error = 'Empty fields'
      } else {
        this.alert = false
        this.error = ''
        axios.post('/api/login/', { username: this.inputEmail, password: this.password })
          .then(res => {
            this.$router.push({ name: 'user' })
            this.getCurrUser()
          })
          .catch(e => {
            this.error = 'Login Failed Please Check your Email and Password'
            this.$bvModal.show('status')
          })
      }
    },
    toUsers () {
      this.$router.push({ name: 'user' })
    }
  },
  components: {
    NavBar
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
