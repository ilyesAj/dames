//-------------connexion--------------
var io = io();
var id = null;
var autoColor;
var socket = io.connect(location.host);
io.on('idalert', function(message) {
    //alert('my id is '+message);
    console.log(message);
    id = message.id;
    autoColor = message.color;
});
//---------------------------------



//-----------------Affichage debug----------------
function afficher_coup(coup) {
    console.log(coup);
    var i = 0,
        j = 0;
    var str = "";
    if (coup.possibilite !== null)
        //parcours capture
        if (coup["parcoursCapture"].length !== 0) {
            while (i < coup["parcoursCapture"].length) {
                str += coup["parcoursCapture"][i]
                if (i < coup["parcoursCapture"].length - 1)
                    str += "=>||" + coup["cap"][i] + "||=>";
                i++;
            }
            //des possibilités de captures s'il existe
            if (coup["choixUser"]) {
                str += "=>//choix : ";
                for (i in coup["possibilite"])
                    str += "[" + coup["possibilite"][i] + "]|";
                console.log("////");
            }
        } else {
            // possibilité avec capture 
            if (coup["cap"].length !== 0)
                while (i < coup["possibilite"].length) {
                    str += "[" + coup["position"] + "]" + "=>||[" + coup["cap"][i] + "]||" + "=>" + "[" + coup["possibilite"][i] + "]";
                    //pour eviter d'afficher OR a la fin 
                    if (i < coup["possibilite"].length - 1)
                        str += "  OR  ";
                    i++;
                }
            else
                //possibilité sans capture 
                while (i < coup["possibilite"].length) {
                    str += "[" + coup["possibilite"][i] + "]";
                    if (i < coup["possibilite"].length - 1)
                        str += "  OR  ";
                    i++;
                }

        }
    else
        console.log("NO possibilities");
    console.log(str);

}
//---------------------------------------------


function handle_click(event) {
    var target = event.target;
    var td = target.closest('td');
    var col = td.index;
    var row = td.closest('tr').index;
    alert(col);
}

function tableCreate() {
    var color = 1;
    var body = document.body;
    var tbl = document.createElement('table');
    tbl.id = "Table";
    tbl.style.width = '600px';
    tbl.style.border = '10px solid black';
    for (var i = 0; i < 10; i++) {
        var tr = tbl.insertRow();
        var r = 0;
        if (color == 1) color = 0;
        else color = 1;
        for (var j = 0; j < 10; j++) {
            var td = tr.insertCell();
            if (color == 1) {
                td.style.backgroundColor = "black";
                td.id = "";
                color--;
            } else {
                td.style.backgroundColor = "gray";
                td.id = "gris";
                var x = (9 - i).toString() + r.toString();
                td.dataset.column = x;
                r++;
                color++;
            }
            td.style.width = "70px";
            td.style.height = "70px";
        }
    }
    tbl.style.tableLayout = "fixed";
    body.appendChild(tbl);
}

function ajouterPion() {
    var pos = 0;
    var table = document.getElementById("Table");
    var ligne = table.rows;
    var longueur = ligne.length;
    //Joueur en haut
    for (var i = 0; i < 4; i++) {
        var colonne = ligne[i].cells;
        var largeur = colonne.length;
        if (pos == 1) pos = 0;
        else pos = 1;
        for (var j = 0; j < largeur; j++) {
            if (pos == 1) {
                var img = document.createElement('img');
                img.src = "https://cdn.glitch.com/716b0ec5-ff94-41bf-9ce6-cd887ff4f650%2Fnoir.png?1553686233895";
                img.id = "gris";
                img.value = colonne[j].dataset.column;
                img.style.width = "65px";
                img.style.height = "65px";
                colonne[j].appendChild(img);
                colonne[j].id = "gris";

                pos--;
            } else
                pos++;
        }
    }
    //Joueur en bas
    for (var i = 6; i < 10; i++) {
        var colonne = ligne[i].cells;
        var largeur = colonne.length;
        if (pos == 1) pos = 0;
        else pos = 1;
        for (var j = 0; j < largeur; j++) {
            if (pos == 1) {
                var img = document.createElement('img');
                img.src = "https://cdn.glitch.com/716b0ec5-ff94-41bf-9ce6-cd887ff4f650%2Frouge.png?1553686947782"
                img.style.width = "65px";
                img.style.height = "65px";
                img.id = "rouge"
                img.value = colonne[j].dataset.column;
                colonne[j].appendChild(img);
                colonne[j].id = "rouge";
                pos--;
            } else
                pos++;
        }
    }
}

var selectpion = 0;
var color;
var toremove;

function ajouter_pion(element, color, value) {
    var img = document.createElement('img');
    img.style.width = "65px";
    img.style.height = "65px";
    img.value = value;
    if (color == "rouge") {
        img.src = "https://cdn.glitch.com/716b0ec5-ff94-41bf-9ce6-cd887ff4f650%2Frouge.png?1553686947782"
        img.id = "rouge"
        element.id = "rouge";
    } else {
        img.src = "https://cdn.glitch.com/716b0ec5-ff94-41bf-9ce6-cd887ff4f650%2Fnoir.png?1553686233895";
        img.id = "gris";
    }
    element.appendChild(img);
}

