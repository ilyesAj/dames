var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
});
async function createBase () {
await knex.raw(`CREATE TABLE IF NOT EXISTS players (
  login VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
)`);
};
var bcrypt=require('bcrypt');
async function InsertPlayer (name,password) {
  //bcrypt.hash("bacon", null, null, function(err, hash) {
  // Store hash in your password DB.
  knex.raw(`insert into players values (name,password);`);
};

createBase();
InsertPlayer('Chabroul','1234');

knex.raw('SELECT * from players')
  .then(function (rows) {
   console.log('login='+rows[0].login+'password'+rows[0].password);
  
  })
  .catch(function (error) {
    
  });
console.log('done');