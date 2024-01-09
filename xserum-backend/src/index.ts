import multipart from 'connect-multiparty';
import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import sql from 'mysql2';
import fs from 'fs';


const sessions: {
    token: string,
    email: string;
    salted: string;
    name: string;
    avatar: string;
}[] = [];


const genToken = () => {
    let strings = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$^&*-_~`;
    let result = `tkn::~`;

    for (let i = 0; i < 100; i++) result += strings.split(``)[Math.floor(Math.random() * strings.length)];
    return result;
}


const connection = sql.createConnection({
    host: 'localhost',
    port: 3306, // 20124, 3307
    user: 'root',
    password: 'Dy12249443!!@@', // dy1224!!@@
    database: 'xserum'
});


const app = express();
app.use(multipart());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: `http://localhost:3000`, credentials: true }));
multer({ dest: path.resolve(`${__dirname}/../secret`) });


const getHearts = (notype: boolean = false) => {
    return "SELECT COUNT(*) 'heart_count' FROM `premus` P JOIN `heart` H ON P.node_id = H.to WHERE P.node_id = PP.node_id " + (notype ? "" : "AND P.type = ?") + " GROUP BY P.node_id";
}

const getDatas = (table: string) => {
    return `${table}.node_id, ${table}.image, ${table}.title, ${table}.description, ${table}.category, ${table}.made_by, ${table}.created_at`;
}

const getSongs = (result: any[]) => {
    result.forEach(e => {
        if (fs.existsSync(path.resolve(`${__dirname}/../secret/${e.made_by}/${e.node_id}`))) {
            e.songs = fs.readdirSync(path.resolve(`${__dirname}/../secret/${e.made_by}/${e.node_id}`), `utf-8`);
            e.songs = e.songs.filter((x: string) => [`.mp3`, `.wav`, `.aiff`, `.flac`, `.m4a`, `.ogg`, `.aac`, `.wma`, `.ape`].includes(path.extname(path.resolve(`${__dirname}/../secret/${e.made_by}/${e.node_id}/${x}`))));
        } else e.songs = [];
    });

    return result;
}


/* profile */
app.get(`/profile/:email`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { email } = req.params;

    if (/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(email)) {
        const sql = "SELECT * FROM `account` WHERE `email` = ?";
        connection.query(sql, [email], (err, result: any[], fields) => {
            const resultData = Object.assign({}, result[0]);
            resultData.password = `(non-disclosure)`;

            res.send({ status: 200, data: resultData });
        });
    } else res.send({ status: 400, message: `Email is not in the format.` });
});

app.get(`/profile/:email/premus`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { email } = req.params;

    const sql = "SELECT " + getDatas(`PP`) + ", (" + getHearts(true) + ") 'heart_count' FROM `premus` PP WHERE PP.made_by = ?";
    connection.query(sql, [email], (err, result: any[], fields) => {
        result = getSongs(result);

        if (!err) res.send({ status: 200, message: `Imported successfully.`, data: result });
        else res.send({ status: 400, message: `Imported failed.` });
    });
});

app.get(`/profile/:email/:avatar`, (req, res) => {
    const { email, avatar } = req.params;

    if (fs.existsSync(path.resolve(`${__dirname}/../secret/${email}/${avatar}`))) res.sendFile(path.resolve(`${__dirname}/../secret/${email}/${avatar}`));
    else res.sendFile(path.resolve(`${__dirname}/../user.png`));
});


