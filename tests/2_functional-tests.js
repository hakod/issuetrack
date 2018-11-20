/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,'Title')
          assert.equal(res.body.issue_text,'text')
          assert.equal(res.body.created_by,'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to,'Chai and Mocha')
          assert.equal(res.body.status_text,'In QA')
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',          
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,'Title')
          assert.equal(res.body.issue_text,'text')
          assert.equal(res.body.created_by,'Functional Test - Every field filled in')
                   
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'dffsa',
            issue_text: 'text'
          })
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing inputs')
            done()
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no updated field sent')
            done()
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({_id: '5bd6deb82eb82f20d9fb9a38', issue_title: 'nomore'})
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated '+'5bd6deb82eb82f20d9fb9a38')
            done()
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({_id: '5bd6deb82eb82f20d9fb9a38', issue_title: 'hi', issue_text: 'bye'})
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated '+'5bd6deb82eb82f20d9fb9a38')
            done()
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
         .get('/api/issues/test')
         .query({issue_text: 'bye'})
         .end((err, res)=>{
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
         .get('/api/issues/test')
         .query({open: true, issue_text: 'bye'})
         .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
         .delete('/api/issues/test')
         .send({})
         .end((err,res)=>{
           assert.equal(res.status, 200)
           assert.equal(res.text, '_id error')
           done()
        })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
         .delete('/api/issues/test')
         .send({_id: '5bd6dcf44b44a41669d6029e'})
         .end((err, res)=>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'deleted '+'5bd6dcf44b44a41669d6029e')
          done()
        })
      });
      
    });

});
