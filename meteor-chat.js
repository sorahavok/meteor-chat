Chats = new Mongo.Collection("chats");
ChatLog = new Mongo.Collection("chatlog");

if (Meteor.isClient) {
  // Setup Code
  var notInChat = "None";

  Session.set("currentChat", notInChat);
  
  // Events
  Template.body.events({
    "submit .new-chat": function(){

      var name = event.target.text.value;

      Chats.insert({
        name: name,
        createdAt: new Date(),
        people: [],
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

    "click .chat-item": function(event) {
      var currentChat = Session.get("currentChat");
      if(currentChat != notInChat && currentChat != undefined) {
        var chat = Chats.findOne(currentChat._id);
        var chatIndex = chat != notInChat ? chat.people.indexOf(getUserName()) : -1;
        if(chatIndex > -1) {
          chat.people.splice(chatIndex, 1);
        }
      }

      var currChat = Chats.findOne({"name": event.target.innerText});
      currChat.people.push(getUserName())
      Session.set("currentChat", currChat);
    },
  });

  Template.chat.events({
    "click .sendImg": function(event) {
      insertNewChat();
    }, 

    "keyup #chatInput" : function(event) {
      if(event.keyCode == 13) {
        insertNewChat();
      }
    },
  });

  // Helpers
  Template.body.helpers({
    avalableChats: function() {
      return Chats.find({});
    },
    chatCount: function() {
      return Chats.find({}).count();
    },
    inChat: function(){
      return notInChat !== Session.get("currentChat");
    },
  });

  Template.chat.helpers({
    currentChat: function() {
      return Session.get("currentChat").name;
    },
    chatEntries: function() {
      return ChatLog.find({"chat": Session.get("currentChat").name});
    },
    peopleInChat: function() {
      return Session.get("currentChat").people.map(function(person){
        return {name: person}
      });
    },
  });

  Template.avalableChat.helpers({
    createTime: function() {
      return this.createdAt.toLocaleDateString() + ' ' + this.createdAt.toLocaleTimeString();
    },
  });

  Template.chatEntry.helpers({
    createTime: function() {
      return this.createdAt.toLocaleTimeString();
    },
    userLetter: function() {
      return this.user[0].toUpperCase();
    },
  });

  var insertNewChat = function() {
    chatInput = $('#chatInput')[0];

    ChatLog.insert({
      text: chatInput.value,
      user: getUserName(),
      chat: Session.get("currentChat").name,
      createdAt: new Date(),
    });
    chatInput.value = "";
  };

  var getUserName = function() {
    user = Meteor.user();
    return user == null ? "anonymous" : user.username;
  };

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

  if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
  });
  }
