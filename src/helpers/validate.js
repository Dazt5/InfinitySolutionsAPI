

//default email comprobation.
exports.Email= (email) =>{

    const rexExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rexExp.test(String(email).toLowerCase());
}

/*
Minimo 1 Mayuscula,
Minimo 1 Minuscula,
Minimo 1 Numero,
De 8 a 20 caracteres,
*/
exports.Password = (password) =>{

    var rexExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;
    return rexExp.test(String(password));
}

/*
Solo letras, y solo un espacio entre el texto. 
*/ 
exports.Names = (fullname) =>{

    var rexExp = /^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/;
    return rexExp.test(String(fullname));
}

exports.statusColor = (hexColor) =>{

    var rexExp = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/;
    return rexExp.test(String(hexColor));
}


exports.Is



