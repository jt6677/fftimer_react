var minutes;
var seconds;
var timer = 0;
var control;
var totalSessionCompleted = 0;
var startingTime;
var newduration;

// function sendSignalToServer() {
//     var xhr = new XMLHttpRequest();
//        xhr.open('POST', '/timeup', true);
//        xhr.addEventListener('readystatechange', function() {
//            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//               var item = xhr.responseText;
//               prependTimeStamp (item)

//            }
//        });
//        xhr.send("HelleJessica");
//    }
// getDurationFromGo();
// function getDurationFromGo() {
//   var xhr = new XMLHttpRequest();
//   xhr.open(`POST`, `/getdurationfromgo`, true);
//   xhr.addEventListener(`readystatechange`, function () {
//     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//       var item = xhr.responseText;
//       timerNew = JSON.parse(item);
//     }
//   });
//   xhr.send("HelleJessica");
// }

$(".my_audio").trigger("load");
$(".start").on(`click`, function () {
  // $(this).toggleClass('running');
  control = true;
  $(`.pause`).removeAttr(`id`);
  $(`.pause`).removeAttr(`disabled`);
  $(this).attr(`id`, `myButtonDisabled`);
  $(this).attr(`disabled`, `true`);
  // if ($(this).hasClass('running')) {// $(this).attr('id', '');
  if (timer === 0) {
    sendStartingSignalToServer();
  } else {
    startTimer(timer, control);
  }
});

function startTimer(duration, control) {
  timer = duration;
  if (control === true) {
    control = false;
    var x = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      $("#minute").html(minutes);
      $("#second").html(seconds);
      //pause func
      $(`.pause`).click(function () {
        $(`.start`).removeAttr(`id`);
        $(`.start`).removeAttr(`disabled`);
        $(`.pause`).attr(`id`, `myButtonDisabled`);
        $(`.pause`).attr(`disabled`, `true`);
        clearInterval(x);
      });
      //timeup
      if (--timer < 0) {
        $(".my_audio").trigger("play");
        sendEndingSignalToServer();
        $(`.start`).removeAttr(`id`);
        $(`.start`).removeAttr(`disabled`);
        $(`.pause`).attr(`id`, `myButtonDisabled`);
        $(`.pause`).attr(`disabled`, `true`);
        // timer = duration;
        timer = 0;
        clearInterval(x);
      }
    }, 1000);
  }
}
function sendStartingSignalToServer() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/starting", true);
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var item;
      item = JSON.parse(xhr.responseText);

      startingTime = item.startingtime;
      newduration = item.timeduration;
      $("#demo").prepend(` Start :` + startingTime);
      startTimer(newduration, control);
    }
  });
  xhr.send("HelleJessica");
}

function sendEndingSignalToServer() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/ending", true);
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var endingTime = xhr.responseText;
      endingTime = JSON.parse(endingTime);
      prependTimeStamp(endingTime);
    }
  });
  xhr.send("HelleJessica");
}

function prependTimeStamp(endingTime) {
  //  var sessionLeft;
  // //  var today = new Date();
  // //    datetext = today.toTimeString()
  // // datetext = datetext.split(' ')[0];
  // sessionLeft = totalsession;
  totalSessionCompleted++;
  var sessionStringNum;
  if (totalSessionCompleted <= 9) {
    sessionStringNum = "0" + totalSessionCompleted.toString();
  } else {
    sessionStringNum = totalSessionCompleted.toString();
  }

  $("#demo").prepend(sessionStringNum + `   Ended   :` + endingTime + `---`);
  $("#demo").prepend(`<br>`);

  // $("#demo").prepend(`<br>` )
  //took out `--` + datetext +
}
