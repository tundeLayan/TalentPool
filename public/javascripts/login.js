// const Model = {
//   getFormData(formElem) {
//     const data = Object.fromEntries(new FormData(formElem).entries());
//     return data;
//   },
// };

// const View = {
//   styleInputAsInvalid(elem) {
//     elem.classList.remove('prj-input-valid');
//     elem.classList.add('prj-input-invalid');
//   },
//   styleInputAsDefault(elem) {
//     elem.classList.remove('prj-input-invalid');
//     elem.classList.remove('prj-input-valid');
//   },
//   styleInputAsValid(elem) {
//     elem.classList.remove('prj-input-invalid');
//     elem.classList.add('prj-input-valid');
//   },
//   displayInvalidFormMessage() {
//     console.log('Form is invalid');
//   },
// };

// const Controller = {
//   initComponent() {
//     Controller.initEventListeners();
//   },
//   initEventListeners() {
//     document.forms.loginForm.addEventListener(
//       'submit',
//       Controller.initFormSubmission,
//       false,
//     );
//     document.querySelectorAll('input').forEach((inputEl) => {
//       inputEl.addEventListener('blur', Controller.validateInput, false);
//     });
//   },
//   initFormSubmission(event) {
//     event.preventDefault();
//     const isValidForm = Controller.validateForm(document.forms.loginForm);
//     if (!isValidForm) {
//       View.displayInvalidFormMessage();
//       return;
//     }
//     const employerSignUpData = Model.getFormData(document.forms.loginForm);
//   },
//   validateInput(event) {
//     const { target } = event;
//     isValidInput = target.checkValidity();
//     if (!isValidInput) {
//       View.styleInputAsInvalid(target);
//     } else {
//       View.styleInputAsValid(target);
//     }
//   },
//   validateForm(formElem) {
//     return formElem.reportValidity();
//   },
// };

// Controller.initComponent();
