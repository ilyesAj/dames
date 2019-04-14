const largeur_mat = 10;
const rouge = 1;
const gris = -1;

function init_mat() {
    var matrice = []
    for (var i = 0; i < largeur_mat; i++) {
        if (i <= 3) {
            //remplissage rouge
            matrice[i] = [rouge, rouge, rouge, rouge, rouge];
        } else if (i == 4 || i == 5)
            matrice[i] = [0, 0, 0, 0, 0];
        else
            matrice[i] = [gris, gris, gris, gris, gris];
    }
    return matrice;
}

function affiche_mat(matrice) {
    console.log("1 c'est les rouges ,- 1 c'est les gris ");
    for (var i = largeur_mat - 1; i >= 0; i--) {
        var row = "";
        if (i % 2 === 0)
            row = '  X   ';
        else
            row = " ";
        for (var j = 0; j < 4; j++) {
            row += matrice[i][j] + ',X,';
        }
        if (i % 2 === 0)
            row += matrice[i][4];
        else
            row += matrice[i][j] + ',X';
        console.log(i + "=" + row);
    }
}

function estvide(position) {
    if (matrice[position[0]][position[1]] !== 0) {
        // console.log("pas vide "+ position[0] +"||"+position[1] +"||"+matrice[position[0]][position[1]] );
        return false;

    } else {
        //console.log("est vide "+ position[0] +"||"+position[1]);
        return true;
    }
}

function casepossibleH(cap, position, mange) {
    // cases jouable du bas vers le haut en mangeant mange 
    // console.log("[haut]possibilite sur "+position);
    var poss = []; // position a retourner 
    var apres_cap = []; // positions apres capture 
    console.log('je test =[' + (position[0] + 1), position[1] + ']' + "or" + '[' + (position[0] + 1) + ',' + (position[1] + 1));
    if (position[0] + 1 < largeur_mat) {
        if (estvide([position[0] + 1, position[1]]))
            poss.push([position[0] + 1, position[1]]);
        else if (matrice[position[0] + 1][position[1]] === mange)
            capturableH(cap, poss, apres_cap, position, [position[0] + 1, position[1]]);
        //console.log("test");
        if (position[0] % 2 !== 0 && position[1] - 1 >= 0) {
            if (estvide([position[0] + 1, position[1] - 1]))
                poss.push([position[0] + 1, position[1] - 1]);
            else if (matrice[position[0] + 1][position[1] - 1] === mange)
                capturableH(cap, poss, apres_cap, position, [position[0] + 1, position[1] - 1]);
        }
        if (position[0] % 2 === 0 && position[1] + 1 < largeur_mat) {
            console.log('###');

            if (estvide([position[0] + 1, position[1] + 1])) {
                poss.push([position[0] + 1, position[1] + 1]);
            } else if (matrice[position[0] + 1][position[1] + 1] === mange)
                capturableH(cap, poss, apres_cap, position, [position[0] + 1, position[1] + 1]);
        }

    }
    //obliger le joueur a jouer la capture 
    console.log("captured " + apres_cap.length + "pions");
    if (apres_cap.length !== 0)
        return apres_cap
    else
    if (poss.length !== 0)
        return poss;
    else
        return null;
}

function capturableH(cap, poss, apres_cap, intial, capture) {
    //simple capture du bas vers le hautù
    var existe = false; //verifier si dupliqué

    var j = 0;

    while (j < cap.length && !existe) {
        //console.log(" je compare " +capture+ " ==" + cap[j]);
        if (cap[j][0] === capture[0] && cap[j][1] === capture[1]) {
            console.log("existe deja ");
            existe = true;
        }
        j++;
    }
    // console.log("[H]begin with "+intial+" and "+capture);
    if (!existe) {
        console.log("includes =" + cap.includes(capture));
        if (intial[0] % 2 === 0) {
            if (intial[1] < capture[1]) {
                //diagonale droite 
                if (estvide([intial[0] + 2, intial[1] + 1])) {
                    console.log("on capture " + capture);
                    cap.push(capture);
                    apres_cap.push([intial[0] + 2, intial[1] + 1]);
                }
            } else if (intial[1] === capture[1]) {
                //diagonale gauche 
                if (estvide([intial[0] + 2, intial[1] - 1])) {
                    console.log("on capture " + capture);
                    // on capture
                    cap.push(capture);
                    apres_cap.push([intial[0] + 2, intial[1] - 1]);
                }
            } else {
                console.log("pas de capture");
            }
        } else {
            if ((intial[1] > capture[1])) {
                //diagonale gauche 
                if (estvide([intial[0] + 2, intial[1] - 1])) {
                    console.log("on capture " + capture);
                    cap.push(capture);
                    apres_cap.push([intial[0] + 2, intial[1] - 1]);

                }
            } else if (intial[1] === capture[1]) {
                //diagonale droite
                if (estvide([intial[0] + 2, intial[1] + 1])) {
                    console.log("on capture " + capture);
                    cap.push(capture);
                    apres_cap.push([intial[0] + 2, intial[1] + 1]);
                }
            } else
                console.log("pas de capture");

        }
    }
}

