const express = require("express");
const bodyparser = require("body-parser");
const UssdMenu = require("ussd-menu-builder");

const app = express();
app.use(bodyparser.json());

const PORT = process.env.PORT || 3000;

let menu = new UssdMenu();

menu.startState({
  run: () => {
    // use menu.con() to send response without terminating session
    menu.con(
      "Welcome please provide your 1st name,last name and age" + "\n1. Next"
    );
  },
  // next object links to next state based on user input
  next: {
    1: "Next",
  },
});

menu.state("Next", {
  run: () => {
    menu.con(
      "\n1. Enter your first name" +
        "\n2. Enter your last name" +
        "\n3. Enter your age"
    );
  },
  next: {
    1: "firstName",
    2: "lastName",
    3: "age",
  },
});

menu.state("firstName", {
  run: () => {
    menu.con("Enter your first name:");
  },
  next: {
    // using regex to match user input to next state
    "*\\w+": "firstName.name",
  },
});

menu.state("lastName", {
  run: () => {
    menu.con("Enter your last name:");
  },
  next: {
    // using regex to match user input to next state
    "*\\w+": "lastName.name",
  },
});

menu.state("age", {
  run: () => {
    menu.con("Enter your age:");
  },
  next: {
    // using regex to match user input to next state
    "*\\d+": "age.num",
  },
});

menu.state("firstName.name", {
  run: () => {
    var firstName = menu.val;
    getFirstName(menu.args.phoneNumber, firstName).then(function (res) {
      menu.end("Your firstname registered successfully.");
    });
  },
});

menu.state("lastName.name", {
  run: () => {
    var lastName = menu.val;
    getLastName(menu.args.phoneNumber, lastName).then(function (res) {
      menu.end("Your lastname registered successfully.");
    });
  },
});

menu.state("age.num", {
  run: () => {
    var age = Number(menu.val);
    getAge(menu.args.phoneNumber, age).then(function (res) {
      menu.end("Your age registered successfully.");
    });
  },
});

/* function definitions */
var getFirstName = function firstName(mobi, name) {
  return new Promise((resolve, reject) => {
    resolve(name);
  });
};
var getLastName = function lastName(mobi, name) {
  return new Promise((resolve, reject) => {
    resolve(name);
  });
};
var getAge = function age(mobi, age) {
  return new Promise((resolve, reject) => {
    resolve(age);
  });
};

app.post("/ussd", function (req, res) {
  menu.run(req.body, (ussdResult) => {
    res.send(ussdResult);
  });

  Promise.all([getFirstName, getLastName, getAge]).then((values) => {
    console.log(
      `Your name is: ${values[0]} ${values[1]} and you are ${values[2]}  years old`
    );
  });
});

app.listen(PORT, () => {
  console.log("App is running on port: " + PORT);
});
