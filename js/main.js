$(document).ready(function () {
  $("#add-user").on("click", function () {
    $.post(
      "http://localhost:3000/users",
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
    console.log(userId);
    $("#btn-save").click(function () {
      $.ajax({
        method: "PUT",
        url: "/users" + "/" + userId,
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
  });
});
