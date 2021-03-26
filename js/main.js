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