function casepossibleB(cap, position, mange) {
    // cases jouable du haut vers le bas en mangeant mange 
    // console.log("[bas]possibilite sur "+position+"za"+position[0]+","+position[1]);

    var poss = [];
    var apres_cap = []; // positions apres capture 
    if (position[0] - 1 >= 0) {
        if (estvide([position[0] - 1, position[1]]))
            poss.push([position[0] - 1, position[1]]);
        else if (matrice[position[0] - 1][position[1]] === mange)
            capturableB(cap, poss, apres_cap, position, [position[0] - 1, position[1]]);
        if (position[1] + 1 < largeur_mat) {
            if (position[0] % 2 === 0) {
                if (estvide([position[0] - 1, position[1] + 1]))
                    poss.push([position[0] - 1, position[1] + 1]);
                else if (matrice[position[0] - 1][position[1] + 1] === mange)
                    capturableB(cap, poss, apres_cap, position, [position[0] - 1, position[1] + 1]);
            } else if (position[0] % 2 !== 0) {
                if (estvide([position[0] - 1, position[1] - 1]))
                    poss.push([position[0] - 1, position[1] - 1]);
                else if (typeof matrice[position[0] - 1][position[1] - 1] !== 'undefined' && matrice[position[0] - 1][position[1] - 1] === mange)
                    capturableB(cap, poss, apres_cap, position, [position[0] - 1, position[1] - 1]);
            }
        }
    }
    //obliger le joueur a jouer la capture 
    console.log("captured " + apres_cap.length + " pions");
    if (apres_cap.length !== 0)
        return apres_cap
    else
    if (poss.length !== 0)
        return poss;
    else
        return null;

}

function capturableB(cap, poss, apres_cap, intial, capture) {
    //simple capture du haut vers le bas 
    var existe = false; //verifier si dupliqué
    var j = 0;

    while (j < cap.length && !existe) {
        //console.log(" je compare " +capture+ " ==" + cap[j]);
        if (cap[j][0] === capture[0] && cap[j][1] === capture[1]) {
            console.log("existe deja ");
            existe = true;
        }
        j++;
    }
    // console.log("[B]begin with "+intial+" and "+capture);
    if (!existe) {
        if (intial[0] % 2 === 0) {
            if (intial[1] < capture[1]) {
                //diagonale gauche 
                if (estvide([intial[0] - 2, intial[1] + 1])) {
                    // console.log("[pg]on capture "+capture + "nv pos="+[intial[0]-2,intial[1]+1]);
                    // on capture
                    cap.push(capture);
                    apres_cap.push([intial[0] - 2, intial[1] + 1]);
                }

            } else if (intial[1] === capture[1]) {
                //diagonale droite 
                if (estvide([intial[0] - 2, intial[1] - 1])) {
                    // console.log("[pd]on capture "+capture+ "nv pos="+[intial[0]-2,intial[1]-1]);
                    cap.push(capture);
                    apres_cap.push([intial[0] - 2, intial[1] - 1]);
                }
            } else {
                console.log("pas de capture");
            }
        } else {
            if ((intial[1] > capture[1])) {
                //diagonale droite
                if (estvide([intial[0] - 2, intial[1] - 1])) {
                    // console.log("[ipd]on capture "+capture +" nv pos= "+[intial[0]-2,intial[1]-1]);
                    cap.push(capture);
                    apres_cap.push([intial[0] - 2, intial[1] - 1]);
                }

            } else if (intial[1] === capture[1]) {
                //diagonale gauche 
                if (estvide([intial[0] - 2, intial[1] + 1])) {
                    //console.log("[ipg]on capture "+capture+" nv pos= "+[intial[0]-2,intial[1]+1]);
                    cap.push(capture);
                    apres_cap.push([intial[0] - 2, intial[1] + 1]);
                }
            } else
                console.log("pas de capture");

        }
    }
}

