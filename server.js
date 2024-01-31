const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

const serviceAccount = require('SERVICE_ACCOUNKEY'); // serviceAccountKey.json for you
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'URL_DATABASE' // URL for Firebase Realtime Database
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const db = admin.database();
    const ref = db.ref('data');
    ref.once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        res.render('index', { data: data });
      } else {
        res.send('No data available');
      }
    }, error => {
      res.send('Error: ' + error);
    });
});

app.post('/add', (req, res) => {
    const data = req.body;
    const db = admin.database();
    const ref = db.ref('data');
    ref.push(data)
      .then(() => {
        res.redirect('/');
      })
      .catch(err => {
        res.send('Error: ' + err);
      });
});

app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    const db = admin.database();
    const ref = db.ref('data/' + id);
    ref.set(newData)
      .then(() => {
        res.redirect('/');
      })
      .catch(err => {
        res.send('Error: ' + err);
      });
});

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    const db = admin.database();
    const ref = db.ref('data/' + id);
    ref.remove()
      .then(() => {
        res.redirect('/');
      })
      .catch(err => {
        res.send('Error: ' + err);
      });
});

app.listen(port, () => {
    console.log('Server is running');
});