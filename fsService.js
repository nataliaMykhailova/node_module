const fs = require('node:fs/promises');
const path = require('node:path');

const pathToUsers = path.join(process.cwd(), 'users.json');

module.exports = {
    read: async () =>{
        const json =  await fs.readFile(pathToUsers,'utf8');
        return json?JSON.parse(json):[];
    },
    write: async (users)=> {
        await fs.writeFile(pathToUsers,JSON.stringify(users, null, 2),'utf8');
    }
}