function testerDame() {
    var table = document.getElementById("Table");
    var ligne = table.rows;
    var colonne = ligne[1];
    var largeur = colonne.length;
    for (var j = 0; j < largeur; j++) {
        console.log("HEREEEEEE");
        if (colonne[j].id == "gris") {
            colonne[j].removeChild(colonne[j].firstChild);
        }
    }
}

//-------------------------------DEROULEMENT DU JEU ----------------------

//Initialisation
var idepart, jdepart, iarrive, jarrive, pos, ichoix, jchoix1, jchoix2;
var icapture, jcapture, capremove;
var possib;
var tour;
var tmp; // t es entrain de change jdepart !
var index = undefined;
var indice = 0;
var change;
//------Socket Tour ------
socket.on("Turn", function(message) {
    tour = message.id;
    console.log("C'est le tour de " + message.id)
});
//--------------------

function action(e) //Gestion de l'action de clique
{
    //Le joueur doit d'abord selectionné un pion 
    var table = document.getElementById("Table");
    var ligne = table.rows;
    var colonne;
    //testerDame();
    console.log("Utilisation de la couleur " + autoColor);
    console.log("Pion cliqué" + e.target.id)
    if (tour == id)
        if (e.target.id == autoColor || selectpion == 1) {
            if ((e.target.dataset.column) == undefined) //Si le joueur a cliqué sur un pion
            {
                if (selectpion == 0) //Premier clique sur pion
                {
                    console.log("pion " + e.target.id + " selectionné il faut choisir la position");
                    var x = e.target.value;
                    color = e.target.id;
                    idepart = parseInt(x[0]);
                    jdepart = parseInt(x[1]);
                    tmp = parseInt(x[1]);
                    console.log("j'envoie");
                    socket.emit('position', {
                        id: id,
                        i: x[0],
                        j: x[1],
                        color: color
                    });
                    console.log("idepart " + idepart);
                    console.log("jdepart " + jdepart);
                    toremove = ligne[9 - idepart].cells;
                    console.log("ICI " + (9 - idepart));
                    //Pour 0 et 1 faut verifier
                    if ((idepart) % 2 == 1) {
                        toremove = toremove[jdepart * 2];
                        jdepart = jdepart * 2;
                        console.log("D1" + jdepart);
                    } else {
                        toremove = toremove[jdepart * 2 + 1];
                        jdepart = jdepart * 2 + 1;
                        console.log("D2" + jdepart);
                    }

                    socket.on('possibilite', function(message) {
                        afficher_coup(message);
                        if (message["possibilite"] == null) {
                            console.log("NOOOOOOOO");
                            change = 1;
                        } else

                        if (message["possibilite"].length == 1) {
                            ichoix = parseInt(message.possibilite[0][0]);
                            jchoix1 = parseInt(message.possibilite[0][1]);
                        } else
                        if (message["possibilite"].length == 2) {
                            ichoix = parseInt(message.possibilite[0][0]);
                            jchoix1 = parseInt(message.possibilite[0][1]);
                            jchoix2 = parseInt(message.possibilite[1][1]);
                        } else
                        if (message["parcoursCapture"].length != 0) {
                            ichoix = parseInt(message.parcoursCapture[1][0]);
                            jchoix1 = parseInt(message.parcoursCapture[1][1]);
                            icapture = parseInt(message.cap[0][0]);
                            jcapture = parseInt(message.cap[0][1]);
                            capremove = ligne[9 - icapture].cells;
                            if ((icapture) % 2 == 1) {
                                capremove = capremove[jcapture * 2];
                                capremove.style.backgroundColor = "red";
                            } else {
                                capremove = capremove[jcapture * 2 + 1];
                                capremove.style.backgroundColor = "red";
                            }
                        }
                        if (change == undefined) //
                        {
                            if (capremove != undefined)
                                console.log("a supprimer la case" + icapture + "/" + jcapture + "Couleur " + capremove.id);
                            let j1 = jchoix1;
                            let j2 = jchoix2;
                            possib = message.possiblite;
                            pos = ligne[9 - ichoix].cells;
                            console.log('possibilite' + (message));
                            if (ichoix % 2 == 1) {
                                j2 = j2 * 2;
                                j1 = j1 * 2;
                            } else {
                                j2 = j2 * 2 + 1;
                                j1 = j1 * 2 + 1;
                            }
                            if (pos[j1] != undefined)
                                pos[j1].style.backgroundColor = "yellow";
                            if (pos[j2] != undefined)
                                pos[j2].style.backgroundColor = "yellow";
                        }
                    });
                    selectpion = 1;
                }
            } else {
                console.log(change);
                if (selectpion == 1 && change == undefined) //Deuxiéme clique sur la position 
                {
                    var choix;
                    var y = e.target.dataset.column;
                    iarrive = parseInt(y[0]);
                    jarrive = parseInt(y[1]);
                    console.log(ichoix + "=" + iarrive + "|" + jchoix2 + "=" + jarrive);
                    if (jchoix2 == jarrive || jchoix1 == jarrive) {
                        console.log("Bon choix !");
                        choix = 1;
                    } else {
                        console.log("Mauvais choix");
                        choix = 0;
                    }

                    //--------------------Socket-----------------
                    console.log("id=" + id + "de" + idepart + ',' + tmp + "Position [" + iarrive + " , " + jarrive + "] choisie color=" + color);
                    socket.emit('changepos', {
                        id: id,
                        idep: idepart,
                        jdep: tmp,
                        i: iarrive,
                        j: jarrive,
                        color: color
                    });
                    if (capremove != undefined)
                        socket.emit('majcapture', {
                            id: id,
                            i: icapture,
                            j: jcapture,
                            color: capremove.id
                        });
                    //-----------------Socket -------------------
                    colonne = ligne[9 - iarrive].cells;
                    if (iarrive % 2 == 1) {
                        jarrive = jarrive * 2;
                    } else {
                        jarrive = jarrive * 2 + 1;
                    }
                    ajouter_pion(colonne[jarrive], color, e.target.dataset.column);
                    console.log("NODE " + toremove.firstChild.nodeName);
                    toremove.removeChild(toremove.firstChild);
                    if (capremove != undefined) {
                        console.log("Color =" + capremove.id);
                        capremove.style.backgroundColor = "gray";
                        capremove.removeChild(capremove.firstChild);
                        capremove = undefined;
                    }
                    if (ichoix % 2 == 1) {
                        jchoix2 = jchoix2 * 2;
                        jchoix1 = jchoix1 * 2;
                    } else {
                        jchoix2 = jchoix2 * 2 + 1;
                        jchoix1 = jchoix1 * 2 + 1;
                    }
                    if (pos[jchoix1] != undefined)
                        pos[jchoix1].style.backgroundColor = "gray";
                    if (pos[jchoix2] != undefined)
                        pos[jchoix2].style.backgroundColor = "gray";
                    selectpion = 0;
                } else {
                    selectpion = 0;
                    change = undefined;
                }
                idepart = undefined;
                jdepart = undefined;
                iarrive = undefined;
                jarrive = undefined;
                pos = undefined;
                ichoix = undefined;
                jchoix1 = undefined;
                jchoix2 = undefined;
                icapture = undefined;
                jcapture = undefined;
                capremove = undefined;
                //----------Socket fin du tour -------
                socket.emit('EOFTurn', {
                    id: id,
                    color: autoColor
                });
                //---------------------
            }

        }
    else {
        console.log("ce n'est pas ta couleur" + autoColor);
    }

}

