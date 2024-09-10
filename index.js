const express = require('express')
const app = express();
const {write, read} = require('./fsService')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.get('/users', async (req, res) => {
    try {
        const users = await read();
        res.json(users);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const { username, age, email, password} = req.body;
        const users = await read();
        const indexEmail = users.findIndex((user) => user.email === email);
        const indexUsername = users.findIndex((user) => user.username === username);
        if (indexEmail !== -1) {
            return res.status(409).json('User with this email already exists');
        }
        if(indexUsername !== -1){
            return res.status(409).json('User with this username already exists');
        }
        if (!username || typeof username !== 'string' || username.length < 3 || username.length > 20) {
            return res.status(400).json('Missing or invalid data in the field "username". The "username" field is required, must be a string between 3 and 20 characters!!!!');
        }
        if (!age || typeof age !== 'number' || age < 0 || age > 120) {
            return res.status(400).json('Missing or invalid data in the field "age". The "age" field is required, must be a number between 0 and 120.');
        }
        if (!email || typeof email !== 'string' || email.length < 5 || email.length > 50 || !email.includes('@')) {
            return res.status(400).json('Missing or invalid data in the field "email". The "email" field must be a string between 5 and 50 characters and contain an "@" symbol.')
        }
        if (!password || typeof password !== 'string' || password.length < 5 || password.length > 50) {
            return res.status(400).json('Missing or invalid data in the field "password". The "password" field is required, must be a string between 8 and 50 characters')
        }
        if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            return res.status(400).json('The password must contain at least one digit and one letter');
        }

        const newUser = {
            id:users[users.length-1].id+1,
            username,
            age,
            email,
            password
        }
        users.push(newUser);
        await write(users);
        res.status(201).json(newUser);

    }catch(err) {
        res.status(500).json(err.message)
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if(!/^\d+$/.test(id)) {
            return res.status(400).send('Invalid user ID')
        }
        const users = await read();
        const user = await  users.find(user => user.id === +id);
        if (!user) {
            return res.status(404).json('User not found');
        }
        res.status(200).json(user);

    }catch(err) {
        res.status(400).json(err.message);
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const users = await read();

        const {id} = req.params;
        const {username, age, email, password} = req.body;

        const user = users.find(user => user.id === +id);
        if (!user) {
            return res.status(404).json('User not found')
        }
        if (username) {
            const indexUsername = users.findIndex((user) => user.username === username  && user.id !== +id);
            if(indexUsername !== -1){
                return res.status(409).json('User with this username already exists');
            }
            if (!username || typeof username !== 'string' || username.length < 3 || username.length > 20) {
                return res.status(400).json('Missing or invalid data. The "username" field is required, must be a string between 3 and 20 characters!!!!');
            }
            user.username = username
        }
        if (age) {
            if (!age || typeof age !== 'number'|| age < 0 || age > 120) {
                return res.status(400).json('Missing or invalid data. The "age" field is required, must be a number between 0 and 120.');
            }
            user.age = age
        }
        if (email) {
            const indexEmail = users.findIndex((user) => user.email === email && user.id !== +id);
            if (indexEmail !== -1) {
                return res.status(409).json('User with this email already exists');
            }

            if (!email || typeof email !== 'string' || email.length < 5 || email.length > 50 || !email.includes('@')) {
                return res.status(400).json('Missing or invalid data in the field "email". The "email" field must be a string between 5 and 50 characters and contain an "@" symbol.')
            }
            user.email = email
        }
        if (password) {
            if (!password || typeof password !== 'string' || password.length < 5 || password.length > 50) {
                return res.status(400).json('Missing or invalid data in the field "password". The "password" field is required, must be a string between 8 and 50 characters ')
            }
            if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
                return res.status(400).json('The password must contain at least one digit and one letter');
            }
            user.password = password
        }
        await write(users);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
});
app.delete('/users/:id', async (req, res) => {
    try {
        const users = await read();
        const {id} = req.params;
        if(!/^\d+$/.test(id)) {
            return res.status(400).send('Invalid user ID')
        }
        const index = users.findIndex(user => user.id === +id);
        if (index === -1) {
            return res.status(404).json('User not found')
        }
        users.splice(index, 1);
        await write(users);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message)
    }

})
