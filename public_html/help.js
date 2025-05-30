function submitForm()
{
    let check =true;
    let cusFName = document.getElementById("inputFirstname").value;
    if (cusFName.length==0){
        document.getElementById("FName").innerHTML =  `<span style="color: red;">First Name is not valid.</span>`;
        check = false;
    }else{
        document.getElementById("FName").innerHTML =  `<span style="color: green;">First Name is valid.</span>`
    }

    let cusSName = document.getElementById("inputSurname").value;
    if (cusSName.length==0){
        document.getElementById("SName").innerHTML =  `<span style="color: red;"> Surame is not valid.</span>`;
        check = false;
    }else{
        document.getElementById("SName").innerHTML =  `<span style="color: green;">Surname is valid.</span>`
    }

    let cusEmail = document.getElementById('inputEmail').value;
    if (cusEmail.endsWith("@gmail.com")){
        document.getElementById("cusEmail").innerHTML = `<span style="color: green;">Valid Email entered</span>`;
    } else {
        document.getElementById("cusEmail").innerHTML = `<span style="color: red;">Email is not valid. Must end with '@gmail.com'.</span>`;
        check = false;
    }

    let cusPhone = document.getElementById('inputPhone').value;
    let numPhone = /^04\d{8}$/;
    if (numPhone.test(cusPhone)){
        document.getElementById("phoneCus").innerHTML = `<span style="color: green;">Valid Mobile entered</span>`;
    }else {
        document.getElementById("phoneCus").innerHTML = `<span style="color: red;">Mobile is not valid. Must be in the format '04xxxxxxxx'.</span>`;
        check = false;
    }

    let cusAddress = document.getElementById('inputAddress').value;
    let addressPattern = /^\d+\s[A-z]+\s[A-z]+/;
    if(addressPattern.test(cusAddress)){
        document.getElementById("cusAd").innerHTML= `<span style="color: green;">Valid address entered</span>`;
    }else{
        document.getElementById("cusAd").innerHTML = `<span style="color: red;">Please enter a valid address in the format '1234 Main St'.</span>`;
        check = false;
    }

    let cusCity = document.getElementById('inputCity').value;
    let cityPattern = /^[A-z]+$/;
    if(cityPattern.test(cusCity)){
        document.getElementById("cusCi").innerHTML= `<span style="color: green;">Valid city entered</span>`;
    }else{
        document.getElementById("cusCi").innerHTML = `<span style="color: red;">Please enter a valid city in the format 'Burwood'.</span>`;
        check = false;
    }

    let cusState = document.getElementById('inputState').value;
    if(cusState !== ""){
        document.getElementById("cusSta").innerHTML= `<span style="color: green;">Valid state entered</span>`;
    }else{
        document.getElementById("cusSta").innerHTML = `<span style="color: red;">Please select a valid state.</span>`;
        check = false;
    }

    
    let cusZip = document.getElementById('inputZip').value;
    let numZip = /\d{4}$/;
    if (numZip.test(cusZip)){
        document.getElementById("cusZip").innerHTML = `<span style="color: green;">Valid Zip entered</span>`;
    }else {
        document.getElementById("cusZip").innerHTML = `<span style="color: red;">Zip is not valid. Must be in the format '2067'.</span>`;
        check = false;
    }

    let cusFeed = document.getElementById('inputText').value;
    let feedPattern = /^[A-z]+$/;
    if(feedPattern.test(cusFeed)){
        document.getElementById("cusfeedBack").innerHTML= `<span style="color: green;">Valid text entered</span>`;
    }else{
        document.getElementById("cusfeedBack").innerHTML = `<span style="color: red;">Please enter some text in the box.</span>`;
        check = false;
    }
}
function resetForm(){
    document.getElementById("FName").innerHTML = ``;
    document.getElementById("SName").innerHTML = ``;
    document.getElementById("cusEmail").innerHTML = ``;
    document.getElementById("phoneCus").innerHTML = ``;
    document.getElementById("cusAd").innerHTML = ``;
    document.getElementById("cusCi").innerHTML = ``;
    document.getElementById("cusSta").innerHTML = ``;
    document.getElementById("cusZip").innerHTML = ``;
    document.getElementById("cusfeedBack").innerHTML = ``;
}