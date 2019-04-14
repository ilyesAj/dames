const express = require('express');
const app = express();
var http = require('http');
var algo = require('./algo');
var server = http.createServer(app);
var bcrypt = require('bcrypt');
app.use('/', express.static('public'));
app.use(express.static('public'));




//-------------connexion BD------------------
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    useNullAsDefault: true,
    debug: true,
});
//-------------------------------------------



var connected_users = [];
async function InsertPlayer(name, password) {
    //bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
    await knex.raw("insert into players values (?,?)", [name, password]);
};

//------------login page --------------------
app.get('/login', function(request, response) {
    response.sendFile(__dirname + '/public/Connexion.html');
});
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/Connexion.html');
});


//-----------register button ----------------
app.get('/register', function(req, res) {
    knex.raw("SELECT * FROM players WHERE login=? AND password=?", [req.query.login, req.query.password])
        .then(function(rows) {
            var trouve = false;
            var i = 0;
            while (i < rows.length && !trouve) {
                if (req.query.login == rows[i].login && req.query.password == rows[i].password)
                    trouve = true;
            }
            if (trouve) {
                // alert('already registred');
                res.send("<h1>already registred<h1> <br> <a href=https://3asba-3elasormek.glitch.me/login>Retour à la page de connexion</a>");
            } else {
                InsertPlayer(req.query.login, req.query.password);
                //alert("Bonjour  "+req.query.login+'pass='+req.query.password+ 'merci de vous connecter maintenant ');
                res.send("Bonjour " + req.query.login + 'pass=' + req.query.password + 'merci de vous connecter maintenant ');
                //res.redirect('/public/Connexion.html')
            }
        })
        .catch(function(error) {
            console.log(error);
        });
});


//----------connection--------------------
app.get('/connected', function(req, res) {
    var mmessage = {
        message: '',
        data: ''
    };
    knex.raw("SELECT * FROM players WHERE login=? AND password=?", [req.query.login, req.query.password])
        .then(function(rows) {
            var trouve = false;
            var i = 0;
            while (i < rows.length && !trouve) {
                if (req.query.login == rows[i].login && req.query.password == rows[i].password)
                    trouve = true;
            }
            if (trouve) {
                connected_users.push(req.query.login);
                res.send("<a href=https://3asba-3elasormek.glitch.me/list> <h1> chambres disponibles </h1> </a>");
            } else {
                res.send('<h1> Login ou Mot de passe incorrect <h1> <br> <a href=https://3asba-3elasormek.glitch.me/login>Retour à la page de connexion</a> ');
            }
        })
        .catch(function(error) {
            console.log(error);
        });
});


//-----------------joueurs connectées ----------------
app.get('/list', function(req, res) {
    var a = '<br><a href=https://3asba-3elasormek.glitch.me/jeu.html>';
    for (var i in connected_users) {
        a += connected_users[i] + '</a><br>' + '<a href=https://3asba-3elasormek.glitch.me/jeu.html>';
    }
    a += '</a>';
    res.send("<meta http-equiv=\"refresh\" content=\"5\"; URL=\"https://3asba-3elasormek.glitch.me/list\">" + "<h1>Chambres disponibles :<h1>" + a);
});
//----------------------------------------------------
var ID = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
};
//----------------main -------------------

//socket io 
var p = [];
var id = [];
var coup;
var nb = 1;
var io = require('socket.io').listen(server);
var p1 = {
    id: '',
    color: ''
};
var p2 = {
    id: '',
    color: ''
};

io.on('connection', function(socket) {
    // first connection
    //-----------------gestion de connexion-----------
    if (nb == 1) {
        p1 = {
            id: '',
            color: ''
        };
        p2 = {
            id: '',
            color: ''
        };
        if (p1['id'] === '') {
            p1['id'] = ID();
            p1['color'] = 'rouge';
            console.log('p1==' + p1.id);
            socket.emit('idalert', {
                id: p1.id,
                color: p1.color
            });
            nb++;
        }
    } else if (nb == 2)
        if (p2['id'] === '') {
            p2['id'] = ID();
            p2['color'] = 'gris';
            console.log('p2==' + p2.id);
            socket.emit('idalert', {
                id: p2.id,
                color: p2.color
            });
            nb++;
        }
    else {
        //rejet other connection 
        socket.close();
    }
    //----------------------------------------------


    //-------------------turn---------------
    var Turn = p1;
    console.log('Turn=', Turn);
    io.emit('Turn', Turn);
    //update turn
    socket.on('EOFTurn', function(message) {
        console.log('c\'est le tour de ');

        if (message.id === p1.id)
            Turn = p2;
        else if (message.id === p2.id)
            Turn = p1;
        io.emit('Turn', Turn);
    });
    //--------------------------------------


    // ----------possibilite---------------
    socket.on('position', function(message) {
        console.log(message.id + ' a envoyé ' + message.i + ',,' + message.j);
        p.push([parseInt(message.i), parseInt(message.j)]);
        //console.log("tf"+p);
        if (message.color === 'gris')
            coup = algo.coup_possible([parseInt(message.i), parseInt(message.j)], algo.gris);
        else
            coup = algo.coup_possible([parseInt(message.i), parseInt(message.j)], algo.rouge);

        // send back possibilities
        socket.emit('possibilite', coup);
    });
    //------------------------------------
    //------------maj clients+ gagnant --------------

    // update position 
    socket.on('changepos', function(message) {
        //updating matrix
        var positionD = [message.idep, message.jdep];
        var positionF = [message.i, message.j];
        algo.matrice[positionD[0]][positionD[1]] = 0;
        if (message.color === 'gris')
            algo.matrice[positionF[0]][positionF[1]] = algo.gris;
        else
            algo.matrice[positionF[0]][positionF[1]] = algo.rouge;
        console.log("chage matrice depart=" + positionD + "=" + algo.matrice[positionD[0]][positionD[1]] + "arrive" + positionF + "=" + algo.matrice[positionF[0]][positionF[1]]);
        // algo.affiche_mat(algo.matrice);
        //broadcasting
        socket.broadcast.emit('changepos', message);
    });
    var pions_capture_rouge = 0;
    var pions_capture_gris = 0;
    socket.on('majcapture', function(message) {
        var positionF = [message.i, message.j];
        algo.matrice[positionF[0]][positionF[1]] = 0;
        socket.broadcast.emit('majcapture', message);
        if (message.color === 'gris') {
            pions_capture_gris++;
            console.log("Nombre d epion gris capturé " + pions_capture_gris);
        } else {
            pions_capture_rouge++;
            console.log('nb rouge capture' + pions_capture_rouge);
        }
        if (pions_capture_gris >= 20) {
            io.emit('gagnant', p2);
        } else if (pions_capture_rouge >= 20) {
            io.emit('gagnant', p1);
        }
    });
    //--------------------------------------------
});
console.log(id);
//-----------------------------------------------------
//https://playcode.io/277034?tabs=console&script.js&output
// don't touch the listner 
var listener = server.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});