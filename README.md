# dames
jeu de dames avec nodeJS express et Mysql

Projet Dame ISTY 
=================
Le projet consiste à réaliser le jeu de Dame en ligne incluantune interface de connexion avec la possibilité
de défier d'autres joueurs.

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` installer toutes les dependences avec cette commende
- `npm run dev` lancer le serveur local

solution cloud : essayer de remixer [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/~3asba-3elasormek)

### ← Dependences 
    "express": "^4.16.4",
    "ws": "^6.2.0",
    "body-parser": "^1.18.3",
    "bson": "^4.0.2",
    "socket.io": "^2.2.0",
    "sqlit": "^1.9.0",
    "knex": "^0.16.5",
    "sqlite3": "^4.0.6",
    "bcrypt": "^3.0.5"

# Code Overview

### ← jeu.html
Fichier conteant l'interface de jeu. Sur cette page va se dérouler tous les traitements pour la gestion
du jeu.

### ← Connexion.html
La page de connexion contenant un formulaire qui permet soit de faire l'inscription soit se connecter.
Aprés etre identifié vous serez rediriger vers une page contenant les chambres disponibles pour pouvoir
défier d'autres joueurs

### ← styleConnexion.css
Contenant le style et les mouvements de la page de connexion 

### ← script.js
la partie client ou le coeur du front-end
il permet de créer , mettre à jour la table de jeu

### ← db_init.js
Creation de la base de données 

### ← db_select_fields.js
Permet de visualiser la table players

### ← algo.js
C'est le coeur du jeu de dames toute la gestion des pions , les calculs de possibilités , les calculs de captures ...
nous l'avons importer comme etant un module avec require()

### ← server.js
c'est la partie serveur 
il permet de faire les routes des pages html ainsi que la gestion des sockets io 

### ← package.json
Fichier contenant la liste des packages utilisées durant ce projet citons : 
    body-parser
    socket.io
    knex
    sqlite3


Made by  ilyes Ajroud iyed Cheberli
-------------------
