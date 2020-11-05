$(document).ready(function () {
  // display login form
  $(".welcome .primary").click(function () {
    $(".welcome").hide();
    $(".signinform").fadeIn();
  });
  // display welcome after login
  $(".signinform .minor").click(function () {
    $(".signinform").hide();
    $(".welcome").fadeIn();
  });
  // display signup form
  $(".welcome .signupbutton").click(function () {
    $(".welcome").hide();
    $(".signupform").fadeIn();
  });

  // display welcome after signup
  $(".signupform .minor").click(function () {
    $(".signupform").hide();
    $(".welcome").fadeIn();
  });

  // signinform validation
  $(".signinform input").keyup(function () {
    var username = $.trim($(".signinform input[name=name]").val());
    var password = $.trim($(".signinform input[name=password]").val());

    console.log(username);
    console.log(password);
    if (username.length > 0 && password.length > 0) {
      $(".signinform  .primary").removeClass("disabled");
    } else {
      $(".signinform  .primary").addClass("disabled");
    }
  });
  // signupform validation
  $(".signupform input").keyup(function () {
    var username = $.trim($(".signupform input[name=name]").val());
    var password = $.trim($(".signupform input[name=password]").val());
    console.log(password);
    if (username.length > 0 && password.length > 0) {
      $(".signupbutton").removeClass("disabled");
    } else {
      $(".signupbutton").addClass("disabled");
    }
  });
});
