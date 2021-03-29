// Global var
const API = "https://linhtrinhviet.herokuapp.com/";
const API_USERS = API + "users";
let page = "1";
let limit = "10";
let sortType = "id";
let orderType = "desc";

// tickcheck
$(".check-all").click(function () {
  $("input:checkbox").prop("checked", this.checked);
});

// search
$("#search-button")
  .off("click")
  .click(function () {
    let searchContent = $("#input-search").val();
    $("tbody").children().remove();
    $("tbody").append(
      `<td colspan="5" id="loading" class="text-center">
                  <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                  </div>
              </td>`
    );
    $.get(API_USERS + `?_limit=${limit}&_sort=${sortType}&_order=${orderType}` + `&q=` + searchContent, function (data, status) {

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

      pagination(data, status);

      // Delete a row
      $(".delete-row").css("cursor", "pointer");
      $(".delete-row").on("click", function () {
        let delId = $(this).attr("rowid");
        let name = $(this).parent().prev().prev().prev().prev().text();
        $(".modal-title").text("Bạn có muốn xóa học viên " + name + "?");
        $("#multi-del")
          .off("click")
          .on("click", function () {
            $(".delete-row[rowid=" + delId + "]")
              .parent()
              .parent()
              .remove();
            $.ajax({
              method: "DELETE",
              url: "https://linhtrinhviet.herokuapp.com/users" + "/" + delId,
            }).done(function () {
              console.log("deleted user's id: " + delId);
            });
          });
      });
    });
  });

// pagination
let totalRow = 0;
let totalPages = 0;
let pageNumber = 1;
function pagination(data, status) {
  console.log("get all data status: " + status);
  totalRow = data.length;
  console.log("total row: " + totalRow);

  if (totalRow % limit === 0) {
    totalPages = totalRow / limit;
  } else {
    totalPages = Math.floor(totalRow / limit) + 1;
  }
  console.log("so trang la: " + totalPages);
  $(".page-numbers").remove();
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
    $("tbody").append(
      `<td colspan="5" id="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </td>`
    );
    loadDoc(pageNumber, limit, sortType, orderType);
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
      $("tbody").append(
        `<td colspan="5" id="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </td>`
      );
      loadDoc(pageNumber, limit, sortType, orderType);
    });
  $("#next-page").click(function () {
    if (+$(this).parent().prev().find(".page-numbers").text() !== totalPages) {
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
    $("tbody").append(
      `<td colspan="5" id="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </td>`
    );
    loadDoc(pageNumber, limit, sortType, orderType);
  });
  $("#last-page").click(function () {
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
    $("tbody").append(
      `<td colspan="5" id="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </td>`
    );
    loadDoc(pageNumber, limit, sortType, orderType);
    $(".page-numbers").click(function () {
      $(".page-link").removeClass("click-on");
      $(this).addClass("click-on");
      pageNumber = $(this).text();
      $("tbody").children().remove();
      $("tbody").append(
        `<td colspan="5" id="loading" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </td>`
      );
      loadDoc(pageNumber, limit, sortType, orderType);
    });
  });

  $("#first-page").click(function () {
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
    $("tbody").append(
      `<td colspan="5" id="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </td>`
    );
    loadDoc(pageNumber, limit, sortType, orderType);
    $(".page-numbers").click(function () {
      $(".page-link").removeClass("click-on");
      $(this).addClass("click-on");
      pageNumber = $(this).text();
      $("tbody").children().remove();
      $("tbody").append(
        `<td colspan="5" id="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </td>`
      );
      loadDoc(pageNumber, limit, sortType, orderType);
    });
  });
}
