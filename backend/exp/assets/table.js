var t1itle;
var content;
var item;

function sendStartingSignalToServer() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/data", true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      item = JSON.parse(xhr.responseText);
      console.log(item);
      t1itle = item.title;
      content = item.content;
      let mountains = [{ [t1itle]: content }];
      let table = document.querySelector("table");
      let data = Object.keys(mountains[0]);
      generateTable(table, mountains); // generate the table first
      generateTableHead(table, data); // then the head
    }
  };
  xhr.send();
}
// t1itle = item.title;
// content = item.content;

// let mountains = [{ [t1itle]: content }];

// console.log(t1itle);
// let mountains = [
//   { [t1itle]: content },
//   { [t1itle]: content },
//   { [t1itle]: content },
// ];

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}
// mountains = sendStartingSignalToServer();
// let table = document.querySelector("table");
// let data = Object.keys(mountains[0]);
// mountains = sendStartingSignalToServer();
// generateTable(table, mountains); // generate the table first

// generateTableHead(table, data); // then the head

sendStartingSignalToServer();
