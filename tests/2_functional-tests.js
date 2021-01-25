/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
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
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let id = ''

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        //response will contain new book object including atleast _id and title
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Crime and Punishment'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Crime and Punishment')
          assert.isNotNull(res.body._id)
          assert.equal(res.body._id, res.body._id)
          id = res.body._id;
          console.log("id has been set as " + id)
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.body, 'missing required field title')
          done();
        });
      })

    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
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

    });


    suite('GET /api/books/[_id] => book object with [_id]', function(){
      
      test('Test GET /api/books/[_id] with _id not in db',  function(done){
        chai.request(server)
        .get('/api/books/600de5cd37b51a0165f95234')//made up id
        .end(function(err, res){
          assert.equal(res.body, 'no book exists')
          done()
        });
      });
      
      test('Test GET /api/books/[_id] with valid _id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id)
            assert.equal(res.body.title, 'Crime and Punishment')
            done()
          });
        });
      
    });


    suite('POST /api/books/[_id] => add comment/expect book object with _id', function(){
      //failed
      test('Test POST /api/books/[_id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + id)
        .send({
          _id: id,
          comment: 'test comment'
        })
        .end(function(err, res){
          assert.isTrue(res.body.comments.includes('test comment'))
          assert.equal(res.body._id, id)
          assert.equal(res.body.title, 'Crime and Punishment')
          done();
        });
      });
      //failed
      test('Test POST /api/books/[_id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/' + id)
        .send({
          comment: ""
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field comment')
          done();
        })
      });

      test('Test POST /api/books/[_id] with comment, _id not in db', function(done){
        chai.request(server)
        .post('/api/books/600de5cd37b51a0165f95234')//unusual POST request containing query in URL
        .send({
          _id: '600de5cd37b51a0165f95234',//made up non existant id
          comment: 'comment for non existant id'
        })
        .end(function(err, res){
          assert.equal(res.body, 'no book exists')
          done()
        });
      });

    });

    suite('DELETE /api/books/[_id] => delete book object _id', function() {
      
      test('Test DELETE /api/books/[_id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/' + id)
        .send({
          _id: id
        })
        .end(function(err, res){
          assert.equal(res.body, 'delete successful')
          done()
        });
      });
      
      test('Test DELETE /api/books/[_id] with  _id not in db', function(done){
        chai.request(server)
        .delete('/api/books/600de5cd37b51a0165f95234')//unusual DELETE request containing query in URL
        .send({
          _id: '600de5cd37b51a0165f95234',//made up non existant id
        })
        .end(function(err, res){
          assert.equal(res.body, 'no book exists')
          done()
        });
      });

    });

  });
  
})
