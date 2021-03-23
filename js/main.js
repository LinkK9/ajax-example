$(document).ready(function () {
  $("#add-user").on("click", function () {
    $.post(
      "https://linhtrinhviet.herokuapp.com/users",
      {
        name: $("#name").val(),
        birthday: $("#birthYear").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
      },
      function () {
        window.location.href = "/";
      }
    );
  });

  $("#btn-save").on("click", function () {
    let searchParams = new URLSearchParams(window.location.search);
    let userId = searchParams.get("id");

    $.ajax({
      method: "PUT",
      url: "https://linhtrinhviet.herokuapp.com/users" + "/" + userId,
      data: {
        name: $("#name").val(),
        birthday: $("#birthYear").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
      },
    }).done(function () {
      window.location.href = "/";
    });
  });

  $(".delete-row").on("click", function () {
    let delId = $(this).attr("rowid");
    console.log("press on id:" + delId);
    $(this).parent().parent().remove();
    $.ajax({
      method: "DELETE",
      url: "https://linhtrinhviet.herokuapp.com/users" + "/" + delId,
    }).done(function () {
      console.log("deleted user's id: " + delId);
    });

    // loadDoc();
  });
});

// // multi delete
// $("#del-button").on("click", function () {
//   let checkedArr = [];
//   let checkGroup = $(".check-del");
//   for (let i = 0; i < checkGroup.length; i++) {
//     if ($($("check-del")[i]).is(":checked")) {
//       checkedArr.push($($("check-del")[i].attr("name")));
//     }
//   }

//   if(checkedArr.length > 0){
//     $("#multi-del").on("click", function(){
//       for(let i = 0; i < checkedArr.length; i++){
//         $("a[rowid = " + checkedArr[i] + "]").parent().parent().remove();
//         $.ajax({
//           method: "DELETE",
//           url: "https://linhtrinhviet.herokuapp.com/users" + "/" + checkedArr[i],
//         }).done(function () {
//           console.log("deleted user's id: " + checkedArr[i]);
//         });
//       }
//     })
//   }else{
//     $(".modal").css("display", "none");
//   }
// });
