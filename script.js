fetch("https://bookaroma-e5c80-default-rtdb.firebaseio.com/bookaroma.json")
  .then((response) => response.json())
  .then((data) => callApi(data));
  
  $( window ).on( "load", function(){
    $('.preload').fadeOut(1000);
  })

var btns = $("#book-list .delete");
var list = $("#book-list ul");
var editList = $("#book-list ul li");
var save = $(".save");
var del = $(".delete");
var add = $("#add-book button");
var edit = $(".edit");
var name = $(".name");
const d = new Date();
var month = d.getMonth() + 1;
var date = d.getDate();
var year = d.getFullYear();
const database = firebase.database();
const rootRef = database.ref('bookaroma');
const autoId = rootRef.push().key;
const auth = firebase.auth();
const email = $("#email");
const password = $("#password")

$(".signup-btn").on("click", function(){
  const promise = auth.createUserWithEmailAndPassword(email.val(), password.val());
  promise.catch( e=>alert(e.message));
  alert("signed up");
})

$(".signin-btn").on("click", function(){
  const promise = auth.signInWithEmailAndPassword(email.val(), password.val());
  promise.catch( e=>alert(e.message));
  alert("signed in");
})

$(".signout-btn").on("click", function(){
auth.signOut();
alert("signed out");
})

auth.onAuthStateChanged(function(user){
  if(user){
    var email = user.email;
    $(".user").text("User: " + email)
  }
  else{
    $(".user").text("User: No active user" )
  }
})

function callApi(api) {
  var uId = auth.currentUser.uid;
  for (let i = 0; i < Object.keys(api).length; i++) {
    if(api[Object.keys(api)[i]].userId == uId){
    list.append(`
    <li data-key=${JSON.stringify(Object.keys(api)[i])}>
      <span class="name">${api[Object.keys(api)[i]].title}</span>
      <span class="date">${api[Object.keys(api)[i]].date}</span>
      <span class="delete">Delete</span>
      <span class="edit">Edit</span>
    </li>`);
  }
}
}

//save ,edit and delete
list.on("click", function (e) {
  if ($(e.target).hasClass("delete")) {
    $(e.target).parent().remove();
    rootRef.child($(e.target).parent().attr('data-key')).remove();
  }

  if ($(e.target).hasClass("edit")) {
    $(e.target).siblings(".name").attr("contentEditable", "");
    $(e.target).text("Save");
    $(e.target).addClass("save");
    $(e.target).removeClass("edit");
    $(e.target).siblings(".name").focus();
  } else if ($(e.target).hasClass("save")) {
    if ($(e.target).siblings(".name").text() == "") {
      $(e.target).parent().remove();
    } else {
      $(e.target).siblings(".name").removeAttr("contentEditable");
      $(e.target).text("Edit");
      $(e.target).removeClass("save");
      $(e.target).addClass("edit");
      const update = {
        date: date + "/" + month + "/" + year,
        title: $(e.target).siblings(".name").text(),
      }
      rootRef.child($(e.target).parent().attr('data-key')).update(update);
    }
  }
});

// add forms
const names = $(".name");
const addForm = $("#add-book");
addForm.on("submit", function (e) {
  e.preventDefault();
  var value = $('#add-book input[type="text"]').val();
  for (let i = 0; i < $(".name").length; i++) {
    if (value == $(".name")[i].textContent) {
      alert("duplicate");
      var checked = false;
      break;
    }
    if (value == "") {
      alert("please enter a book name");
      break;
    } else {
      var checked = true;
    }
  }
  if (checked) {
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();
    var uId = auth.currentUser.uid;
    list.append(`
    <li>
      <span class="name">${value}</span>
      <span class="date">${date + "/" + month + "/" + year}</span>
      <span class="delete">Delete</span>
      <span class="edit">Edit</span>
    </li>`);
    rootRef.child(autoId).set({
      title: $('#add-book input[type="text"]').val(),
      date: date + "/" + month + "/" + year,
      userId: uId
  })

  }
});
// //hide books
const hideBooks = $("#hide");
hideBooks.on("change", function (e) {
  if (hideBooks.is(":checked")) {
    list.css("display", "none");
  } else {
    list.css("display", "block");
  }
});

// //search
$(document).ready(function () {
  $("#search-books input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("li").filter(function () {
      $(this).toggle(
        $(this).find(".name").text().toLowerCase().indexOf(value) > -1
      );
    });
  });
});

function jsonMaker(v, d, m, y) {
  console.log(v, d, m, y);

  var json = {
    title: v,
    date: `${d}/${m}/${y}`,
  };
  console.log(json);
  fetch("https://bookaroma-e5c80-default-rtdb.firebaseio.com/bookaroma.json", {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json",
    },
  });
}



























