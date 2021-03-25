// check All
$(".check-all").change(function () {
  let checkGroup = $(".check-del");

  if(this.checked){
      console.log("yes");
    for (let i = 0; i < checkGroup.length; i++) {
        if (!$(checkGroup[i]).is(":checked")) {
          $(checkGroup[i]).attr("checked")
        }
      };
  }else{
    for (let i = 0; i < checkGroup.length; i++) {
        if ($(checkGroup[i]).is(":checked")) {
          $(checkGroup[i]).removeAttr("checked")
        }
      };
  }
  
});