function coup_possible(position, joueur) {
    // peut etre former soit de possibilité de cases 
    //soit un coup de capture (simple double ....)
    var cap = []; //captures
    var parcoursCapture = [];
    var nextcoup = [];
    var possibilite = []
    var change; //je change de position 
    var choixUser = false; // on peut manger 2 pions ou plus 
    var tmp;
    // premier coup obligatoirement au sens du joueur
    if (joueur === rouge)
        possibilite = casepossibleH(cap, position, gris);
    else
        possibilite = casepossibleB(cap, position, rouge);
    //evaluer les possibilites de capture 
    // obliger le pion a faire le premier coup 
    //console.log("cap="+cap);
    if (cap.length === 1) {
        parcoursCapture.push(position);
        console.log("je change de " + parcoursCapture.slice(-1) + " vers" + possibilite);
        parcoursCapture = parcoursCapture.concat(possibilite);
        nextcoup = nextcoup.concat(possibilite);
        possibilite = []; // je suis obligé de suivre le parcours pas de possibilite 
        change = true;
    } else if (cap.length > 1) {
        choixUser = true;
        console.log("on a " + cap.length + " possibilite de capture");
    } else {
        if (possibilite !== null && possibilite.length > 1)
            choixUser = true;
        console.error("pas de capture que des possibilites =" + possibilite);
    }
    while (LengthCap === cap.length && change && !choixUser && nextcoup.length !== 0) {
        choixUser = false;
        change = false;
        var LengthCap = cap.length;
        console.log("j'essaye un " + (cap.length + 1) + " coup je suis a la case " + parcoursCapture.slice(-1));
        nextcoup = [];
        // console.log("dernier position connu ="+ parcoursCapture[parcoursCapture.length-1][0]);
        if (joueur === rouge) {
            tmp = nextCoupValide(casepossibleH(cap, parcoursCapture[parcoursCapture.length - 1], gris), parcoursCapture);
            // console.log(tmp);
            if (tmp.bool) {
                nextcoup = nextcoup.concat(tmp.tab);
                change = true;
            } else {
                console.log("j'essaye un coup  en bas ");
                tmp = nextCoupValide(casepossibleB(cap, parcoursCapture[parcoursCapture.length - 1], gris), parcoursCapture);
                // console.log(tmp);
                if (tmp.bool) {
                    nextcoup = nextcoup.concat(tmp.tab);
                    change = true;
                }
            }
        } else {
            tmp = nextCoupValide(casepossibleH(cap, parcoursCapture[parcoursCapture.length - 1], rouge), parcoursCapture);
            //    console.log(tmp);
            if (tmp.bool) {
                nextcoup = nextcoup.concat(tmp.tab);
                change = true;
            } else {
                console.log("j'essaye un coup  en bas ");
                tmp = nextCoupValide(casepossibleB(cap, parcoursCapture[parcoursCapture.length - 1], rouge), parcoursCapture);
                if (tmp.bool) {
                    nextcoup = nextcoup.concat(tmp.tab);
                    change = true;
                }
            }
        }
        console.log("==" + nextcoup.length + "==" + nextcoup + "cap==" + cap.length)
        if (nextcoup === null)
            nextcoup = [];
        else
        if (change && nextcoup.length === 1) {
            console.log("je change de " + parcoursCapture[parcoursCapture.length - 1] + " vers" + nextcoup + "//");
            parcoursCapture = parcoursCapture.concat(nextcoup);
        } else if (nextcoup.length > 1) {
            console.log(nextcoup);
            choixUser = true;
            possibilite = possibilite.concat(nextcoup);
            //nextCoupValide(tmp,possibilite,parcoursCapture);
        }
    }
    return {
        position,
        possibilite,
        cap,
        parcoursCapture,
        choixUser
    };
    /*
    possibilite= les possibilites qui s'offrent à l'utilisateur
    cap= les pions capturés ou capturable
    parcoursCapture= parcours obligatoire de l'utilisateur proportionnel a cap
    choixUser= true si au bout des capture l'utilisateur doit choisir quel pion capturé 
    /*
  possibilite= les possibilites qui s'offrent à l'utilisateur
  cap= les pions capturés ou capturable
  parcoursCapture= parcours obligatoire de l'utilisateur proportionnel a cap
  choixUser= true si au bout des capture l'utilisateur doit choisir quel pion capturé 
  
  */
}

function nextCoupValide(tab, parcoursCapture) {
    var bool = false;
    //prob passage par valeur 
    if (tab === null || tab.length === 0 || typeof tab === 'undefined')
        return {
            bool,
            tab
        };
    else {
        // console.log("tp="+tab);
        //console.log("prc"+parcoursCapture);
        var i = 0,
            j = 0;
        // verifier duplication et supprimer 
        while (i < tab.length) {
            j = 0;
            bool = false;
            while (j < parcoursCapture.length && !bool) {
                if (parcoursCapture[j][0] === tab[i][0] && parcoursCapture[j][1] === tab[i][1]) {
                    //    console.log(tab[i]+"deleted");
                    //            console.log("before delete ="+tab);
                    if (tab.length === 1)
                        tab = [];
                    else
                        tab = tab.splice(i - 1, 1);
                    //console.log("after delete ="+tab);
                    bool = true;
                }
                j++;
            }
            i++;
        }
        bool = true;
        return {
            bool,
            tab
        };

    }
    //return res;
}

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

function maj_matrice(matrice, positionD, positionF, couleur, capture) {
    //positionD => depart 
    //positionF => pos final 
    matrice[positionD[0]][positionD[1]] = 0;
    if (couleur === 'gris')
        matrice[positionF[0]][positionF[1]] = gris;
    else
        matrice[positionF[0]][positionF[1]] = rouge;
    if (capture.length !== 0)
        for (var i in capture) {
            console.log("je vide " + capture[i]);
            matrice[capture[i][0]][capture[i][1]] = 0;
        }
}

var matrice = init_mat();

module.exports = {
    largeur_mat: largeur_mat,
    rouge: rouge,
    gris: gris,
    matrice: matrice,
    init_mat: init_mat,
    affiche_mat: affiche_mat,
    estvide: estvide,
    casepossibleH: casepossibleH,
    capturableH: capturableH,
    casepossibleB: casepossibleB,
    capturableB: capturableB,
    coup_possible: coup_possible,
    nextCoupValide: nextCoupValide,
    afficher_coup: afficher_coup
};