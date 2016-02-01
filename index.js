// REQ vars
var mysql = require('mysql');
var prompt = require('prompt');

// DB connect
  // TEST - Change database back to zoo_db when done testing
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo_test'
});

// Don't feel like typing console log over and over
function cl(str){
  console.log(str);
}

prompt.start;
prompt.message = '';

// ZOO OBJECT
var zoo = {
  welcome: function(){
    cl('Welcome to the Zoo And Friends App~!');
  },
  menu: function(){
    cl('Enter (A): ------> to Add a new animal to the Zoo!');
    cl('Enter (U): ------> to Update info on an animal in the Zoo!');
    cl('Enter (V): ------> to Visit the animals in the Zoo!');
    cl('Enter (D): ------> to Adopt an animal from the Zoo!\r\n');
    cl('Enter (Q): ------> to Quit and exit the Zoo!');
  },
  add: function(input_scope){
    var currentScope = input_scope;
    cl('To add an animal to the zoo please fill out the following form for us!');

    // Prompts user to add new animal, then inserts it into animals table in zoo_db
    prompt.get(['name', 'type', 'age'], function(err, result){
      var query = 'INSERT INTO animals (name, type, age) VALUES (?,?,?);';
      var newAnimal = [result.name, result.type, result.age];

      connection.query(query, newAnimal, function(err, res){
        if(err){ throw err; }

        cl(result.name + ' was involuntarily thrown into the zoo for milkshake drinking visitors to ogle.');
      });

      currentScope.menu();
      currentScope.promptUser();
    });
  },
  visit: function(){
    cl('Enter (I): ------> do you know the animal by its id? We will visit that animal!');
    cl('Enter (N): ------> do you know the animal by its name? We will visit that animal!');
    cl('Enter (A): ------> here’s the count for all animals in all locations!');
    cl('Enter (C): ------> here’s the count for all animals in this one city!');
    cl('Enter (O): ------> here’s the count for all the animals in all locations by the type you specified!\r\n');
    cl('Enter (Q): ------> Quits to the main menu!\r\n');

    // TODO Analyze logic and see if currentScope.visit() and currentScope.view(currentScope) will need to be called here. Instructions unclear.
  },
  view: function(){
    
  }
};
