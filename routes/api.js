/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
    
  app.route('/api/issues/:project')  
    .get(function (req, res){
      var project = req.params.project;  
      var que = req.query
      if(que.hasOwnProperty('open')){
        que.open==='false'?que.open=false:que.open=true
      }
      if(que.hasOwnProperty('_id')){
        que._id = ObjectId(que._id)
      }
    MongoClient.connect(CONNECTION_STRING,(err,db)=>{
       let col = db.db('masd')
      let coll = col.collection('apitest')
    coll.find(que).toArray((err,doc)=>{
      res.json(doc)
    })
    })
    })
    
    .post(function (req, res){
      var project = req.params.project;  
    
    
      var input = req.body;

      var put = {issue_title: input.issue_title,issue_text:input.issue_text,created_by:input.created_by,assigned_to:
                    input.assigned_to,status_text:input.status_text,created_on:new Date(),updated_on:new Date(),open:true}
      if (!input.issue_title||!input.issue_text||!input.created_by){
        res.send('missing inputs')
        return
      }
      
      MongoClient.connect(CONNECTION_STRING,(err,db)=>{      
        let col = db.db('masd')
        let coll = col.collection('apitest')
      coll.insertOne(put,(err,doc)=>{
        if (err) res.send('missing inputs')
        res.json(put)
      })                
      })      
    })
    
    .put(function (req, res){      
    MongoClient.connect(CONNECTION_STRING,(err,db)=>{
      var project = req.params.project;
      var input = req.body;
      let col = db.db('masd')
      let coll = col.collection('apitest')
      var inputs = {};
      for (let x in input){
        if (input[x]!==''){
          inputs[x] = input[x]
        }
      }
      if (inputs.hasOwnProperty('open')){
        inputs.open = false;
      }
      delete inputs._id
      if(Object.getOwnPropertyNames(inputs).length===0){
          res.send('no updated field sent')
        }
      coll.findOneAndUpdate({_id: ObjectId(input._id)},{$set:inputs},(err,data)=>{
        if(err) {res.send('could not update '+input._id)}        
        res.send('successfully updated '+input._id)        
      })
    
    })
})
    
    .delete(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING,(err,db)=>{
        let col = db.db('masd')
        let coll = col.collection('apitest')
      coll.deleteOne({_id: ObjectId(req.body._id)},(err,data)=>{
        if (!req.body._id){
          res.send('_id error')
          return
        }
        if (err) res.send('could not delete '+req.body._id)
        res.send('deleted '+req.body._id)
      })
      })
    });
    }
;
