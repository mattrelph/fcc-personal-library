/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;

const dbCollection = "fcc-personal-library";
const  db = require('../db/database.js');
const ObjectId = require('mongodb').ObjectID;

/*var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;*/
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
db.connect(() => {
    app.listen(function (){
        console.log(`Database Listening`);
    });
  });
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
      db.get().collection(dbCollection).find({}).toArray(function (err, result) 
      {
        if(err) 
        {
          console.log('Database read error: ' + err);
          res.status(500).end();
        } 
        else 
        {
          //console.log('GET OUTPUT: ' + JSON.stringify(result));
          res.status(200).json(result);    //Upon successful search, we report results
        }


      });
    
    
    })
    
    .post(function (req, res){
      if ((req.body.hasOwnProperty('title')) && (req.body.title !=""))
      {
        var project = {};
        project.title = req.body.title;      
        project.commentcount = 0;
        project.comments = [];
        //response will contain new book object including atleast _id and title
        db.get().collection(dbCollection).insertOne(project, function (err, result)     //Insert a new  book
          {
            if(err) 
            {
              console.log('Database insertion error: ' + err);
              res.status(500).end();
            } 
            else 
            {
              //console.log("POST OUTPUT: " + JSON.stringify(project));
              res.status(200).json(project);    //Upon successful insertion, we will now respond with the inserted object.
            }

          })
      }
      else
      {
        res.status(200).send('missing inputs'); 
      }
    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'      
      db.get().collection(dbCollection).deleteMany({} , function (err, result)     //Retrieve cases based on query criteria
        {
          if(err) 
          {
            console.log('Database insertion error: ' + err);
            res.status(500).end();
          } 
          else 
          {
            //console.log("POST OUTPUT: " + JSON.stringify(project));
            res.status(200).send('complete delete successful');    //Upon successfully deleting all documents
          }

        })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var project = {};
      project._id = ObjectId(req.params.id); //{'_id' : ObjectId(req.params.id)};
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      db.get().collection(dbCollection).findOne(project, function (err, result) 
      {
        if(err) 
        {
          //console.log('GET ERROR: ' + JSON.stringify(project));
          console.log('Database read error: ' + err);
          res.status(500).end();
          
        } 
        else 
        {
          //console.log('GET OUTPUT: ' + JSON.stringify(result));
          if (result != null)
          {
            res.status(200).json(result);    //Upon successful retrieval, we will now respond with the retrieved object.
          }
          else
          {
            res.status(200).send("no book exists");    //We didn't find any documents that matched
          }
        }


      }); 
    })
    
    .post(function(req, res){
      var project = {};
      project._id = {'_id' : ObjectId(req.params.id)};
 
      if (req.body.hasOwnProperty('comment'))
      {        
        project.update = 
        {
          '$push': {'comments': req.body.comment } , 
          "$inc": { 'commentcount': 1 }
        };
        //console.log('POST input: ' + project);
        //json res format same as .get
         db.get().collection(dbCollection).updateOne(project._id, project.update, function (err, result) 
              {
                if(err) 
                {
                  console.log('Database update error: ' + err);
                  res.status(500).end();                  
                } 
                else 
                {
                  //console.log("PUT OUTPUT: " + JSON.stringify(project));
                  //console.log(JSON.stringify(result));
                  if (result.result.n == 1)    //Check if something actually got updated
                  {
                    db.get().collection(dbCollection).findOne(project._id, function (err, getresult) 
                    {
                      if(err) 
                      {
                        console.log('Database read error: ' + err);
                        res.status(500).end();
                      } 
                      else 
                      {
                        //console.log('GET OUTPUT: ' + JSON.stringify(getresult));
                        if (getresult != null)
                        {
                          //console.log('POST output: ' + JSON.stringify(getresult));
                          res.status(200).json(getresult);    //Upon successful retrieval, we will now respond with the retrieved object.
                        }
                        else
                        {
                          //console.log('POST output: ' + 'no results found');
                          res.status(200).send('no results found for ' + project);    //We didn't find any documents that matched
                        }
                      }

                    });
                  }
                  else
                  {
                    //console.log('POST output: ' + 'not updated');
                    res.status(200).send("not updated: " + JSON.stringify(project));  //No records got updated. Check your id.

                  }
                }
              });   
          }
          else
          {
            //console.log('POST output: ' + 'missing inputs');

            res.status(200).send("missing inputs");
          }
      
    })
    
    .delete(function(req, res){
      var project = {};
      project._id = {'_id' : ObjectId(req.params.id)};
      //if successful response will be 'delete successful'
      db.get().collection(dbCollection).deleteOne(project._id, function (err, result) 
          {
            if(err) 
            {
              console.log('Database document delete error: ' + err);
              res.status(500).end();
            } 
            else 
            {
              //console.log("DELETE OUTPUT: " + JSON.stringify(project));
              //console.log("DELETE OUTPUT: " + JSON.stringify(result));
              res.status(200).send('delete successful');    //Notify upon successful deletion.
            }
          });
    });
  
};
