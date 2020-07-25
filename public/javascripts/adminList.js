// This will remove the Add Admin modal on form submit
$('#button').submit(function(e) {
  e.preventDefault();
  // Coding

  $('#IDModal').modal('toggle'); 
  //or  $('#IDModal').modal('hide');
  
  return false;
});

const toggleLock = (id) => {
  // Handle Logic
  alert("Toggle Admin Function is in adminList.js file")

}

const deleteAdmin = (id) => {
  // Handle Logic
  alert("Delete Admin Function is in adminList.js file")
}