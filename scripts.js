/*** TRIVIA TIME ***/

/*
 * Assignment 5 Prep 2 - Integrating the DOM with forms and fetching JSON
 * 
 * This app utilizes the Open Trivia Database - read about it here: https://opentdb.com/api_config.php
 * 
 * Number: Default is 10 but must be 1-50
 * Difficulties: easy, medium, hard
 * Type: multiple, boolean (multiple choice, true/false) - FOR THIS EXERCISE WE ARE STICKING TO MULTIPLE CHOICE
 * 
 * Category, difficulty, and type can each be ignored to get mixed results ("any")
 * One call to the API will retrieve 50 questions max
 * 
 * To request token: https://opentdb.com/api_token.php?command=request
 * To use token: https://opentdb.com/api.php?amount=10&token=YOURTOKENHERE
 * 
 */


let currentToken; 
let categories = [];

// Fetch token for 6 hours of tracking to prevent duplicated questions from trivia database
// Using preventDefault() on the form listener will keep this from resetting when form is submitted
function fetchToken() {
    fetch("https://opentdb.com/api_token.php?command=request").then( function(response) {
        response.json().then( function(json) {
            currentToken = json.token;
            console.log("New token received: " + currentToken);
        });
    });
}

function fetchCategories() {
    fetch("https://opentdb.com/api_category.php").then( function(response) {
        response.json().then( function(json) {
            categories = json.trivia_categories;
            console.log("Categories loaded." );
            console.log(categories);
            console.log("Categories displayed in drop-down menu on page.");
            init(); // This MUST go here so that nothing else on the page happens until the categories drop-down has the data it needs to populate the options!
        });
    });
}

// Event listener for page load
window.addEventListener("load", function() {
    fetchToken();
    fetchCategories();
    console.log('Page loaded. (Is it really though?)'); // Note what order these get logged in the JS console
});

// DOM code for page elements
function init() {

    // TODO: Establish variable to hold questions after they are returned from fetch request
    let questions = [];

    // TODO: Establish variables for DOM objects representing HTML elements
    let category = document.getElementById("category");
    let numQuestions = document.getElementById("num-questions");
    let type = document.getElementById("type");
    let difficulty = document.getElementById("difficulty");
    let form =document.getElementById("form");
    let questionArea =document.getElementById("question-area");


    // TODO: Write a function to populate the drop-down list of categories
    function listCategories(){
        //For loop through categories array
            //Append to category DOM object ->
                //option elements with value:id, text: name
        for (let i = 0; i< categories.length; i++){
            category.innerHTML += `
                <option value = "${categories[i].id}">${categories[i].name}</option>
            `;
        }
    }
    listCategories();

    // TODO: Write a function to build the URL with query parameters based on form submitted
    function buildURL(){
        let newURL = "https://opentdb.com/api.php?token=" + currentToken + "&amount=" + numQuestions.value;
        if (category.value !== "any") {
            newURL += "&category=" + category.value;
        }
        if (type.value !== "any") {
            newURL += "&type=" + type.value;
        }
        if (difficulty.value !== "any") {
            newURL += "&difficulty=" + difficulty.value;
        }
        return newURL;
       
        
    }


    function getQuestions(){
        let url = buildURL(); 
        console.log(url);
        fetch(url).then( function(response) {
        response.json().then( function(json) {
            questions = json.results;
            console.log("New questions received.");
            displayQuestions();
            console.log(questions);// eventually, replace console.log with displayQuestions()
            console.log("New questions displayed on page.");
        });
    });

    }
    function getAnswerOptions(qIndex){
        let answers = [];
        answers.push(questions[qIndex].correct_answer);
        answers= answers.concat(questions[qIndex].incorrect_answers);
        //we have unshuffled list of answers in `answer`
        shuffle(answers);
        //Walk through answers array and generate string value with 
        //< input type = radio value= answer0> Answer</input><input type=radio value=answer1

        let options="";
        for(let i = 0; i< answers.length; i++){
            options +=`
                <input type="radio" id="q${qIndex}-${i}" class="answer" name="q${qIndex}" value="${answers[i]}" />
                <label for="q${qIndex}-${i}" class="q-option"> ${answers[i]}</label>
                
            
            `;
                //q0-0, q0-1, q0-2
                //name: q0, q1, q2
        }
        return options;      
    }


    function displayQuestions(){
        let answers;
        for (let i=0; i<questions.length; i++){
            // Each iteration, display 1 question -- question[i] -- and its answers
            answers = getAnswerOptions(i); // returns list of answers shuffled up
            questionArea.innerHTML +=`
                <div class="q-container">
                    <p class="q-number">Question ${i+1}</p>
                    <p class="q-question"> ${questions[i].question}</p>
                    ${answers}
                    <p class="q-info">${questions[i].category} &nbsp;&bull;&nbsp; ${questions[i].difficulty}</p>
                </div>
            `;
        }

    }


    form.addEventListener("submit", function(event){
        if (numQuestions.value<1 || numQuestions.value > 50){
            alert("HEY NO!");
            event.preventDefault();
        }
        getQuestions();

        event.preventDefault();
    });

    // TODO: Write a function to fetch new questions from trivia database
    

    // TODO: Write a function to shuffle correct and incorrect answers in an array for one question and return innerHTML
    

    // TODO: Write a function to display the questions (see sample-question-code.html)
    

    // TODO: Write a function to reset the question area
    

    // TODO: Write a form-level listener for submission
    

    // TODO: Write a document-level listener with an anonymous function to score a question
    


    /** Helper Function(s) **/

    function shuffle(array) {
        let current = array.length, temporaryValue, randomIndex;
        while (0 !== current) { 
            randomIndex = Math.floor(Math.random() * current);
            current -= 1;
            temporaryValue = array[current];
            array[current] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

}

