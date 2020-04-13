const path = require('path');
const express = require('express');
const Datastore = require('mongoose');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const session = require('express-session');
const Mongostore = require('connect-mongo')(session);
const multer = require('multer');
const bcrypt = require('bcrypt');
const pdfParse = require('pdf-parse');
const mammoth = require("mammoth");
const fs = require('fs');
const cookieParser = require("cookie-parser");

const app = express();
const connectionString = "mongodb+srv://projectflashcards:cscc09!@projectflashcards-vujjd.mongodb.net/test?retryWrites=true&w=majority";

const upload = multer({
    dest: path.join(__dirname, 'uploads')
});

let isAuthenticated = function (req, res, next) {
    if (!req.user) return res.status(401).send("Please login to continue!");
    next();
};

Datastore.connect(process.env.MONGODB_URI || connectionString, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(client => {
        console.log('Connected to Database');
        app.set('trust proxy', 1);
        const userSchema = Datastore.Schema({
            _id: String,
            password: String
        }, {collection: 'users'});

        const deckSchema = Datastore.Schema({
            _id: { 
                type: Datastore.Schema.Types.ObjectId,
                auto: true
            },
            owner: String,
            title: String,
            description: String
        }, {collection: 'decks'});

        const flashcardSchema = Datastore.Schema({
            _id: {
                type: Datastore.Schema.Types.ObjectId,
                auto: true
            },
            front: String,
            back: String,
            author: String,
            deck: Datastore.Schema.Types.ObjectId,
            streak: {
                type: Number,
                default: 0
            }
        }, {collection: 'flashcards'});

        let users = Datastore.model('users', userSchema);
        let decks = Datastore.model('decks', deckSchema);
        let flashcards = Datastore.model('flashcards', flashcardSchema);
        
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());

        app.use(function (req, res, next) {
            console.log("HTTP request", req.method, req.url, req.body);
            next();
        });

        app.use(cookieParser());
        app.use(session({
            secret: 'please change this secret',
            resave: true,
            saveUninitialized: true,
            store: new Mongostore({
                mongooseConnection: Datastore.connection,
                ttl: 24 * 60 * 60 // Keeps session open for 1 day
            })
        }));

        // ADD
        // signup
        // works
        app.post('/api/signup/', function (req, res, next) {
            // extract data from HTTP request
            if (!('username' in req.body)) return res.status(400).send('Please enter a username');
            if (!('password' in req.body)) return res.status(400).send('Please enter a password');
            let username = req.body.username;
            let password = req.body.password;
            // check if user already exists in the database
            users.findOne({
                _id: username
            }, function (err, user) {
                if (err) return res.status(500).send(err);
                if (user) return res.status(409).send("Username " + username + " already exists");
                // generate a new salt and hash
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) return res.status(500).send(err);
                        //.save new user into the database
                        users.update({_id: username}, {_id: username, password: hash}, {upsert: true}, function (err) {
                            if (err) return res.status(500).send(err);
                            return res.json('Sign up succesful');
                        });
                    });
                });
            });
        });

        // ADD
        // sign in
        // works
        app.post('/api/login/', function (req, res, next) {
            // extract data from HTTP request
            if (!('username' in req.body)) return res.status(400).send('Please enter a username');
            if (!('password' in req.body)) return res.status(400).send('Please enter a password');
            let username = req.body.username;
            let password = req.body.password;
            // retrieve user from the database
            users.findOne({
                _id: username
            }, function (err, user) {
                if (err) return res.status(500).send(err);
                if (!user) return res.status(401).send("Username/Password incorrect");
                bcrypt.compare(password, user.password, function (err, valid) {
                    if (err) return res.status(500).send(err);
                    if (!valid) return res.status(401).send("access denied");
                    // start a session
                    req.session.user = user;
                    res.setHeader('Set-Cookie', cookie.serialize('username', user._id, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
                    }));
                    return res.json('Signed in');
                });
            });
        });

        // ADD
        // sign out
        app.get('/api/signout/', function (req, res, next) {
            req.session.destroy();
            res.setHeader('Set-Cookie', cookie.serialize('username', '', {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
            }));
            return res.json("/");
        });

        // get current user
        app.get('/api/user/', function (req, res, next) {
            //here it is
            return res.json(req.session.user._id);
        });

        // get all users
        // works
        app.get('/api/users/', function (req, res, next) {
            users.find().sort({createdAt: -1}).exec(function (err, users) {
                if (err) return res.status(500).send(err);
                return res.json(users.reverse());
            });
        });

        // get specific user
        // works
        app.get('/api/users/:userid/', function (req, res, next) {
            users.findOne({_id: req.params.userid}, function(err, user) {
                if (err) return res.status(500).send(err);
                if (!user) return res.status(404).send("User not found");
                return res.json(user);
            });
        });

        /*
        ####################
        DECK METHODS

        Create Deck
        Delete Deck
        Get all decks for user

        ####################
        */

        // create a new empty deck
        // works
        app.post('/api/users/:username/decks/', function (req, res, next) {
            deckTitle = req.body.title;
            deckDesc = req.body.description;

            let newDeck = new decks({title: deckTitle, description: deckDesc, owner: req.params.username});

            newDeck.save(function(err, deck) {
                if (err) return res.status(500).send(err);
                return res.json(deck);
            });
        });

        // delete a deck
        // works
        app.delete('/api/users/:username/decks/:deckId/', function (req, res, next) {
            // remove all flashcards from the deck
            flashcards.remove({deck: req.params.deckId}, {multi: true}, function(err, num) {
                if (err) return res.status(500).send(err);
            });

            // remove deck itself
            decks.findOne({_id: req.params.deckId},
            function (err, deck) {
                if (err) return res.status(500).send(err);
                if (!deck) return res.status(404).send("Oops! We can't find your deck! Perhaps it was moved or deleted?");
                decks.remove({_id: req.params.deckId}, {multi: false}, function (err, num) {
                    res.json(deck);
                });
            });
        });

        // get all decks for a user
        // works
        app.get('/api/users/:username/decks/', function (req, res, next) {
            decks.find({owner: req.params.username}).sort({createdAt: -1}).exec(function(err, decksList) {
                if (err) return res.status(500).send(err)
                return res.json(decksList);
            });
        });

        /*
        ####################
        FLASHCARD METHODS

        Get specific flashcard in deck
        Get all flashcards for user
        Delete all flashcards for user
        edit a deck
        update streak
        Add Card to Deck
        Remove Card from Deck
        Get cards for deck
        ####################
        */

        // add a card to a deck
        // works
        app.post('/api/users/:username/decks/:deckId/flashcards/', function (req, res, next) {
            let front = req.body.front;
            let back = req.body.back;
            let author = req.params.username;
            let deckId = req.params.deckId;

            newFlashcard = new flashcards({
                front: front,
                back: back,
                author: author,
                deck: deckId
            });

            newFlashcard.save(function (err, flashcard) {
                if (err) return res.status(500).send(err);
                return res.json(flashcard);
            });
        });

        // remove a card from a deck
        // works
        app.delete('/api/users/:username/decks/:deckId/flashcards/:flashcardId/', function (req, res, next) {
            flashcards.findOne({
                _id: req.params.flashcardId
            }, function (err, flashcard) {
                if (err) return res.status(500).send(err);
                if (!flashcard) return res.status(404).send("Oops! We can't find your card! Perhaps it was moved or deleted?");
                flashcards.remove({
                    _id: req.params.flashcardId
                }, {
                    multi: false
                }, function (err, num) {
                    res.json(flashcard);
                });
            });
        });

        // get cards for a deck
        // works
        app.get('/api/users/:username/decks/:deckId/flashcards/', function (req, res, next) {
            flashcards.find({
                deck: req.params.deckId
            }).sort({
                createdAt: -1
            }).exec(function (err, flashcards) {
                if (err) return res.status(500).send(err);
                return res.json(flashcards);
            });
        });

        // get specific flashcard
        // works
        app.get('/api/users/:username/decks/:deckId/flashcards/:flashcardId/', function (req, res, next) {
            flashcards.findOne({_id: req.params.flashcardId}, function(err, flashcard) {
                if (err) return res.status(500).send(err);
                return res.json(flashcard);
            });
        });

        // get all flashcards made by a specific user
        // works
        app.get('/api/users/:username/flashcards/', function (req, res, next) {
            flashcards.find({author: req.params.username}).sort({createdAt: -1}).exec(function (err, flashcards) {
                if (err) return res.status(500).send(err);
                return res.json(flashcards);
            });
        });

        // delete all flashcards made by specific user
        app.delete('/api/users/:username/flashcards/', function (req, res, next) {
        flashcards.remove({author: req.params.username}, {multi: true}, function(err, num) {
                if (err) return res.status(500).send(err);
                return res.json(flashcards);
            });
        });

        // ADD
        // Edit contents of a flashcard
        // works
        app.patch('/api/users/:userId/decks/:deckId/flashcards/:flashcardId/', function (req, res, next) {
            let flashcardId = req.params.flashcardId;
            // return res.json(flashcardId);
            flashcards.update({_id: flashcardId}, {$set: {front: req.body.front, back: req.body.back}}, {upsert: true}, function (err, num){
                if (err) return res.status(500).send(err);
                return res.json(num);
            });
        });

        // ADD
        // Update streak
        // works
        app.patch('/api/users/:userId/decks/:deckId/flashcards/:flashcardId/streak/', function (req, res, next) {
            let flashcardId = req.params.flashcardId;
            let val = req.body.value;
            flashcards.findOne({_id: req.params.flashcardId}, function(err, flashcard) {
                if (err) return res.status(500).send(err);
                if (flashcard.streak == 0 && val == -1) {
                return res.json(flashcard);
                }
                flashcards.update({_id: flashcardId}, {$inc: {streak: val}}, {upsert: true}, function (err, num){
                    if (err) return res.status(500).send(err);
                    return res.json(num);
                });
            });
        });

        /*
        #################################
        Conversion methods for uploadFile
        #################################
        */

        // get a pdf file and return the json representation of the pdf
        app.post('/api/pdf/', upload.single('uploaded'), function (req, res, next) {
            let pdf = req.file;
            let dataBuffer = fs.readFileSync(pdf.path);

            pdfParse(dataBuffer).then(function (file) {
                return res.json(file.text);
            }).catch(function (err) {
                if (err) return res.status(500).send(err);
            });
        });

        // ADD
        // same as above but for docx
        app.post('/api/docx/', upload.single('uploaded'), function (req, res, next) {
            let docx = req.file;
            let dataBuffer = fs.readFileSync(docx.path);
            try {
                mammoth.extractRawText(dataBuffer).then(function (text) {
                    return res.json(text.value);
                }).done();
            } catch (e) {
                if (e) return res.status(500).send('Unsupported File');
            }
        });

        // ADD
        // same as before but for .txt
        // https://stackoverflow.com/questions/31657501/reading-and-extracting-data-from-a-text-file-in-javascript
        app.post('/api/txt/', upload.single('uploaded'), function (req, res, next) {
            let txt = req.file;
            fs.readFile(txt.path, 'utf8', function (err, text) {
                if (err) res.status(500).send(err);
                return res.json(text.toString());
            });
        });

        app.post('/', function (req, res, next) {
            res.json(req.body);
            next();
        });

        app.use(express.static('static'));

        const http = require('http');

        if (process.env.NODE_ENV === 'production') {
            app.use(express.static(__dirname + '/public/'));
            app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
        }

        const PORT = process.env.PORT || 3000;

        http.createServer(app).listen(PORT, function (err) {
            if (err) console.log(err);
            else console.log("HTTP server on http://localhost:%s", PORT);
        });
})
.catch(error => console.error(error));