Framework = new Mongo.Collection("framework");
Vote = new Mongo.Collection("vote");

if (Meteor.isClient) {
  var username = localStorage.username ? localStorage.username : "";
  Session.setDefault('username', username);

  Template.hello.helpers({
    username: function () {
      return Session.get('username');
    },
    frameworks: function(){
      return Framework.find();
    },
    votes: function(){
      return Vote.find({},{sort: {date_created: -1}});
    }
  });
  
  Template.vote.events({
    "click .votes__remove": function(e){
      e.preventDefault();
      Vote.remove(this._id);
    }
  })
  
  Template.framework.helpers({
    score: function(){
      return Vote.find({frameworkId: this._id}).count();
    },
    voted: function(){
      return Vote.find({frameworkId: this._id, username: Session.get('username')}).count()
    }
  })
  
  Template.framework.events({
    "click .frameworks__remove": function(e){
      e.preventDefault();
      if(window.confirm('削除しますか？')){
        Framework.remove(this._id);
      }
    },
    "click .frameworks__vote": function(e){
      e.preventDefault();
      Vote.insert({
        frameworkId: this._id,
        framework: this.name,
        username: Session.get('username'),
        date_created: new Date()
      })
    },
    "click .frameworks__devote": function(e){
      e.preventDefault();
      
      var vote = Vote.find({
        frameworkId: this._id,
        username: Session.get('username')
      }).fetch()[0];
      Vote.remove(vote._id);
    },
  })
  
  Template.hello.events({
    "click .main__logout": function(){
      localStorage.username = "";
      Session.set('username', "");
    },
    "submit .main__frameworks__form": function(e){
      e.preventDefault();
      if(e.target.name.value.trim().length !== 0){
        Framework.insert({
          name: e.target.name.value
        })
        e.target.name.value = "";
      }
    }
  });
  
  Template.loginForm.events({
    "submit .login__form": function(e){
      e.preventDefault();
      localStorage.username = e.target.name.value;
      Session.set('username', e.target.name.value);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
