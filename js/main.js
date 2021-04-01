// Global var
const API = "https://linhtrinhviet.herokuapp.com/";
const API_USERS = API + "users";
let page = "1";
let limit = "10";
let sortType = "id";
let orderType = "desc";
let isLogIn = false;
let token = localStorage.getItem("token");
let bearerToken = "Bearer " + token;
let url =
  API_USERS +
  `?_page=${page}&_limit=${limit}&_sort=${sortType}&_order=${orderType} `;

let templateLoading = `<td colspan="5" id="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </td>`;
// tickcheck
$(".check-all").click(function () {
  $("input:checkbox").prop("checked", this.checked);
});

// Get data
function renderAPI(_page, _limit, _sortType, _orderType) {
  $.get(
    API_USERS +
      `?_page=${_page}&_limit=${_limit}&_sort=${_sortType}&_order=${_orderType}&q=${searchContent} `,
    function (data, status, req) {
      $("#loading").hide();
      console.log("Status: " + status);
      for (let i = 0; i < data.length; i++) {
        $("tbody").append(
          `<tr>
                    <td>
                        <input type="checkbox" class="check-del mr-3" name=${data[i].id}>
                        ${data[i].name}
                        </td>
                    <td>${data[i].birthday}</td>
                    <td>${data[i].email}</td>
                    <td>${data[i].phone}</td>
                    <td>
                        <a href="edit.html?id=${data[i].id}"><i class="fa fa-edit"></i> Chỉnh sửa</a>
                        <a rowid="${data[i].id}" class="text-danger delete-row float-right" data-toggle="modal"
                            data-target="#alertModal" ><i class="fa fa-trash-alt"></i> Xóa</a>
                    </td>
            </tr>`
        );
      }

      // Delete a row
      delRow();
    }
  );
}
// delete a row
function delRow() {
  $(".delete-row").css("cursor", "pointer");
  $(".delete-row").on("click", function () {
    if (isLogIn) {
      let delId = $(this).attr("rowid");
      let name = $(this).parent().prev().prev().prev().prev().text();
      $(".modal-title").text("Bạn có muốn xóa thành viên " + name + "?");
      $("#alertModal").modal("show");
      $("#multi-del")
        .off("click")
        .on("click", function () {
          $(".delete-row[rowid=" + delId + "]")
            .parent()
            .parent()
            .remove();
          $.ajax({
            method: "DELETE",
            url: API_USERS + "/" + delId,
            headers: {
              'Authorization': bearerToken,
           },
          }).done(function () {
            console.log("deleted user's id: " + delId);
          }).fail(function(){
            isLogIn = false;
            $("#loginModal").modal("show");
          });
        });
    }else{
      $("#loginModal").modal("show");
    }
  });
}
// search
let searchContent = "";
$("#search-button")
  .off("click")
  .click(function () {
    searchContent = $("#input-search").val();
    $("tbody").children().remove();
    $("tbody").append(templateLoading);
    $.get(
      `${API_USERS}?_limit=${limit}&_sort=${sortType}&_order=${orderType}&q=${searchContent}`,
      function (data, status, req) {
        $("#loading").hide();
        console.log("Status: " + status);
        for (let i = 0; i < data.length; i++) {
          $("tbody").append(
            `<tr>
                      <td>
                          <input type="checkbox" class="check-del mr-3" name=${data[i].id}>
                          ${data[i].name}
                          </td>
                      <td>${data[i].birthday}</td>
                      <td>${data[i].email}</td>
                      <td>${data[i].phone}</td>
                      <td>
                          <a href="edit.html?id=${data[i].id}"><i class="fa fa-edit"></i> Chỉnh sửa</a>
                          <a rowid="${data[i].id}" class="text-danger delete-row float-right" data-toggle="modal"
                              data-target="#alertModal" ><i class="fa fa-trash-alt"></i> Xóa</a>
                      </td>
              </tr>`
          );
        }

        pagination(data, status, req);
        // $.get(API_USERS + `?q=` + searchContent).done(pagination);
        // Delete a row
        delRow();
      }
    );
  });

