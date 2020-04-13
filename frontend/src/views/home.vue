<template>
  <div>
    <NavBar />
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <b-jumbotron>
            <h2> Welcome to Flash Cards where you can create your very own flash cards that you can use on the web</h2>
            <p>Start by either logging in or signing up</p>
            <b-button-group>
              <b-button variant="primary" :to="{name: 'login'}">Login</b-button>
              <b-button variant="primary" :to="{name: 'signup'}">Sign up</b-button>
            </b-button-group>
        </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavBar from '@/components/header.vue'
// import api from '../api.js'
export default {
  name: 'Home',
  components: {
    NavBar
  },
  methods: {
    toUsers () {
      this.$router.push({ name: 'user' })
    }
  },
  data () {
    return {
      user: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.link {
  color: white;
}
</style>
