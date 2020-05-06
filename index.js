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


app.get('/object/:tableName/:columnName/:dateFrom/:dateTo/minmax', function(req, res) {
  var query = `SELECT MAX("${req.params.columnName}"), MIN("${req.params.columnName}") FROM "${req.params.tableName}" WHERE date_time >= $1 and date_time <= $2;`;
  console.log(query);
  pg.execute(query, [req.params.dateFrom, req.params.dateTo])
    .then(minmax =>{
      var response = [minmax[0].min, minmax[0].max];
      res.send(response);

  })
})


app.get('/object/:tableName/threshold/shapes', function(req, res) {
  pg.execute(sql.objectDescription, [req.params.tableName]).then(async (columns)=>{
    let threshold = {
      ap: null,
      pp: null,
      downRange: null,
      upRange: null
    };

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if(column.description == 'ap'){
        var query = `SELECT "${column.columnname}" FROM "${column.tablename}" LIMIT 1`;
        threshold.ap = (await pg.execute(query))[0][column.columnname];
      }
      if(column.description == 'pp'){
        var query = `SELECT "${column.columnname}" FROM "${column.tablename}" LIMIT 1`;
        threshold.pp = (await pg.execute(query))[0][column.columnname];
      }
      if(column.description == 'downRange'){
        var query = `SELECT "${column.columnname}" FROM "${column.tablename}" LIMIT 1`;
        
        threshold.downRange = (await pg.execute(query))[0][column.columnname];
        console.log(query, threshold.downRange);
      }
      if(column.description == 'upRange')
      {
        var query = `SELECT "${column.columnname}" FROM "${column.tablename}" LIMIT 1`;
        threshold.upRange = (await pg.execute(query))[0][column.columnname];
      }
      
    }
    var response = [
      {
        type: 'rect', xref: 'paper', yref: 'y', x0: 0, x1: 1, 
        y0: threshold.pp, y1: threshold.downRange,              
        fillcolor: '#00ff00', opacity: 0.2, line: { width: 0}
      },
      {
        type: 'rect', xref: 'paper', yref: 'y', x0: 0, x1: 1,
        y0: threshold.ap, y1: threshold.pp,              
        fillcolor: '#FFFF00', opacity: 0.2, line: { width: 0 }
      },
      {
        type: 'rect', xref: 'paper', yref: 'y', x0: 0, x1: 1,
        y0: threshold.upRange, y1: threshold.ap,              
        fillcolor: '#FF0000', opacity: 0.2, line: { width: 0 }
      },
    ]

    res.send(response);
  

  });
})

app.get('/event/:tableName/:dateFrom/:dateTo/data', async function(req, res) {
  var prj_mark = req.params.tableName.split('_')[1];
  var query = `SELECT * FROM events where date_time >= $1 and date_time <= $2 and msg_prjmark = $3;`;  
  console.log(query)     ;
  var data = await pg.execute(query, [req.params.dateFrom, req.params.dateTo, prj_mark]);
  res.send(data);
})

app.get('/object/:tableName/description', function(req, res) {
  pg.execute(sql.objectDescription, [req.params.tableName]).then(response=>{
    res.send(response);
  });
})

// app.get('/object/:tableName/data', async function(req, res) {
//   pg.execute(sql.objectDescription, [req.params.tableName]).then(async (columns) => {
//     var data = {};

//     for (let i = 0; i < columns.length; i++) {
//       const column = columns[i];
//       var query = `SELECT "${column.columnname}" FROM "${column.tablename}";`;       
//       data[column.columnname] = await pg.execute(query).then(columnData=>{
//             var response = [];
//             for (let j = 0; j < columnData.length; j++) {
//               response.push(columnData[j][column.columnname]);
//             }
//             return response;
//           })        
//       }
//     res.send(data);
//   });
// })

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