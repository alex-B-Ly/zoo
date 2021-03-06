// REQ vars
var mysql = require('mysql');
var prompt = require('prompt');

// DB connect
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo_db'
});

prompt.start;
prompt.message = '';

// ZOO OBJECT
var zoo = {
  welcome: function(){
    console.log('Welcome to the Zoo And Friends App~!');
  },
  menu: function(){
    console.log('Enter (A): ------> to Add a new animal to the Zoo!');
    console.log('Enter (U): ------> to Update info on an animal in the Zoo!');
    console.log('Enter (V): ------> to Visit the animals in the Zoo!');
    console.log('Enter (D): ------> to Adopt an animal from the Zoo!\r\n');
    console.log('Enter (Q): ------> to Quit and exit the Zoo!');
  },
  add: function(input_scope){
    var currentScope = input_scope;
    console.log('To add an animal to the zoo please fill out the following form for us!');

    // Prompts user to add new animal, then inserts it into animals table in zoo_db
    prompt.get(['caretaker_ID','name', 'type', 'age'], function(err, result){
      var query = 'INSERT INTO animals (caretaker_id, name, type, age) VALUES (?,?,?,?);';
      var newAnimal = [result.caretaker_ID, result.name, result.type, result.age];

      connection.query(query, newAnimal, function(err, res){
        if(err){ throw err; }

        console.log(result.name + ' was involuntarily thrown into the zoo for milkshake drinking visitors to ogle.');

        currentScope.menu();
        currentScope.promptUser();
      });
    });
  },
  visit: function(){
    console.log('Enter (I): ------> do you know the animal by its id? We will visit that animal!');
    console.log('Enter (N): ------> do you know the animal by its name? We will visit that animal!');
    console.log('Enter (A): ------> here’s the count for all animals in all locations!');
    console.log('Enter (C): ------> here’s the count for all animals in this one city!');
    console.log('Enter (O): ------> here’s the count for all the animals in all locations by the type you specified!\r\n');
    console.log('Enter (Q): ------> Quits to the main menu!\r\n');
  },
  view: function(input_scope){
    var currentScope = input_scope;

    console.log('Please choose what you would like to visit.');

    prompt.get(['visit'], function(err, result){
      // This obviously points to methods based on choices defined in zoo.visit.  Why is there result.type, etc in the directions?
      if(result.visit.toUpperCase() === 'Q'){
        currentScope.menu();
        currentScope.promptUser();
      }else if(result.visit.toUpperCase() === 'O'){
        currentScope.type(input_scope);
      }else if(result.visit.toUpperCase() === 'I'){
        currentScope.animId(input_scope);
      }else if(result.visit.toUpperCase() === 'N'){
        currentScope.name(input_scope);
      }else if(result.visit.toUpperCase() === 'A'){
        currentScope.all(input_scope);
      }else if(result.visit.toUpperCase() === 'C'){
        currentScope.care(input_scope);
      }else{
        console.log('Sorry. Didn\'t get that.  Come again?');
        currentScope.visit();
        currentScope.view(currentScope);
      }
    }); 
  },
  type: function(input_scope){
    var currentScope = input_scope;

    console.log('Enter animal type to find how many animals we have of those type.');

    prompt.get(['animal_type'], function(err, result){
      var query = 'SELECT COUNT(type) FROM animals WHERE type=?';
      connection.query(query, result.animal_type, function(err, res){
        if(err){ throw err; }

        console.log('We have ' + res[0]['COUNT(type)'] + ' of this animal: ' + result.animal_type +'\r\n');

        // Maybe set a timeout for calls below to give user chance to see how many animals there are.
        currentScope.menu();
        currentScope.promptUser();
      });
    });
  },
  care: function(input_scope){
    var currentScope = input_scope;

    console.log('Enter city name NY/SF');

    prompt.get(['city_name'], function(err, result){
      var query = 'SELECT COUNT(*) FROM animals a, caretakers c WHERE a.caretaker_id = c.id AND city = ?';
      connection.query(query, result.city_name, function(err, res){
        if(err){ throw err; }

        console.log('There are ' + res[0]['COUNT(*)'] + ' animals being taken care of in ' + result.city_name + '.');

        currentScope.visit();
        currentScope.view(currentScope);
      });
    });
  },
  animId: function(input_scope){
    var currentScope = input_scope;

    console.log('Enter ID of the animal you want to visit.');

    prompt.get(['animal_id'], function(err, result){
      var query = 'SELECT * FROM animals WHERE id=?';
      connection.query(query, result.animal_id, function(err, res){
        if(err){ throw err; }

        console.log('Animal name: '+res[0].name);
        console.log('Animal type: '+res[0].type);
        console.log('Animal age: '+res[0].age+'\r\n');

        currentScope.visit();
        currentScope.view(currentScope);
      });
    });
  },
  name: function(input_scope){
    var currentScope = input_scope;

    console.log('Enter the name of the animal you want to visit.');

    prompt.get(['animal_name'], function(err, result){
      var query = 'SELECT * FROM animals WHERE name=?';
      connection.query(query, result.animal_name, function(err, res){
        if(err){ throw err; }

        console.log('Animal ID: '+res[0].id);
        console.log('Animal name: '+res[0].name);
        console.log('Animal type: '+res[0].type);
        console.log('Animal age: '+res[0].age+'\r\n');

        currentScope.visit();
        currentScope.view(currentScope);
      });
    });
  },
  all: function(input_scope){
    var currentScope = input_scope;

    connection.query('SELECT COUNT(*) FROM animals', function(err, res){
      if(err){ throw err; }

      console.log('There are a total of ' + res[0]['COUNT(*)'] + ' animals in the zoo.\r\n');

      currentScope.menu();
      currentScope.promptUser();
    });
  },
  update: function(input_scope){
    var currentScope = input_scope;

    prompt.get(['id', 'new_name', 'new_age', 'new_type', 'new_caretaker_id'], function(err, result){
      var query = 'UPDATE animals SET id=?, caretaker_id=?, name=?, type=?, age=? WHERE id=?';
      var updateInfo = [result.id, result.new_caretaker_id, result.new_name, result.new_type, result.new_age, result.id];

      connection.query(query, updateInfo, function(err, res){
        if(err){ throw err }

        console.log('Animal table updated.');
      });

      currentScope.menu();
      currentScope.promptUser();
    });
  },
  adopt: function(input_scope){
    var currentScope = input_scope;

    prompt.get(['animal_id'], function(err, result){
      var query = 'DELETE FROM animals WHERE id=?';

      connection.query(query, result.animal_id, function(err, res){
        if(err){ throw err; }

        console.log('You have just adopted animal #'+result.animal_id+'.');
      });

      currentScope.visit();
      currentScope.view(currentScope);
    });
  },
  promptUser: function(){
    var self = this;

    prompt.get(['input'], function(err, result){
      switch(result.input.toUpperCase()){
        case 'Q':
          console.log('quitting');
          self.exit();
          break;
        case 'A':
          self.add(self);
          break;
        case 'V':
          self.visit();
          self.view(self);
          break;
        case 'D':
          self.adopt(self);
          break;
        case 'U':
          self.update(self);
          break;
        default:
          console.log('Sorry, didn\'t get that. Come again?');
          break;
      }
    });
  },
  exit: function(){
    console.log('Thank you for visiting us, goodbye!');
    process.exit();
  },
  open: function(){
    this.welcome();
    this.menu();
    this.promptUser();
  }
}; // END Zoo

// TEST
zoo.open();
