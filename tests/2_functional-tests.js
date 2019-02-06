/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  var testCase ={};
  testCase.id ="";  //The ID of our test case
  testCase.title = "War and Peace";
  testCase.comments = "I liked it!";
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: testCase.title})          
          .end(function(err, res){
            assert.equal(res.status, 200);            
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.property(res.body, 'commentcount', 'Books should contain commentcount');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            testCase.id = res.body._id;    //Store for future test cases
            assert.equal(res.body.commentcount, 0, 'commentcount should initialize to zero');
            assert.equal(res.body.title, "War and Peace");
            done();
          });
        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send(
            //{title: "War and Peace"}    //Send nothing so we receive an error
          )          
          .end(function(err, res){
            assert.equal(res.status, 200);            
            assert.equal(res.text, "missing inputs");    //Correct error response for missing inputs
            done();
          });
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books/')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'comments', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.isArray(res.body[0].comments, 'comments field should should be an array');
            done();
          });
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        var id = '0c5aeb42372b924ce2be5010'; //Invalid ID 
        //var id = testCase.id; //Valid ID
        chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res){
            assert.equal(res.status, 200);

            assert.equal(res.text, "no book exists");    //Correct error response for invalid ID
          
            done();
          });
        //done();
      });  

      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        var id = testCase.id; //Valid ID
        chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            
            assert.property(res.body, 'comments', 'Books should contain commentcount');
            assert.property(res.body, 'commentcount', 'Books should contain commentcount');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.equal(res.body._id, id, 'id should match');
            assert.isArray(res.body.comments, 'comments field should should be an array');          
            done();
          });
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        var id = testCase.id; //Valid ID
        chai.request(server)
          .post('/api/books/' + id)
          .send({'comment' : testCase.comments})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.property(res.body, 'commentcount', 'Books should contain commentcount');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.isArray(res.body.comments, 'comments field should should be an array'); 
            assert.equal(res.body._id, testCase.id, 'id should match');
            assert.equal(res.body.title, testCase.title, 'title should match');  
            assert.equal(res.body.commentcount, 1, 'test is the first comment, so commentcount should be 1');
            assert.equal(res.body.comments[0], testCase.comments, 'comment should match');
            done();
          });
        //done();
      });
      
    });

  });

});
