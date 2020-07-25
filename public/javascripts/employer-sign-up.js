const Model ={
  getFormData(formElem){
    const data = Object.fromEntries(new FormData(formElem).entries());
    console.log(data)
    return data;
  }
}

const View ={
  styleInputAsInvalid(elem){
    elem.classList.remove('prj-input-valid')
    elem.classList.add('prj-input-invalid')
  },
  styleInputAsDefault(elem){
    elem.classList.remove('prj-input-invalid')
    elem.classList.remove('prj-input-valid')
  },
  styleInputAsValid(elem){
    elem.classList.remove('prj-input-invalid')
    elem.classList.add('prj-input-valid')
  },
  displayInvalidFormMessage(){
    console.log('Form is invalid');
  }
}

// TODO: FIX THIS, password matching wrong
const Controller ={
  initComponent(){
    Controller.initEventListeners()
  },
  initEventListeners(){
    // document.forms.employerSignUpForm
    //   .addEventListener('submit', Controller.initFormSubmission, false);
      document.querySelectorAll('input').forEach((inputEl) => {
        inputEl.addEventListener('blur', Controller.validateInput, false)
      })
      document
      .getElementById("password")
      .setCustomValidity(
        "Password must be at least 8 characters long. It must also contain at least one upper case character, one lower case character, a number and a special character"
      );
  },
  initFormSubmission(event){
    event.preventDefault();
    const isValidForm = Controller.validateForm(document.forms.employerSignUpForm);
    if(!isValidForm){
      View.displayInvalidFormMessage()
      return;
    }
    const employerSignUpData = Model.getFormData(document.forms.employerSignUpForm);
  },
  validateInput(event){
    const {target} = event;
    isValidInput = target.checkValidity()
    if(!isValidInput){
      View.styleInputAsInvalid(target)
    }else{
      View.styleInputAsValid(target)
    }
  },
  validateForm(formElem){
    return formElem.reportValidty()
  }
}

Controller.initComponent()
