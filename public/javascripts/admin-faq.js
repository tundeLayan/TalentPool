// MAIN PAGE NAV LDKDHHFHFHFJDJDDHDHDHDJJJ

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}


// accordion script?
$(document).ready(function(){
// Add minus icon for collapse element which is open by default
  $(".collapse.show").each(function(){
    $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
  });
  
  // Toggle plus minus icon on show hide of collapse element
  $(".collapse").on('show.bs.collapse', function(){
    $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
  }).on('hide.bs.collapse', function(){
    $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
  });
});

$(".deleteCategory").click(function(){
  const id = this.id.split(' ')[1];
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type: "DELETE",
    url: "/admin/faq/category",
    data:{
      'categoryId':id
    },
    success: function (result){
      window.location.reload()
    }
  })
})

$(".deleteFaq").click(function(){
  const id = this.id.split(' ')[1];
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type: "DELETE",
    url: "/admin/faq",
    data: {
      id
    },
    success: function (result){
      window.location.reload();
    }
  })
})

$('#addTopicButton').click(function(){
  const name = $("#topicNameField").val();
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type:'POST',
    url: '/admin/faq/category/',
    data: {
      name
    },
    success: function (result){
      window.location.reload(true)
    }
  })
})

$("#addFaq").click(function(){
  const categoryId = $("#categorySelectInput").val();
  const question = $("#addAnswer").val();
  const answer = $("#addQuestion").val();
  const body = {
    categoryId,
    question,
    answer
  }
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type:'POST',
    url: '/admin/faq',
    data: body,
    success: function(result){
      window.location.reload();
    }
  })
})


$(".toggleButton").click(function(){
  const id = this.id.split(' ')[1];
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type:"PATCH",
    url: "/admin/faq/toggle",
    data: { id },
    success: function (result){

    }
  })
})

$(".editIcon").click(function(){
  const categoryId = this.id.split(' ')[1];
  const initName = $("#category"+categoryId).text();
  $("#topicNameFieldUpdate").val(initName);
  $("#topicUpdateId").val(categoryId)
  $("#myModalUpdate").modal('show');
})


$("#updateTopicButton").click(function(){
  const name = $("#topicNameFieldUpdate").val();
  const categoryId = $("#topicUpdateId").val();
  const body = {name,categoryId};
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type:"PUT",
    url: "/admin/faq/category",
    data: body,
    success: function (result){
      window.location.reload();
    }

  })
})


$(".editFaq").click(function(){
  const id = this.id.split(' ')[1];
  const initQuestion = $("#faqQuestion"+id).text();
  const initCategory = $("#faqCategory"+id).text();
  const initAnswer = $("#faqAnswer"+id).text();
  $("#updateQuestion").val(initQuestion);
  $("#updateAnswer").text(initAnswer);
  $("#categorySelectUpdate").val(initCategory);
  $("#updateFaqId").val(id);
  $("#updateFaqModal").modal('show');  

})


$("#updateFaq").click(function(){
  const question = $("#updateQuestion").val();
  const answer = $("#updateAnswer").val();
  const category = $("#categorySelectUpdate").val();
  const id = $("#updateFaqId").val()
  const body = {
    question,
    answer,
    category,
    id
  }
  let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Csrf-token',token)
    }
  });
  $.ajax({
    type:"PUT",
    url:"/admin/faq/update",
    data: body,
    success: function (result){
      window.location.reload();
    }
  })
})