// pagination
let totalRow = 0;
let totalPages = 0;
let pageNumber = 1;
function pagination(data, status, req) {
  console.log("get all data status: " + status);
  totalRow = req.getResponseHeader("X-Total-Count");
  console.log("total row: " + totalRow);

  if (totalRow % limit === 0) {
    totalPages = totalRow / limit;
  } else {
    totalPages = Math.floor(totalRow / limit) + 1;
  }
  console.log("so trang la: " + totalPages);
  $(".page-numbers").parent().remove();
  if (totalPages > 5) {
    for (let i = 1; i <= 5; i++) {
      $("#next-page")
        .parent()
        .before(
          `<li class="page-item"><a class="page-link page-numbers" href="#">${i}</a></li>`
        );
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      $("#next-page")
        .parent()
        .before(
          `<li class="page-item"><a class="page-link page-numbers" href="#">${i}</a></li>`
        );
    }
  }

  $(".pagination").children().removeClass("click-on");
  $("#prev-page").parent().next().children().addClass("click-on");
  $(".page-numbers").click(function () {
    $(".page-link").removeClass("click-on");
    $(this).addClass("click-on");
    pageNumber = $(this).text();
    $("tbody").children().remove();
    $("tbody").append(templateLoading);
    renderAPI(pageNumber, limit, sortType, orderType);
  });
  $("#prev-page")
    .off("click")
    .click(function () {
      if (+$(this).parent().next().find(".page-numbers").text() > 1) {
        let pageNumbers = $(".page-numbers");
        for (let i = 0; i < pageNumbers.length; i++) {
          let thisNumber = $(pageNumbers[i]).text();
          $(pageNumbers[i]).text(+thisNumber - 1);
        }
      }
      let thisClick = +$(".click-on").text();
      let thisIndex = 0;
      if (thisClick === 5) {
        thisIndex = 4;
      } else {
        thisIndex = (thisClick % 5) - 1;
      }
      if (thisClick > 1 && thisClick <= 5) {
        let pageNumbers = $(".page-numbers");
        $(".page-link").removeClass("click-on");
        $(pageNumbers[thisIndex - 1]).addClass("click-on");
      }
      pageNumber = $(".click-on").text();
      $("tbody").children().remove();
      $("tbody").append(templateLoading);
      renderAPI(pageNumber, limit, sortType, orderType);
    });
  $("#next-page")
    .off("click")
    .click(function () {
      if (
        +$(this).parent().prev().find(".page-numbers").text() !== totalPages
      ) {
        let pageNumbers = $(".page-numbers");
        for (let i = 0; i < pageNumbers.length; i++) {
          let thisNumber = $(pageNumbers[i]).text();
          $(pageNumbers[i]).text(+thisNumber + 1);
        }
      }

      let thisClick = +$(".click-on").text();
      let thisIndex = 0;
      if (thisClick === 5) {
        thisIndex = 4;
      } else {
        thisIndex = (thisClick % 5) - 1;
      }
      if (thisClick > +totalPages - 4 && thisClick < +totalPages) {
        console.log(thisClick);
        console.log(thisIndex);
        let pageNumbers = $(".page-numbers");
        $(".page-link").removeClass("click-on");
        $(pageNumbers[thisIndex + 1]).addClass("click-on");
      }

      pageNumber = $(".click-on").text();
      $("tbody").children().remove();
      $("tbody").append(templateLoading);
      renderAPI(pageNumber, limit, sortType, orderType);
    });
  $("#last-page")
    .off("click")
    .click(function () {
      $(".page-numbers").parent().remove();
      if (totalPages > 5) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          $("#next-page")
            .parent()
            .before(
              `<li class="page-item"><a class="page-link page-numbers" href="#">${i}</a></li>`
            );
        }
      } else {
        for (let i = 1; i < totalPages; i++) {
          $("#next-page")
            .parent()
            .before(
              `<li class="page-item"><a class="page-link page-numbers" href="#">${i}</a></li>`
            );
        }
      }
      let pageNumbers = $(".page-numbers");
      $(pageNumbers[pageNumbers.length - 1]).addClass("click-on");
      pageNumber = $(".click-on").text();
      $("tbody").children().remove();
      $("tbody").append(templateLoading);
      renderAPI(pageNumber, limit, sortType, orderType);
      $(".page-numbers").click(function () {
        $(".page-link").removeClass("click-on");
        $(this).addClass("click-on");
        pageNumber = $(this).text();
        $("tbody").children().remove();
        $("tbody").append(templateLoading);
        renderAPI(pageNumber, limit, sortType, orderType);
      });
    });

  $("#first-page")
    .off("click")
    .click(function () {
      $(".page-numbers").parent().remove();
      if (totalPages > 5) {
        for (let i = 1; i <= 5; i++) {
          $("#next-page")
            .parent()
            .before(
              `<li class="page-item"><a class="page-link page-numbers" href="#">${i}</a></li>`
            );
        }
      } else {
        for (let i = 1; i < totalPages; i++) {
          $("#next-page")
            .parent()
            .before(
              `<li class="page-item"><a class="page-link page-numbers" href="#">${i}</a></li>`
            );
        }
      }
      let pageNumbers = $(".page-numbers");
      $(pageNumbers[0]).addClass("click-on");
      pageNumber = $(".click-on").text();
      $("tbody").children().remove();
      $("tbody").append(templateLoading);
      renderAPI(pageNumber, limit, sortType, orderType);
      $(".page-numbers").click(function () {
        $(".page-link").removeClass("click-on");
        $(this).addClass("click-on");
        pageNumber = $(this).text();
        $("tbody").children().remove();
        $("tbody").append(templateLoading);
        renderAPI(pageNumber, limit, sortType, orderType);
      });
    });
}

