function signIn()
{
    check = true;
    let cusEmail = document.getElementById('inputEmail').value;
    if (cusEmail.endsWith("@gmail.com")){
        document.getElementById("Email").innerHTML = `<span style="color: green;">Valid Email entered</span>`;
    } else {
        document.getElementById("Email").innerHTML = `<span style="color: red;">Email is not valid. Must end with '@gmail.com'.</span>`;
        check = false;
    }

    let cusPassword = document.getElementById('inputPass').value;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(passwordPattern.test(cusPassword)){
        document.getElementById("Password").innerHTML= `<span style="color: green;">Valid password entered</span>`;
    }else{
        document.getElementById("Password").innerHTML = `<span style="color: red;">Please enter a valid password in the format. Ensure 8 character, 1 uppercash, 1 lowercase, 1 number, 1 special character.</span>`;
        check = false;
    }
}
function createAcc() {
    if (!checkAccValidation())
    {
        alert("invalid input!");
        return false;
    }
    return true;
}

function checkAccValidation()
{
    let check = true;
    let creatAccForm = document.getElementById("createAccForm");
    let userName = document.getElementById("inputUser").value;
    
    if (userName.length == 0) {
        document.getElementById("userName").innerHTML =  `<span style="color: red;">User Name is not valid.</span>`;
        check = false;
    } else {
        document.getElementById("userName").innerHTML =  `<span style="color: green;">User Name is valid.</span>`;
    }

    let userEmail = document.getElementById('inputEmail').value;
    if (userEmail.endsWith("@gmail.com")) {
        document.getElementById("Email").innerHTML = `<span style="color: green;">Valid Email entered</span>`;
    } else {
        document.getElementById("Email").innerHTML = `<span style="color: red;">Email is not valid. Must end with '@gmail.com'.</span>`;
        check = false;
    }

    let cusPassword = document.getElementById('inputPass').value;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(passwordPattern.test(cusPassword)){
        document.getElementById("Password").innerHTML= `<span style="color: green;">Valid password entered</span>`;
    } else {
        document.getElementById("Password").innerHTML = `<span style="color: red;">Please enter a valid password in the format. Ensure 8 character, 1 uppercase, 1 lowercase, 1 number, 1 special character.</span>`;
        check = false;
    }
    return check;
}