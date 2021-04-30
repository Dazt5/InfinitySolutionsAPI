const fs = require('fs');

const exist_route = async (route) =>{

    if(!fs.existsSync(route)){
        console.log('Upload folder has been created');
        fs.mkdirSync(route);
    }

}

const delete_file = async (route) =>{

    fs.unlink(route, (err) =>{

        if(err){
            console.log(err)
            return;
        }

        console.log("CORRUPT FILE WAS BEEN REMOVED")
    });

}

module.exports = {
    exist_route,
    delete_file
}