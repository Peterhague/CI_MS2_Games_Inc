/*initialises the emailJS interface
CREDIT: significant help provided by Code Institute walkthrough instruction of emailJS integration.
CREDIT: EmailJS API code, for the sending of automated emails
*/
(function() {
    emailjs.init("user_TnGv5LfOGP5Nqwj1AQR0U");
  })();
/*passes the emailJS API the necessary inputs to send the automated email when in mobile configuration*/
function sendMailMobile(contactForm) {
    emailjs.send("service_epz8iti", "contact_form", {
        "first_name": contactForm.firstName.value,
        "last_name": contactForm.lastName.value,
        "email_address": contactForm.emailAddress.value,
        "message": contactForm.suggestion.value,
    })
    .then(
        function (response) {
            console.log("success", response);
        },
        function (error) {
            console.log("Failed", error);
        });
    return false;    
}
/*passes the emailJS API the necessary inputs to send the automated email when in desktop configuration*/
function sendMailDesktop(contactForm) {
    emailjs.send("service_epz8iti", "contact_form", {
        "first_name": contactForm.firstNameDesktop.value,
        "last_name": contactForm.lastNameDesktop.value,
        "email_address": contactForm.emailAddressDesktop.value,
        "message": contactForm.suggestionDesktop.value,
    });
    return false;    
}
/*function to validate the form for user idea submissions.
Checks if mobile or desktop form should be addressed, then:
Checks that all fields are populated.
Checks that the name fields contain only letters.
Checks that the email address field is populated and is in a valid format
Checks that the message textarea is populated
If all the conditions are met then the sendMail function is called and an email is sent via emailJS.
@param that [user suggestions form]
*/
function formValidation(that) {
    if (that.id === "contact-form-desktop") {
        let fName = document.forms["ideasFormDesktop"]["firstNameDesktop"].value;
        let lName = document.forms["ideasFormDesktop"]["lastNameDesktop"].value;
        let email = document.forms["ideasFormDesktop"]["emailAddressDesktop"].value;
        let suggestion = document.forms["ideasFormDesktop"]["suggestionDesktop"].value;
        let errormsg = document.getElementById("formErrorMessage");
        let showMessage = document.getElementById("navigateToFooter");
        let letters = /^[A-Za-z]+$/;
        let emailContent = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (fName == "") {
            errormsg.innerHTML = "**Please enter your first name**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (lName == "") {        
            errormsg.innerHTML = "**Please enter your last name**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (!fName.match(letters) || !lName.match(letters)) {        
            errormsg.innerHTML = "**The name fields should only contain characters A-Z**";
            showMessage.click();
            return false;
        } else if (email == "") {
            errormsg.innerHTML = "**Please enter your email address**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (!email.match(emailContent)) {
            errormsg.innerHTML = "**Please enter a valid email address**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (suggestion == "") {
            errormsg.innerHTML = "**Please enter your message**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else {
            sendMailDesktop(that);
            errormsg.innerHTML = `Thanks for getting in touch!<br>We'll get back to you soon <i class="far fa-smile"></i>`;
            errormsg.classList.remove("text-red");
            errormsg.classList.add("text-green");
            showMessage.click();
            return false;
        }   
    } else {
        let fName = document.forms["ideasForm"]["firstName"].value;
        let lName = document.forms["ideasForm"]["lastName"].value;
        let email = document.forms["ideasForm"]["emailAddress"].value;
        let suggestion = document.forms["ideasForm"]["suggestion"].value;
        let errormsg = document.getElementById("formErrorMessage");
        let showMessage = document.getElementById("navigateToFooter");
        let letters = /^[A-Za-z]+$/;
        let emailContent = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (fName == "") {
            errormsg.innerHTML = "**Please enter your first name**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (lName == "") {        
            errormsg.innerHTML = "**Please enter your last name**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (!fName.match(letters) || !lName.match(letters)) {        
            errormsg.innerHTML = "**The name fields should only contain characters A-Z**";
            showMessage.click();
            return false;
        } else if (email == "") {
            errormsg.innerHTML = "**Please enter your email address**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (!email.match(emailContent)) {
            errormsg.innerHTML = "**Please enter a valid email address**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else if (suggestion == "") {
            errormsg.innerHTML = "**Please enter your message**";
            errormsg.classList.add("text-red");
            errormsg.classList.remove("text-green");
            showMessage.click();
            return false;
        } else {
            sendMailMobile(that);
            errormsg.innerHTML = `Thanks for getting in touch!<br>We'll get back to you soon <i class="far fa-smile"></i>`;
            errormsg.classList.remove("text-red");
            errormsg.classList.add("text-green");
            showMessage.click();
            return false;
        }
    }
}