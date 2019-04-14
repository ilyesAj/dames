var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: false,
});

//InsertPlayer('faa','11');
async function show(){
knex.raw('SELECT * from players')
  .then(function (rows) {
  console.log('rows='+rows.length);
  for (var r in rows) {
   console.log('login='+rows[r].login+'password'+rows[r].password);
  }
});
console.log('Done');
}
show();