/* oauth */
app.post(`/oauth/generate`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { avatar, name, email, password } = req.body;

    let avatarPath: string = ``;

    if (avatar.trim() !== ``) {
        const matches = avatar.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const type = matches[1].split('/')[1];
        const dataBuffer = Buffer.from(matches[2], 'base64');

        avatarPath = `${new Date().getTime()}_${name}.${type}`;
    
        if (!fs.existsSync(path.resolve(`${__dirname}/../secret/${email}`))) fs.mkdirSync(path.resolve(`${__dirname}/../secret/${email}`));
        fs.writeFileSync(path.resolve(`${__dirname}/../secret/${email}/${avatarPath}`), dataBuffer);
    }
    
    if (
        /^[A-Za-z0-9][A-Za-z0-9]*$/.test(name) &&
        /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(email) &&
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
    ) {
        const saltPass = crypto.createHash('sha512').update(password + email).digest(`hex`);
        
        const sql = "INSERT INTO `account` (`email`, `password`, `name`, `avatar`) VALUES (?, ?, ?, ?)";
        connection.query(sql, [email, saltPass, name, avatarPath], (err, result: any[], fields) => {
            if (!err) {
                if (!fs.existsSync(path.resolve(`${__dirname}/../secret/${email}`))) fs.mkdirSync(path.resolve(`${__dirname}/../secret/${email}`));

                const token = genToken();
                sessions.push({ token: token, email: email, salted: saltPass, name: name, avatar: avatarPath });

                res.send({ status: 200, message: `Successfully creating an account.`, token: token });
            } else res.send({ status: 400, message: `Failed to create account.`, token: undefined });
        });
    } else res.send({ status: 400, message: `Failed to create account.`, token: undefined });
});

app.post(`/oauth/validation`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { email, password } = req.body;
    if (
        /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(email) &&
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
    ) {
        const saltPass = crypto.createHash('sha512').update(password + email).digest(`hex`);
        
        const sql = "SELECT * FROM `account` WHERE `email` = ? AND `password` = ?";
        connection.query(sql, [email, saltPass], (err, result: any[], fields) => {
            if (!err && result.length !== 0) {
                const token = genToken();
                sessions.push({ token: token, email: email, salted: saltPass, name: result[0].name, avatar: result[0].avatar });

                res.send({ status: 200, message: `Successfully login an account.`, token: token });
            } else res.send({ status: 400, message: `Failed to login account.`, token: undefined });
        });
    } else res.send({ status: 400, message: `Failed to login account.`, token: undefined });
});

app.post(`/oauth/valtkn`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { token } = req.body;

    const session = sessions.find(e => e.token = token);

    const sql = "SELECT * FROM `account` WHERE `email` = ? AND `password` = ?";
    if (session) connection.query(sql, [session?.email, session?.salted], (err, result: any[], fields) => {
        if (!err) {
            if (result.length === 0) res.send({ status: 400, message: `Cannot find session.` });
            else {
                const resultSession = Object.assign({}, session);
                resultSession.salted = `(non-disclosure)`;
                res.send({ status: 200, message: `A session has been found.`, session: resultSession });
            }
        } else res.send({ status: 400, message: `Error while finding session.` });
    }); else res.send({ status: 400, message: `Cannot find session.` });
});


/* premus */
app.get(`/premus/:id`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`PP`) + ", (" + getHearts(true) + ") 'heart_count' FROM `premus` PP WHERE PP.node_id = ?";
    connection.query(sql, [req.params.id], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});

app.get(`/premus/:email/:id/:filename`, (req, res) => {
    const { email, id, filename } = req.params;

    if ([`/`, `\\`].includes(email) && [`/`, `\\`].includes(id) && [`/`, `\\`].includes(filename)) return;
    res.sendFile(path.resolve(`${__dirname}/../secret/${email}/${id}/${filename}`));
});

