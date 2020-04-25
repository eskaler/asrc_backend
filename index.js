const express = require('express')
var cors = require('cors')
const app = express()
var pg = require('./pg');
var sql = require('./sql');
const port = 3000

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/object/all', function(req, res) {
  pg.execute(sql.objectsAll).then(response=>{
    res.send(response);
  });
})

app.get('/event/:dateFrom/:dateTo/data', async function(req, res) {
  var query = `SELECT * FROM events where date_time >= $1 and date_time <= $2;`;  
  console.log(query)     ;
  var data = await pg.execute(query, [req.params.dateFrom, req.params.dateTo]);
  res.send(data);
})

app.get('/object/:tableName/description', function(req, res) {
  pg.execute(sql.objectDescription, [req.params.tableName]).then(response=>{
    res.send(response);
  });
})

app.get('/object/:tableName/data', async function(req, res) {
  pg.execute(sql.objectDescription, [req.params.tableName]).then(async (columns) => {
    var data = {};

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      var query = `SELECT "${column.columnname}" FROM "${column.tablename}";`;       
      data[column.columnname] = await pg.execute(query).then(columnData=>{
            var response = [];
            for (let j = 0; j < columnData.length; j++) {
              response.push(columnData[j][column.columnname]);
            }
            return response;
          })        
      }
    res.send(data);
  });
})

app.get('/object/:tableName/:columnName/:dateFrom/:dateTo/data', async function(req, res) {
  
    var data = {};
    var query = `SELECT "${req.params.columnName}" FROM "${req.params.tableName}" where date_time >= $1 and date_time <= $2;`;  
    console.log(query)     ;
    data[req.params.columnName] = await pg.execute(query, [req.params.dateFrom, req.params.dateTo]).then(columnData=>{
      var response = [];
      for (let j = 0; j < columnData.length; j++) {
        response.push(columnData[j][req.params.columnName]);
      }
      return response;
    })
    res.send(data);
})

app.get('/object/:tableName/:dateFrom/:dateTo/data', async function(req, res) {
  
  // var data = {};
  var query = `SELECT * FROM "${req.params.tableName}" where date_time >= $1 and date_time <= $2;`;  
  console.log(query)     ;
  var data = await pg.execute(query, [req.params.dateFrom, req.params.dateTo]);
  res.send(data);
})

app.listen(port, () => console.log(`ASRC app listening on port ${port}!`))

async function fillColumn(column){
  console.log('querying!');
  
}