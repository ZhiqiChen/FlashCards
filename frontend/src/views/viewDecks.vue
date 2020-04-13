<template>
  <div>
    <NavBar />
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <b-jumbotron>
            <h3 v-if="decks.length === 0">No Decks here yet! Add some to get started.</h3>
            <template v-slot:header>View Decks</template>
            <div v-if="decks.length !== 0">
              <b-carousel v-model="deckSlide"
              :interval="0" controls indicators
              background="#ababab"
              img-width="1000"
              img-height="480"
              style="text-shadow: 1px 1px 2px #333;"
              @sliding-start="onSlideStart">
                <div v-for="deck in decks" :key="deck._id">
                  <b-carousel-slide img-blank img-alt="Blank image">
                    <h2>{{deck.title}}</h2>
                    <h3>{{deck.description}}</h3>
                  </b-carousel-slide>
                </div>
              </b-carousel>
              <hr class="my-4">
              <p>
                Select a deck
              </p>
              <b-form-checkbox
                    v-model="ifRandom"
                    value="1"
                    unchecked-value="0"
                  >
                    Randomize flashcards
              </b-form-checkbox>
              <br>
              <b-button variant="primary" class="my-2 my-sm-0" type="submit" @click="selectDeck">Select Deck</b-button>
            </div>
          </b-jumbotron>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-jumbotron v-if="selectedDeckIndex != -1">
            <template v-slot:header>Deck: {{decks[selectedDeckIndex].title}}</template>
            <div v-if="flashcards.length === 0">
              <h3  v-if="flashcards.length === 0">No flashcards here yet! Add some to get started.</h3>
            </div>
            <div v-else>
              <div v-if="QorA == 0">
                <h1>Question:</h1>
              </div>
              <div v-else-if="QorA == 1">
                <h1>Answer:</h1>
              </div>
              <b-carousel v-model="flashcardIndex"
              :interval="0"  controls indicators background="#ababab"
              @sliding-start="changeCard"
              img-width="1000"
              img-height="650"
              style="text-shadow: 1px 1px 2px #333;">

                <div v-for="flashcard in flashcards" :key="flashcard._id">
                  <b-carousel-slide img-blank img-alt="Blank image">
                    <h5><b-badge variant="info">{{getProgress(flashcard.streak)}}</b-badge></h5>
                    <h2 v-if="QorA == 0">{{flashcard.front}}</h2>
                    <h2 v-if="QorA == 1">
                      {{flashcard.back}}
                    </h2>
                  </b-carousel-slide>
                </div>
              </b-carousel>
              <p>Flash Card #: {{flashcardIndex+1}} / {{flashcards.length}}</p>
              <hr class="my-4">
              <p>
                Practice your Flash cards or edit them
              </p>

              <b-button-group class="mt-2">
                <b-button variant= "" type="submit" @click="flipCard">Flip Card</b-button>
                <b-button variant="success" type="submit" @click="correctAnswer">Correct</b-button>
                <b-button variant="danger" type="submit" @click="wrongAnswer">Incorrect</b-button>
              </b-button-group>
            </div>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import NavBar from '@/components/header.vue'
import axios from 'axios'
export default {
  name: 'viewDecks',
  components: {
    NavBar
  },
  mounted () {
    this.getCurrUser()
  },
  data () {
    return {
      decks: [Object],
      selectedDeckIndex: -1,
      flashcardIndex: 0,
      deckSlide: 0,
      QorA: 0,
      ifRandom: '0',
      correctSound: new Audio(require('@/components/correct.wav')),
      wrongSound: new Audio(require('@/components/wrong.wav')),
      slideSound: new Audio(require('@/components/slide.wav')),
      flashcards: [],
      user: ''
    }
  },
  methods: {
    displayFlashcards (flashcards) {
      if (this.ifRandom === '1') {
        this.flashcards = flashcards.sort(function () { return 0.5 - Math.random() })
      } else {
        this.flashcards = flashcards
      }
    },
    toUsers () {
      this.$router.push({ name: 'home' })
    },
    selectDeck () {
      this.getCurrUser()

      this.selectedDeckIndex = this.deckSlide
      const headers = {
        'Content-Type': 'application/json'
      }
      const reqString = `/api/users/${this.user}/decks/${this.decks[this.selectedDeckIndex]._id}/flashcards/`
      axios.get(reqString, headers).then(res => {
        this.displayFlashcards(res.data)
      }).catch(e => {
      })
    },
    getProgress (streak) {
      if (streak <= 2) {
        return 'New'
      } else if (streak <= 4) {
        return 'Progressing'
      } else {
        return 'learnt'
      }
    },
    flipCard () {
      if (this.QorA === 0) {
        this.QorA = 1
      } else {
        this.QorA = 0
      }
    },
    correctAnswer () {
      this.correctSound.play()
      axios.patch(`/api/users/${this.user}/decks/${this.decks[this.selectedDeckIndex]._id}/flashcards/${this.flashcards[this.flashcardIndex]._id}/streak/`,
        { value: 1 })
        .then(res => {
          this.flashcards[this.flashcardIndex].streak++
        })
        .catch(e => alert('Something went wrong'))
    },
    wrongAnswer () {
      this.wrongSound.play()
      axios.patch(`/api/users/${this.user}/decks/${this.decks[this.selectedDeckIndex]._id}/flashcards/${this.flashcards[this.flashcardIndex]._id}/streak/`,
        { value: -1 })
        .then(res => {
          this.flashcards[this.flashcardIndex].streak = 0
        })
        .catch(e => alert('Something went wrong'))
    },
    changeCard () {
      this.QorA = 0
      this.slideSound.play()
    },
    onSlideStart () {
      this.slideSound.play()
    },
    getDecks () {
      // change this to change to curr user
      const headers = {
        'Content-Type': 'application/json'
      }
      const reqString = `/api/users/${this.user}/decks/`
      axios.get(reqString, headers).then(res => {
        this.decks = res.data
      }).catch(e => {
      })
    },
    getCurrUser () {
      axios.get('/api/user/')
        .then(res => {
          this.user = res.data._id
          this.getDecks(this.user)
        })
        .catch(e => e)
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
h2 {
  word-wrap:break-word;
}
h3 {
  word-wrap:break-word;
}
</style>
