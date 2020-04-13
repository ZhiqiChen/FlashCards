<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="dark" fixed= "top" class= "thisHeaderC">
    <b-navbar-brand href="#" @click= 'goHome'>Flash Cards</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item v-show= "!user"><router-link to="/login" class="link">Login</router-link></b-nav-item>
        <b-nav-item v-show= "!user"><router-link to="/signup" class="link">Signup</router-link></b-nav-item>
        <b-nav-item v-show= "user"><router-link to="/user" class="link">Home</router-link></b-nav-item>
        <b-nav-item v-show= "user"><router-link to="/viewDecks" class="link">View Decks</router-link></b-nav-item>
        <b-nav-item v-show= "user"><router-link to="/uploadFile" class="link">Upload File</router-link></b-nav-item>
        <b-nav-item v-show= "user"><router-link to="/decks" class="link">Edit Decks</router-link></b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right v-show= "user">
          <template v-slot:button-content>
            <em class="link">{{ user }}</em>
          </template>
          <b-dropdown-item @click="signOut()">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <br><br><br><br>
</div>
</template>

<script>
import axios from 'axios'
// TODO: fix spacing issue on top, and lead the links to useful places
export default {
  name: 'NavBar',
  data () {
    return {
      loggedIn: false,
      user: ''
    }
  },
  methods: {
    toUsers () {
      this.$router.push({ name: 'user' })
    },
    goHome () {
      if (this.user) {
        this.$router.push({ name: 'user' })
      } else {
        this.$router.push({ name: 'home' })
      }
    },
    signOut () {
      axios.get('/api/signout/').then(res => {
        this.getCurrUser()
        this.$router.push(this.$route.query.redirect || '/')
      }).catch(e => 'Log out failed')
    },
    getCurrUser () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data
        })
        .catch(e => e)
    }
  },
  mounted () {
    this.getCurrUser()
  }
}
</script>

<style scoped>
.thisHeaderC {
  box-shadow: 0 0 20px 0 #555555;
}
.link {
  color: white;
}
</style>