function ajoutListener() {
    var tbl = document.getElementById("Table");
    tbl.addEventListener('click', action);
}

tableCreate();
ajouterPion();
ajoutListener();
//-----------------socket changement de position de pion joueur adverse --------
socket.on('changepos', function(message) {
    console.log('changepos de ' + message.id + 'pos=' + message.i + ',' + message.j);
    console.log("Depart = " + message.idep + "|" + parseInt(9 - message.jdep));
    let i = message.i;
    let j = message.j;
    if (i % 2 == 1) {
        j = j * 2;
    } else {
        j = j * 2 + 1;
    }
    var table = document.getElementById("Table");
    var ligne = table.rows;
    var colonne;
    colonne = ligne[9 - i].cells;
    if (autoColor == "rouge")
        color = "gris";
    else
        color = "rouge";
    ajouter_pion(colonne[j], color, colonne[j].dataset.column);

    colonne = ligne[9 - parseInt(message.idep)].cells;

    if (parseInt(message.idep) % 2 == 1) {
        colonne[message.jdep * 2].removeChild(colonne[message.jdep * 2].firstChild);
    } else {
        colonne[message.jdep * 2 + 1].removeChild(colonne[message.jdep * 2 + 1].firstChild);
    }

});
//-----------------------------------------------

//--------------------------Socket capture de pion du joueur adverse --------
socket.on('majcapture', function(message) {
    console.log('capture par ' + message.id + ' de pos=' + message.i + ',' + message.j);
    var table = document.getElementById("Table");
    var ligne = table.rows;
    var colonne;
    let i = message.i;
    let j = message.j;
    if (i % 2 == 1) {
        j = j * 2;
    } else {
        j = j * 2 + 1;
    }
    colonne = ligne[9 - i].cells;
    colonne = ligne[9 - i].cells;
    colonne[j].removeChild(colonne[j].firstChild);

});

//-------------------- Socket Gagnant ---------
socket.on("gagnant", function(message) {
    if (message.id == id)
        alert("Vous etes le gagnant !!!");
    else
        alert("Ton adversaire a gagné !!!!!");
});

/*
  possibilite= les possibilites qui s'offrent à l'utilisateur
  cap= les pions capturés ou capturable
  parcoursCapture= parcours obligatoire de l'utilisateur proportionnel a cap
  choixUser= true si au bout des capture l'utilisateur doit choisir quel pion capturé 
  
*/