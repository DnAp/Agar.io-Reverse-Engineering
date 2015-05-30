
jQuery('#playBtn').click(function() {
    if (jQuery('#iphack').val() != "" ) {
        setRegion(jQuery('#iphack').val());
    }
    return false;
});

$('a[data-toggle="tab"]').on('click', function (e) {
  console.log($(this).attr('tab'));
  $('.tab-pane').each(function(i) {
    $(this).hide();
    console.log(this);
  });
  $("#"+$(this).attr('tab')).show();
  console.log($("#"+$(this).attr('tab')));
});

for (var skin in excludes) {
  $("#skin-list").append("<option>"+excludes[skin]+"</option>");
}

$('#skin-list option').click(function(e) {
        if (e.shiftKey) {
          $('#skin-list').val($(this).val());
        }
      }
);

$('#skin-list').change(function(e) {
    $("#skin-img").attr('src',"http://agar.io/skins/" + $(e.target).val() + ".png");
});

function setSkin(){
  var s = $('#skin-list').val();
  $("#nick").val(s);
  $("#home").show();
}
