/*
In this exercise, you have to verify the data submitted in the user form:
- User name must be provided (not empty) and must have at least 5 characters
- Email must be provided and should look like xxxxx@yyyy.zzzz
- Password must be provided and must have at least 8 characters
- Repeat password must be the same value as the defined password

BONUS: You can try to implement you password strength function you designed inthe first lesson...

When an element is validated, you can add class "has-success" to the form-group element,
or if the test failed, you have to add class "has-error"

If you try to validate the form by clicking the "Sign in" button, an error message has to
be displayed.
*/


username = document.getElementById('inputUserName');
username.addEventListener('change', checkUsername, false);

function checkUsername()
{	
	if ((username.value == "") || (username.value.length <= 4))
	{
		username.parentNode.parentNode.className = "form-group has-error";
		console.log("username error");
		return false;
	}
	else
	{
		username.parentNode.parentNode.className = "form-group has-success";
		console.log("username success");
		return true;
	}
}

email = document.getElementById('inputEmail3');
email.addEventListener('change', checkEmail,false);

function checkEmail()
{
	if ((username.value == "") || (email.value.search("@") < 0) || (email.value.search(".") < 0))
	{
		email.parentNode.parentNode.className = "form-group has-error";
		console.log("email error");
		return false;
	}
	else
	{
		email.parentNode.parentNode.className = "form-group has-success";
		console.log("email success");
		return true;
	}
}

password = document.getElementById('inputPassword3');
password.addEventListener('change', checkPassword,false);

function checkPassword()
{
	if(password.value.length < 8)
	{
		password.parentNode.parentNode.className = "form-group has-error";
		console.log("password error");
		return false;
	}
	else
	{
		password.parentNode.parentNode.className = "form-group has-success";
		console.log("password success");
		return true;
	}
}

password2 = document.getElementById('inputPassword2');
password2.addEventListener('change', checkPassword2,false);

function checkPassword2()
{
	if ((password2.value.length < 8) || (password2.value != password.value))
	{
		password2.parentNode.parentNode.className = "form-group has-error";
		console.log("password2 error");
		return false;
	}
	else
	{
		password2.parentNode.parentNode.className = "form-group has-success";
		console.log("password2 success");
		return true;
	}
}

b = document.getElementsByClassName("btn btn-default")[0];
b.addEventListener('click',checkButton,false)

function checkButton(ev)
{
	if (!(checkUsername() && checkEmail() && checkPassword2()))
	{
		ev.preventDefault();
		console.log("nope");
	}
}

/*document.body.addEventListener('keypress', display, false);


function display(ev) {
    var keyResult = String.fromCharCode(ev.charCode);
    document.getElementById("idtext").innerHTML = keyResult;
}*/