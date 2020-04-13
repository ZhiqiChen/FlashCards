<template>
<div>
  <NavBar />
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <b-jumbotron>
          <template v-slot:header>Edit Decks</template>
          <h3 id="none-text" v-if="!decks">None here yet! Add some to get started.</h3>
          <button type="button" class="btn btn-primary fc-elem" id="addDeck" @click="toggleDeckEdit">Add Deck</button>
          <form class="addDeckForm" v-if="addDeckMode">
              <input class="form-control fc-elem" placeholder="Deck Title" v-model="deckTitle" required/>
              <textarea placeholder="Deck Description." class="form-control fc-elem" rows="5"  v-model="deckDescription" required></textarea>
              <button type="button" class="btn btn-success fc-elem" id="saveDeck" @click="saveDeck()">Save</button>
          </form>
          <b-list-group>
            <div v-for="deck in decks" :key="deck._id" class="deckGroup">
              <b-list-group-item :to="{name: 'flashcards', params: {deckId: deck._id}}">
                <h3>{{ deck.title }}</h3>
                <h6>{{ deck.description }}</h6>
              </b-list-group-item>
              <button type="button" class="btn btn-danger fc-elem deleteDeck" @click="deleteDeck(deck._id)">Delete Deck</button>
            </div>
          </b-list-group>
        </b-jumbotron>
      </b-col>
    </b-row>
  </b-container>
  <b-modal id="status" title="Error" ok-only>
    <p>{{error}}</p>
  </b-modal>
</div>
</template>

<script>
// add mapActions maybe
import NavBar from '@/components/header.vue'
import axios from 'axios'
export default {
  name: 'Decks',
  components: {
    NavBar
  },
  mounted () {
    this.getCurrUser()
    this.getDecks()
  },
  data () {
    return {
      error: '',
      decks: [],
      addDeckMode: false,
      deckTitle: '',
      deckDescription: '',
      user: ''
    }
  },
  methods: {
    selectDeck (e) {
      this.selectedDeckIndex = this.deckSlide
    },
    getCurrUser () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
        })
        .catch(e => e)
    },
    toggleDeckEdit () {
      this.addDeckMode = !this.addDeckMode
    },
    getDecks () {
       axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          // change this to change to curr user
          const headers = {
            'Content-Type': 'application/json'
          }
          const reqString = `/api/users/${this.user}/decks/`
          axios.get(reqString, headers).then(res => { this.decks = res.data }).catch(e => {})
        })
        .catch(e => e)
    },
    saveDeck () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          if (this.deckTitle !== '') {
            axios.post(`/api/users/${this.user}/decks/`, { title: this.deckTitle, description: this.deckDescription })
              .then(res => {
                this.decks.unshift(res.data)
                alert('saved')
              })
              .catch(e => alert('Something went wrong'))
          } else {
            this.error = 'Unable to save, make sure that you have a title'
            this.$bvModal.show('status')
          }
        })
        .catch(e => e)
    },
    deleteDeck (deckId) {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          axios.delete(`/api/users/${this.user}/decks/${deckId}/`)
            .then(res => {
              const removedId = this.decks.findIndex(d => d._id === deckId)
              this.decks.splice(removedId, 1)
              alert('Deleted!')
            })
            .catch(e => alert('Something went wrong'))
        })
        .catch(e => e)
    },
    toUsers () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#button {
  background-color: #333;
  color: #fff;
  padding: 10px 15px;
  border: none;
}
.addDeckForm .fc-elem {
  margin: 1em;
}
.addDeckForm {
  padding: 1em;
}
h3 {
  word-wrap:break-word;
}
h6 {
  word-wrap:break-word;
}
.deckGroup {
  display: block;
  border-bottom: dotted 1px black;
  margin: 0.5em;
  padding: 1em;
}

.deleteDeck {
  margin: 1.5em;
}

#addDeck {
  margin: 1em;
}
b-list-group-item  {
  word-wrap: break-word;
}
.deleteDeck {
  margin: 1em;
  float: right;
}
</style>
