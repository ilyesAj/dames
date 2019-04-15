# dames
jeu de dames avec nodeJS express et Mysql

Projet Dame ISTY 
=================
Le projet consiste à réaliser le jeu de Dame en ligne multi-user multi-room incluant une interface de connexion avec la possibilité
de défier d'autres joueurs.
Nous avons utilisés Socket.io pour le Handshake Client-serveur 
# Getting started

Pour lancer le serveur Node en local:

- Clone this repo
- `npm install` installer toutes les dependences avec cette commende
- solution cloud : essayer de remixer [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/~3asba-3elasormek)

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
l'interface de jeu.

### ← Connexion.html
La page de connexion contenant le formulaire qui permet soit de faire l'inscription soit de se connecter.
Aprés être identifié vous serez rediriger vers une page contenant les chambres disponibles pour pouvoir
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
# Amelioration 
* Securisation du mot de passe saisie par l'uilisateur avec  
  - Changer les requetes get en post
  - Crypter le pwd brut dans tout l'acheminement vers la base de données 
  - Utilisation de systeme de token pour evité le Man in The Middle
* Amélioration de la communication client-serveur-client pour la page de connexion 
  - Utilisation des requétes AJAX et des données json pour l'echange et la vérification du formulaire 
* Ajout de la fonctionnalités multi-room
  - Le code est modulaire et peut intégrer le mode multi-room 
  


Made by  ilyes Ajroud iyed Cheberli
-------------------