// sort
$("#desc").click(function () {
  $("tbody").children().remove();
  $("tbody").append(templateLoading);
  orderType = "desc";
  $.get(
    API_USERS + `?_page=1&_limit=10&_sort=id&_order=${orderType} `,
    function (data, status) {
      $("#loading").hide();
      console.log("Status: " + status);
      for (let i = 0; i < data.length; i++) {
        $("tbody").append(
          `<tr>
                    <td>
                        <input type="checkbox" class="check-del mr-3" name=${data[i].id}>
                        ${data[i].name}
                        </td>
                    <td>${data[i].birthday}</td>
                    <td>${data[i].email}</td>
                    <td>${data[i].phone}</td>
                    <td>
                        <a href="edit.html?id=${data[i].id}"><i class="fa fa-edit"></i> Chỉnh sửa</a>
                        <a rowid="${data[i].id}" class="text-danger delete-row float-right" data-toggle="modal"
                            data-target="#alertModal" ><i class="fa fa-trash-alt"></i> Xóa</a>
                    </td>
            </tr>`
        );
      }
      // Delete a row
      delRow();
      $.get(API_USERS).done(pagination);
    }
  );
});
$("#asc").click(function () {
  $("tbody").children().remove();
  $("tbody").append(templateLoading);
  orderType = "asc";
  $.get(
    API_USERS + `?_limit=${limit}&_sort=${sortType}&_order=${orderType}`,
    function (data, status) {
      $("#loading").hide();
      console.log("Status: " + status);
      for (let i = 0; i < data.length; i++) {
        $("tbody").append(
          `<tr>
                    <td>
                        <input type="checkbox" class="check-del mr-3" name=${data[i].id}>
                        ${data[i].name}
                    </td>
                    <td>${data[i].birthday}</td>
                    <td>${data[i].email}</td>
                    <td>${data[i].phone}</td>
                    <td>
                        <a href="edit.html?id=${data[i].id}"><i class="fa fa-edit"></i> Chỉnh sửa</a>
                        <a rowid="${data[i].id}" class="text-danger delete-row float-right" data-toggle="modal"
                            data-target="#alertModal" ><i class="fa fa-trash-alt"></i> Xóa</a>
                    </td>
            </tr>`
        );
      }

      // Delete a row
      delRow();
      $.get(API_USERS).done(pagination);
    }
  );
});

// Convert date yyyy-mm-dd ==> dd/mm/yyyy
function revertDate(str) {
  let arr = str.split("-");
  return arr[2] + "/" + arr[1] + "/" + arr[0];
}


// login
$(".loged").hide();
$("#wrong").hide();
$("#log-button").off("click").click( function(){
  $("#loadingModal").modal("show");
  $.ajax({
    method: "POST",
    url: API + "login",
    data: {
      "email" : $("#log-email").val(),
      "password": $("#log-pass").val(),
    }
  }).done(
    function(data, status){
      $("#loginModal").modal("hide");
      $(".modal-backdrop").hide();
      $("#loadingModal").hide();
      console.log("status: " + status);
      localStorage.setItem("token", data.token);
      isLogIn = true;
      $("#log-in").hide();
      $(".loged").show();
      $(".this-user").text("Xin Chào " + data.name + "!");
    }
  ).fail(
    function(status){
      $("#loadingModal").hide();
      $("#wrong").show();
      console.log("status: " + status);
    }
  )
});
