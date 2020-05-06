var pgp = require('pg-promise')();
var pgconfig = require('./pgconfig');
pgp.pg.types.setTypeParser(1114, (value)=>{
  // console.log(value);
  return value;
});

var db = pgp( pgconfig.config );

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
