<template>
  <div>
    <NavBar />
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <b-jumbotron>
            <template v-slot:header>View Decks</template>

            <template v-slot:lead>
              Practice your flashcard by scrolling selecting one of your decks and practice the flash cards in that deck!
            </template>

            <hr class="my-4">

            <p>
              Practice your decks and your memory by scrolling through your flash cards
              your flash cards.
            </p>
            <b-button variant="primary" @click= "goToViewDecks">Go To My Decks</b-button>
          </b-jumbotron>
        </b-col>
      </b-row>
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
              texts to add to a new Flash card.
            </p>
            <b-button variant="primary" @click= "goToUploadFile">Upload File</b-button>
          </b-jumbotron>
        </b-col>

        <b-col>
          <b-jumbotron>
            <template v-slot:header>Edit Decks</template>

            <template v-slot:lead>
             Create Decks and Edit decks/Flash cards to your choosing!
            </template>

            <hr class="my-4">

            <p>
              Edit decks and its flashcards using prompts
            </p>
            <b-button variant="primary" @click= "goToEditDeck">Edit My Decks</b-button>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavBar from '@/components/header.vue'
export default {
  name: 'User',
  components: {
    NavBar
  },
  methods: {
    goToEditDeck () {
      this.$router.push({ name: 'decks' })
    },
    toUsers () {
      this.$router.push({ name: 'home' })
    },
    goToUploadFile () {
      this.$router.push({ name: 'uploadFile' })
    },
    goToViewDecks () {
      this.$router.push({ name: 'viewDecks' })
    }
  },
  data () {
    return {
      error: '',
      user: ''
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.link {
  color: white;
}
</style>