app.post(`/premus/upload`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { image, title, description, type, category, email } = req.body;
    
    if (/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(email)) {
        const sql = "INSERT INTO `premus` (`type`, `title`, `description`, `category`, `made_by`) VALUES (?, ?, ?, ?, ?)";
        connection.query(sql, [type, title, description, category, email], (err, result: any, fields) => {
            if (!err) {
                if (!fs.existsSync(path.resolve(`${__dirname}/../secret/${email}/${result.insertId}`))) fs.mkdirSync(path.resolve(`${__dirname}/../secret/${email}/${result.insertId}`));
                Object.values(req.files || {}).forEach(file => {
                    fs.copyFileSync(file.path, path.resolve(`${__dirname}/../secret/${email}/${result.insertId}/${file.name}`));
                });
                
                let imagePath: string = ``;
            
                if (image.trim() !== ``) {
                    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    const type = matches[1].split('/')[1];
                    const dataBuffer = Buffer.from(matches[2], 'base64');
            
                    imagePath = `${new Date().getTime()}.${type}`;
                    fs.writeFileSync(path.resolve(`${__dirname}/../secret/${email}/${result.insertId}/${imagePath}`), dataBuffer);
                }

                const sql = "UPDATE `premus` SET `image` = ? WHERE `node_id` = ?";
                connection.query(sql, [imagePath, result.insertId], (err, _: any[], fields) => {
                    res.send({ status: 200, message: `Upload Success.`, node_id: result.insertId });
                });
            } else res.send({ status: 400, message: `Upload failed.` });
        });
    } else res.send({ status: 400, message: `Upload failed.` });
});

app.post(`/premus/heart`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const { made_by, to } = req.body;

    const sql = "SELECT * FROM `heart` WHERE `made_by` = ? AND `to` = ?";
    connection.query(sql, [made_by, to], (err, result: any[], fields) => {
        if (!err) {
            if (result.length >= 1) {
                const sql = "DELETE FROM `heart` WHERE `made_by` = ? AND `to` = ?";
                connection.query(sql, [made_by, to], (err, _: any[], fields) => {
                    if (!err) res.send({ status: 200, message: `Heart Success.` });
                    else res.send({ status: 400, message: `Heart Failed.` });
                });
            } else {
                const sql = "INSERT INTO `heart` (`made_by`, `to`) VALUES (?, ?)";
                connection.query(sql, [made_by, to], (err, _: any[], fields) => {
                    if (!err) res.send({ status: 200, message: `Heart Success.` });
                    else res.send({ status: 400, message: `Heart Failed.` });
                });
            }
        } else res.send({ status: 400, message: `Heart Failed.` });
    });
});


/* presets */
app.get(`/presets/recently`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`PP`) + ", (" + getHearts() + ") 'heart_count' FROM `premus` PP WHERE PP.type = 'preset' ORDER BY created_at DESC LIMIT 6;";
    connection.query(sql, [`preset`], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});

app.get(`/presets/popular`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`P`) + ", COUNT(*) 'heart_count' FROM `premus` P JOIN `heart` H ON P.node_id = H.to WHERE P.type = 'preset' GROUP BY P.node_id ORDER BY COUNT(*) DESC;";
    connection.query(sql, [], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});

app.get(`/presets/all`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`PP`) + ", (" + getHearts() + ") 'heart_count' FROM `premus` PP WHERE PP.type = 'preset' ORDER BY created_at DESC;";
    connection.query(sql, [`preset`], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});


/* musics */
app.get(`/musics/recently`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`PP`) + ", (" + getHearts() + ") 'heart_count' FROM `premus` PP WHERE PP.type = 'music' ORDER BY created_at DESC LIMIT 6;";
    connection.query(sql, [`music`], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});

app.get(`/musics/popular`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`P`) + ", COUNT(*) 'heart_count' FROM `premus` P JOIN `heart` H ON P.node_id = H.to WHERE P.type = 'music' GROUP BY P.node_id ORDER BY COUNT(*) DESC;";
    connection.query(sql, [], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});

app.get(`/musics/all`, (req, res) => {
    res.setHeader(`Content-type`, `application/json`);

    const sql = "SELECT " + getDatas(`PP`) + ", (" + getHearts() + ") 'heart_count' FROM `premus` PP WHERE PP.type = 'music' ORDER BY created_at DESC;";
    connection.query(sql, [`music`], (err, result: any[], fields) => {
        result = getSongs(result);

        res.send(JSON.stringify(result, null, 4));
    });
});


app.listen(8080, () => {
    console.log(`[cors allowed] fetch (get | post) -> localhost:8080`);
});