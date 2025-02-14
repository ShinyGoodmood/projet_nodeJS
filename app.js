const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/auth', routes);

const port = 3000;

// --------------------------------------------------------------------------------

app.get('/test', (req, res) => {
    res.json('hello');
});

app.use('/', routes);
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

// --------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
