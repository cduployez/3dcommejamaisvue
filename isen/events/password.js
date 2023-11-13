var checkPassword = function(password)
{
	//Longueur
    var result = 0;
    var length = password.length;
    console.log(length);
    if (length == 0) return 0;
    if (length >= 10) 
    {
        result += 16;
    }
    
    //Chiffres et lettres
    var number = -1;
    var text = -1;
    for (i = 0; i <= 9; i++)
    {
       if (password.localeCompare(i) >= 0) number += 1;
    }
    
    for (i = 65; i <= 122; i++)
    {
        if (password.localeCompare(parseInt(i)) >= 0) text += 1;
    }
    
    if (number >= 0 && text >= 0) result += 16;
    
    //Mots de passes communs
    var array = ["12345", "batman", "patapizza"];
    var length_array = array.length;
    var result_array = 0;
    for (i = 0; i < length_array; i++)
    {
        if (password.search(array[i]) < 0) result_array++;
    }
    if (result_array < 0) result += 16;
    
    
    //Casse des caractères
    var lowercase = password.toLowerCase();
    if (parseInt(lowercase) != parseInt(password)) result += 16;

    
    return result;
}

console.log(checkPassword("patapizzafiuergfero"));

var passwordId = document.getElementById('passwordinput');
passwordId.addEventListener('keypress', displayPassword, false);


function displayPassword() {
    //keyResult += String.fromCharCode(ev.charCode);
    var keyResult = passwordId.value;
    document.getElementById("idtext").innerHTML = checkPassword(keyResult);
}