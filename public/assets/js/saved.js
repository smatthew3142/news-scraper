$(document).on("click", "#modalbutton", function() {
  
  $("#comments").empty();
  var thisId = $(this).attr("data-id");
  $("#articleId").text(thisId);
  
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $("#comments").append("<div id='showComments'></div>");
      
      if (data.comments) {
        $("#showComments").append("<div id='commentThread'>");
          for (var i = 0; i < data.comments.length; i++) {
            $('#commentThread').append("<p id='" + data.comments[i]._id + "'>" + data.comments[i].body + " " +
            "<button class='btn btn-outline-danger' data-id='" + data.comments[i]._id +
            "' id='deleteComment'>Delete</button></p>");
          }
        $('#showComments').append("</div>");
      } 

      else {

        $('#showComments').text("Be the first to comment on this article.");
      }
 
      $("#comments").append("<div class='form-group col-md-12'><textarea class='form-control' placeholder='Leave a Comment...'id='bodyinput' name='body'></textarea></div>");
      
      $("#comments").append("<div class='col-md-12'><button class='btn btn-primary' data-id='" + data._id + "' id='saveComment'>Post</button></div>");
    });
});

//Comment button
$(document).on("click", "#saveComment", function() {
  
  var thisId = $(this).attr("data-id");
  
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      body: $("#bodyinput").val()
    }
  })
    
    .done(function(data) {
      $("#commentThread").empty();
      for (var i = 0; i < data.comments.length; i++) {
        $('#commentThread').append("<p id='" + data.comments[i]._id + "'>" + data.comments[i].body + " " +
            "<button class='btn btn-outline-danger' data-id='" + data.comments[i]._id +
            "' id='deleteComment'>Delete</button></p>");
      }
    });
  $("#bodyinput").val("");
});

// Delete button
$(document).on("click", "#deleteComment", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/comments/" + thisId,
  })
    .done(function(data) {
      $("#" + data._id).remove();
    });
});