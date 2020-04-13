# Project Flashcard REST API Documentation

## Decks API
### Signup
 description: Signup a user
- request: `POST /api/signup`
    - content-type: `application/json`
    - body: object
      - username: (string) an alphanumeric unique username
      - description: (string) an alphanumeric secure keyword.
- response: 200
    - content-type: `application/json`
    - body: (object)
    - (Json):Sign up successful
- response: 400
    - Please enter a username
    - Please enter a password
- response: 409
    - Username + 'username' + already exists
- response 500
    - Internal error

``` 
    $ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"username":"Prakhar07", "password":"hideWord67"} 
       http://localhost:3000/api/signup/'
```
### Login
- description: Create a new empty deck
- request: `POST /api/login
    - content-type: `application/json`
    - body: object
      - username: (string) user's unique username
      - password: (string) user' associated password
- response: 200
    - content-type: `application/json`
    - body: object
      
- response: 401
    - Username/Password incorrect
    - access denied
- response: 500
    -Internal error


``` 
    $ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"title":"Prakhar07", "description":"hideWord67} 
       http://localhost:3000/api/login
```
- description: Signout a user
- request: `GET /api/signout
- response: 200
    - content-type: `application/json`
    - body: object
      - a user session
```
    curl http://localhost:3000/api/signout

```
### Create

- description: Create a new empty deck
- request: `POST /api/users/:username/decks/`
    - content-type: `application/json`
    - body: object
      - title: (string) the deck title
      - description: (string) the description of the deck
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the deck id
      - owner : (string) the owner of the deck
      - title: (string) the title of the deck
      - description: (string) the deck's description
      - collaborators: (list of string) List of ids of users allowed to edit deck
- response: 403
    - Forbidden
- response 500
    -Internal error

``` 
    $ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"title":"Haskell Deck", "description":"Deck for CSCC24"} 
       http://localhost:3000/api/users/ahmad/decks/'
```

- description: Create a new flashcard for a specific deck
- request: `POST /api/users/:username/decks/:deckId/flashcards/`
    - content-type: `application/json`
    - body: object
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response: 500
    - Forbidden

``` 
    $ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"front":"What is t  he capital of Canada", "back":"Ottawa", "author":"John Smith"} 
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/'
```

- description: create a json representation of given txt file
- request: `POST /api/txt`
    - content-type: `application/txt`
    - body: object
      - file: (PDF)
- response: 200
    - content-type: `application/json`
    - valeue: string
- response: 500
    - Unsupported file

``` 
    $ curl -X POST 
       -H "Content-Type: `text/plain`" 
       -d '{"file":"~/Documents/foo.pdf"} 
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/'
```

- description: create a json representation of given docx file
- request: `POST /api/docx`
    - content-type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
    - body: object
      - file: (docx)
- response: 200
    - content-type: `application/json`
    - value: string
- response: 500
    - Unsupported file

``` 
    $ curl -X POST 
       -H "Content-Type: `application/application/vnd.openxmlformats-officedocument.wordprocessingml.document`" 
       -d '{"file":"~/Documents/foo.pdf"} 
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/'
```

- description: create a json representation of given pdf file
- request: `POST /api/pdf/`
    - content-type: `application/pdf`
    - body: object
      - file: (txt)
- response: 200
    - content-type: `application/json`
    - valuue: string
- response: 500
    - Unsupported file

``` 
    $ curl -X POST 
       -H "Content-Type: `application/pdf`" 
       -d '{"file":"~/Documents/foo.pdf"} 
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/'
```
### Read

- description: Get current user
- request: `GET /api/user/
- response: 200
    - content-type: `application/json`
    - body: object
      - user session

``` 
    curl http://localhost:3000/api/user/
```

- description: Get all users
- request: `GET /api/users/`
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the deck id
      - hash: (string) salted hash of password
    - Oops! We can't find your deck! Perhaps it was moved or deleted?
- response: 500
    -internal error
``` 
    curl http://localhost:3000/api/users/
```

- description: Get a user with id userid
- request: `GET /api/users/:userid/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the deck id
      - hash: (string) salted hash of password
- response: 404
    - User not found
- response: 500
    - intenal error

- description: Get specific flashcard
- request: `GET /api/users/:username/decks/:deckId/flashcards/:flashcardId/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response: 500
    - Internal error


``` 
    curl http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/ASAsaa213/
```

- description: Get all decks for a user
- request: `GET /api/users/:username/decks/`
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the deck id
      - owner : (string) the owner of the deck
      - title: (string) the title of the deck
      - description: (string) the deck's description
      - collaborators: (list of string) List of ids of users allowed to edit deck
- response: 404
    - Oops! We can't find your deck! Perhaps it was moved or deleted?
- response: 500
    - Internal error
``` 
    curl http://localhost:3000/api/users/ahmad/decks/
```

- description: Get all flashcards for a deck
- request: `GET /api/users/:username/decks/:deckId/flashcards/`
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response: 500
    - Internal error

``` 
    curl http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/
```

- description: Get all flashcards made by a user
- request: `GET /api/users/:username/flashcards/`
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response: 500
    - Internal error

``` 
    curl http://localhost:3000/api/users/ahmad/flashcards/
```

### Update

- description: update a flashcard
- request: `PATCH /api/users/:userId/decks/:deckId/flashcards/:flashcardId/`
    - content-type: `application/json`
    - body: object
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response 500


``` 
    $ curl -X PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"front":"What is the capital of Ontario", "back":"Toronto", "author":"John Smith"} 
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/sdjj2'
```
- description: update a flashcard streak
- request: `PATCH /api/users/:userId/decks/:deckId/flashcards/:flashcardId/streak`
    - content-type: `application/json`
    - body: object
      - value: either 1 or -1
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response 500


``` 
    $ curl -X PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"value":"1}
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/sdjj2/streak'
```

### Delete

- description: Delete a deck
- request: `DELETE /api/users/:username/decks/:deckId/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the deck id
      - owner : (string) the owner of the deck
      - title: (string) the title of the deck
      - description: (string) the deck's description
      - collaborators: (list of string) List of ids of users allowed to edit deck
- response: 404
    - Oops! We can't find your deck! Perhaps it was moved or deleted?
- response 500
    -internal error

``` 
    curl -X DELETE
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/
```

- descripiton: Delete a flashcard
- request: `DELETE /api/users/:username/decks/:deckId/flashcards/:flashcardId/`
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response: 404
    - Oops! We can't find your card! Perhaps it was moved or deleted?
- response: 500
    -internal error

``` 
    curl -X DELETE
       http://localhost:3000/api/users/ahmad/decks/sAdj131jk/flashcards/ASAsaa213/
```

- descripiton: Delete all flashcards by made a user
- request: `DELETE /api/users/:username/flashcards/`
- response: 200
    - content-type: `application/json`
    - body: list of objects
      - _id: (string) the flashcard id
      - front: (string) the front of the flashcard
      - back: (string) the back of the flashcard
      - author: (string) the author of the flashcard
      - deck: (string) id of the deck to which this flashcard belongs
- response: 500
    - internal error

``` 
    curl -X DELETE
       http://localhost:3000/api/users/ahmad/flashcards/
```