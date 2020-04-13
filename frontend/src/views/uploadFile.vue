<template>
<div>
  <NavBar />
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <b-jumbotron>
          <template v-slot:header>Upload File</template>

          <template v-slot:lead>
            Upload file to add more flash cards to your decks or create new ones!
          </template>

          <hr class="my-4">
          <p>
            Upload a .pdf, .txt, or .docx file. Then, you can use highlight
            texts to add to a new Flash card. Remeber that your highlighted text will go to the question if you selected "front" and
            answers if you select "back". If you want to create a new deck please go to edit decks. Note if you hold control while highlight text it
            will append instead of replace text!
          </p>
          <b-form-file v-model="file" :state="Boolean(file)" placeholder="Choose a file or drop it here" drop-placeholder="Drop file here" accept=".pdf, .docx, .txt" size="lg" @input="displayFile"></b-form-file>
        </b-jumbotron>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <div v-if="file != null">
          <h1>{{file.name}}</h1>
          {{instructions}}
          <button type="button" id="add-flashcard" class="btn btn-secondary" @click="enableSelectionMode()">Add a Flashcard</button>
          <form v-if="selectionModeEnabled" class="fc-form">

            <label class="font-weight-bold">Front</label>
            <textarea v-model="frontSelectedText" class="form-control fc-elem" rows="5" required></textarea>

            <label class="font-weight-bold">Back</label>
            <textarea v-model="backSelectedText" class="form-control fc-elem" rows="5" required></textarea>

            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="flashcardOptions" id="front" value="front" @change="frontSelected = true" checked>
              <label class="form-check-label" for="inlineRadio1">Front</label>
            </div>

            <div class="form-check form-check-inline fc-elem">
                <input class="form-check-input" type="radio" name="flashcardOptions" id="back" value="back" @change="frontSelected = false">
                <label class="form-check-label" for="inlineRadio2">Back</label>
            </div>

            <select id="deckSelector" @change="onDeckChange($event)">
              <option value="" disabled selected hidden>Choose a deck</option>
              <option v-for="deck in decks" :value="deck._id" :key="deck._id">{{ deck.title }}</option>
            </select>
            <br><br><br>

            <button type="button" class="btn btn-success fc-elem" id="submitFlashcard" @click="saveFlashCard()">Save Flashcard</button>
          </form>
          <pre :class="[ selectionModeEnabled ? 'sm' : 'nm' ]" id="text-holder" @mouseup="getSelectedText()">{{text}}</pre>
        </div>
      </b-col>
    </b-row>
  </b-container>
  <b-modal id="status" title="Note" ok-only>
    <p>{{error}}</p>
  </b-modal>
</div>
</template>

<script>
import NavBar from '@/components/header.vue'
import axios from 'axios'
export default {
  name: 'UploadFile',
  components: {
    NavBar
  },
  data () {
    return {
      error: '',
      file: null,
      instructions: '',
      text: '',
      selectionModeEnabled: false,
      frontSelected: true,
      frontSelectedText: 'Question goes here',
      backSelectedText: 'Answer goes here',
      selected: 'Choose Deck',
      decks: [],
      selectedDeck: '',
      selectedDeckKey: '',
      test: false,
      user: ''
    }
  },
  mounted () {
    this.getCurrUser()
    this.getDecks()
  },
  methods: {
    displayFile () {
      // TODO add persistent storage
      const formData = new FormData()
      let reqString = '/api/'

      switch (this.file.type) {
        case 'application/pdf':
          reqString += 'pdf/'
          break
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          reqString += 'docx/'
          break
        case 'text/plain':
          reqString += 'txt/'
          break
        default:
          // TODO need to add exception handling here
      }

      if (this.file) {
        // create form data
        formData.append('uploaded', this.file)

        axios.post(reqString, formData).then(res => {
          this.text = res.data
        }).catch(e => {
        })
        this.instructions = 'Click Add Flashcard and select text to create new flashcards!'
      }
    },
    enableSelectionMode () {
      this.selectionModeEnabled = !this.selectionModeEnabled
    },
    getSelectedText () {
      const selectedText = window.getSelection().toString()
      if (this.selectionModeEnabled && selectedText) {
        if (this.frontSelected) {
          if (window.event.ctrlKey) {
            this.frontSelectedText += '\n' + selectedText
          } else {
            this.frontSelectedText = selectedText
          }
        } else {
          if (window.event.ctrlKey) {
            this.backSelectedText += '\n' + selectedText
          } else {
            this.backSelectedText = selectedText
          }
        }
      }
    },
    toUsers () {
      this.$router.push({ name: 'home' })
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
          axios.get(reqString, headers).then(res => {
            this.decks = res.data
          }).catch(e => {})
        })
        .catch(e => e)
    },
    onDeckChange (e) {
      this.selectedDeckKey = e.target.value
    },
    saveFlashCard () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          if (this.selectedDeckKey && this.frontSelectedText !== '' && this.backSelectedText !== '') {
            const reqString = `/api/users/${this.user}/decks/${this.selectedDeckKey}/flashcards/`
            const reqBody = {
              front: this.frontSelectedText,
              back: this.backSelectedText
            }
            axios.post(reqString, reqBody).then(res => alert('Saved!')).catch(function (err) { if (err) alert('Something went wrong') })
          } else {
            this.error = 'Please make sure that you have selected a deck and that the flashcard is not empty'
            this.$bvModal.show('status')
          }
        })
        .catch(e => e)
    },
    getCurrUser () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
        })
        .catch(e => e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#text-holder {
  width: 95%;
  min-height: 100vh;
  text-align: justify;
  position: relative;
  left: 2em;
  border: solid 2px black;
  padding: 2em;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

#add-flashcard {
  margin: 2em;
}

/* selection mode */
.sm {
  cursor: crosshair;
  color: darkred;
  font-weight: bold;
}

/* normal mode */
.nm {
  cursor: auto;
  color: black;
  font-weight: unset;
}

.fc-elem {
  margin-bottom: 2em;
}

#deckSelector {
  float: right;
}

</style>
