var pgp = require('pg-promise')();

var db = pgp( {
  host: 'localhost',
  port: 5432,
  database: 'asrcdb',
  user: 'postgres',
  password: '123456'
})

module.exports = {
  execute: (query, params)=>{
    
    console.log('Pg required');

    return db.any(query, params)
    .then(response => {
      //console.log(response);
      return response;
    })
    .catch(error => {
        console.log(error);
    });
  }  
}
