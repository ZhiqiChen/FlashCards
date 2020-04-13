<template>
<div>
  <NavBar />
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <b-jumbotron>
          <template v-slot:header>My Flashcards</template>
          <b-button variant="outline-primary" @click= "goToEditDecks">Back to Decks</b-button>
          <b-button variant="success" @click= "toggleShowNewForm">New Flashcard</b-button>
          <form v-if="this.showNewForm">
            <label class="font-weight-bold">Front</label>
            <textarea v-model="newFlashCardFront" class="form-control fc-elem" rows="5" required></textarea>
            <br>
            <label class="font-weight-bold">Back</label>
            <textarea v-model="newFlashCardBack" class="form-control fc-elem" rows="5" required></textarea>
            <button type="button" class="btn btn-success fc-elem" id="saveFlashcard" @click="newFlashCard">Save</button>
          </form>
          <b-list-group>
            <h3 id="none-text" v-if="flashcards.length === 0">None here yet! Add some to get started.</h3>
            <b-list-group-item v-for="flashcard in flashcards" class="flashcard" :key="flashcard._id">
              <h4> {{ flashcard.front }} </h4>
              <p> {{ flashcard.back }} </p>

              <form v-if="showEditForm == flashcard._id">
                <label class="font-weight-bold">Front</label>
                <textarea v-model="flashcard.front" class="form-control fc-elem" rows="5" required></textarea>

                <label class="font-weight-bold">Back</label>
                <textarea v-model="flashcard.back" class="form-control fc-elem" rows="5" required></textarea>
                <button type="button" class="btn btn-success fc-elem" id="saveFlashcard" @click="editFlashcard(flashcard._id, flashcard.front, flashcard.back)">Save</button>
              </form>

              <button type="button" class="btn btn-primary fc-elem" id="editFlashcard" @click="toggle(flashcard._id)">Edit Flashcard</button>
              <button type="button" class="btn btn-danger fc-elem" id="deleteFlashcard" @click="deleteFlashcard(flashcard._id)">Delete Flashcard</button>
            </b-list-group-item>
          </b-list-group>
        </b-jumbotron>
      </b-col>
    </b-row>
  </b-container>
  <b-modal id="status" title="Note" ok-only>
    <p>{{error}}</p>
  </b-modal>
</div>
</template>

<script>
// add mapActions maybe
import NavBar from '@/components/header.vue'
import axios from 'axios'
export default {
  name: 'Flashcards',
  components: {
    NavBar
  },
  mounted () {
    this.getCurrUser()
    this.getFlashcards()
    this.getDeckId()
  },
  data () {
    return {
      error: '',
      flashcards: [],
      deckId: '',
      showEditForm: false,
      showNewForm: false,
      newFlashCardFront: '',
      newFlashCardBack: '',
      user: ''
    }
  },
  methods: {
    getDeckId () {
      this.deckId = this.$route.params.deckId
    },
    getCurrUser () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
        })
        .catch(e => e)
    },
    toUsers () {
      this.$router.push({ name: 'home' })
    },
    getFlashcards () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          // change this to change to curr user
          const headers = {
            'Content-Type': 'application/json'
          }
          const reqString = `/api/users/${this.user}/decks/${this.deckId}/flashcards/`
          axios.get(reqString, headers).then(res => { this.flashcards = res.data }).catch(e => {})
        })
        .catch(e => alert(e))
    },
    toggle (flashcardId) {
      this.showEditForm = (this.showEditForm === flashcardId) ? false : flashcardId
    },
    deleteFlashcard (flashcardId) {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          axios.delete(`/api/users/${this.user}/decks/${this.deckId}/flashcards/${flashcardId}/`)
            .then(res => {
              const removedId = this.flashcards.findIndex(f => f._id === flashcardId)
              this.flashcards.splice(removedId, 1)
              this.error = 'The flashcard is deleted'
              this.$bvModal.show('status')
            })
            .catch(e => e)
        })
        .catch(e => e)
    },
    editFlashcard (flashcardId, newFront, newBack) {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          if (newFront !== '' && newBack !== '') {
            axios.patch(`/api/users/${this.user}/decks/${this.deckId}/flashcards/${flashcardId}/`, { front: newFront, back: newBack })
              .then(res => {
                this.error = 'The flashcard is saved'
                this.$bvModal.show('status')
              })
              .catch(e => e)
          } else {
            this.error = 'Unable to save, make sure that your flashcard has something on the front and the back'
            this.$bvModal.show('status')
          }
        })
        .catch(e => e)
    },
    goToEditDecks () {
      this.$router.push({ name: 'decks' })
    },
    toggleShowNewForm () {
      this.showNewForm = !this.showNewForm
    },
    newFlashCard () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          if (this.newFlashCardFront !== '' && this.newFlashCardBack !== '') {
            const reqString = `/api/users/${this.user}/decks/${this.deckId}/flashcards/`
            const reqBody = {
              front: this.newFlashCardFront,
              back: this.newFlashCardBack
            }
            axios.post(reqString, reqBody).then(res => {
              this.flashcards.unshift(res.data)
              this.error = 'The new flashcard is saved'
              this.$bvModal.show('status')
            }).catch(function (err) { if (err) alert('Something went wrong') })
          } else {
            this.error = 'Please make sure that the flashcard is not empty'
            this.$bvModal.show('status')
          }
        })
        .catch(e => e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  margin: 1em 0.5em 0.5em;
}

form {
  border: solid 0.5px black;
  padding: 10px;
  margin: 1em;
}

#none-text {
  margin: 2em;
}

.flashcard {
  margin: 1em;
}
</style>
