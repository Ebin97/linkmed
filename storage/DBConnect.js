import SQLite from 'react-native-sqlite-2'
import LocalStorage from './LocalStorage';
const db = SQLite.openDatabase('MedConnectDBV1.db', '1.0', '', 1);
export default class {

    static createDB = async () => {
        db.transaction(function (txn) {
            txn.executeSql(
                'CREATE TABLE IF NOT EXISTS Users(id BIGINT PRIMARY KEY NOT NULL, first_name VARCHAR(100), last_name VARCHAR(100), email VARCHAR(150), country VARCHAR(150), speciality VARCHAR(150), profession TEXT,token TEXT,isActivated Boolean,isScanner Boolean,createdAt DATETIME)',
                [], function (tx, res) {
                    console.log(res);
                }
            )
            txn.executeSql(
                'CREATE TABLE IF NOT EXISTS Setting(id BIGINT PRIMARY KEY NOT NULL, url VARCHAR(255), type INTEGER DEFAULT 1)',
                []
            )
            txn.executeSql(
                'CREATE TABLE IF NOT EXISTS Events(id BIGINT PRIMARY KEY NOT NULL,title VARCHAR(100), status Boolean DEFAULT true,createdAt DATETIME DEFAULT (CURRENT_TIMESTAMP))',
                []
            )
            txn.executeSql(
                'CREATE TABLE IF NOT EXISTS RSVP(id BIGINT PRIMARY KEY NOT NULL,rsvp_id VARCHAR(200), createdAt DATETIME DEFAULT (CURRENT_TIMESTAMP))',
                []
            )
        });
    }
    static getById = async (id) => {
        db.transaction(function (txn) {
            return txn.executeSql('SELECT * FROM `Users` where id=:id limit 1', [id], function (tx, res) {
                if (res.rows['_array'].length > 0) {
                    let store = async () => {
                        await LocalStorage.storeData("user", res.rows['_array'][0]);
                    }
                    store();
                }
            })
        });
    }
    static getByEmail = async (email) => {
        db.transaction(function (txn) {
            return txn.executeSql('SELECT * FROM `Users` where email=:email', [email], function (tx, res) {
                if (res.rows['_array'].length > 0) {
                    let store = async () => {
                        await LocalStorage.storeData("user", res.rows['_array'][0]);
                    }
                    store();
                }
            })
        });
    }
    static checkAuth = async () => {
        db.transaction(function (txn) {
            return txn.executeSql('SELECT * FROM `Users` order by created_at desc limit 1', [], function (tx, res) {
                if (res.rows['_array'].length > 0) {

                    store("auth", true);
                    store("user", res.rows['_array'][0]);
                } else {
                    store("auth", false);
                    store("user", null);
                }
            })
        });
    }

    static insertData = async (id, first_name, last_name, email, country, speciaity, profession, token, isActivated, isScanner, createdAt) => {
        db.transaction(function (txn) {
            txn.executeSql('delete from Users');
            txn.executeSql('INSERT INTO Users (id,first_name,last_name,email,country,speciality,profession,token,isActivated,isScanner,createdAt) VALUES (:id,:first_name,:last_name,:email,:country,:speciality,:profession,:token,:isActivated,:isScanner,:createdAt)',
                [id, first_name, last_name, email, country, speciaity, profession, token, isActivated, isScanner, createdAt], function (tx, res) {
                    console.log(`Record ${id} was Inserterd`);
                })
        });
    }
    static insertTrackingInfo = async (id, title, status) => {
        db.transaction(function (txn) {
            txn.executeSql('SELECT * FROM `Events` where id=:id limit 1', [id], function (tx, res) {
                if (res.rows['_array'].length == 0) {
                    txn.executeSql('INSERT INTO `Events` (id,title,status) VALUES (:id,:title,:status)',
                        [id, title, status], function (tx, res) {
                            console.log(`Record ${id} was Inserterd`);
                        })

                }
            });

        });
    }

    static checkEvent = async (id) => {
        db.transaction(function (txn) {
            return txn.executeSql('SELECT * FROM `Events` where id=:id', [id], function (tx, res) {
                const store = async (key, event) => {
                    await LocalStorage.storeData(key, event);
                }
                if (res.rows['_array'].length > 0) {

                    store('event', res.rows['_array'][0]);
                }
            })
        });
    };

    static insertRSVPInfo = async (id, rsvp_id) => {

        db.transaction(function (txn) {
            txn.executeSql('SELECT * FROM `RSVP` where id=:id limit 1', [id], function (tx, res) {
                if (res.rows['_array'].length == 0) {
                    txn.executeSql('INSERT INTO RSVP (id,rsvp_id) VALUES (:id,:rsvp_id)',
                        [id, rsvp_id], function (tx, res) {
                            console.log(`Record ${id} was Inserterd`);
                        })
                } else {
                    console.log("Old RSVP")

                    console.log(res.rows['_array'][0])
                    console.log("New RSVP")
                    console.log(rsvp_id)
                    txn.executeSql('Update RSVP set rsvp_id=:rsvp_id where id=:id',
                        [rsvp_id, id], function (tx, res) {
                            console.log(`Record ${id} was Updated`);
                        })

                }
            });



        });
    }

    static checkRSVP = async (id) => {
        db.transaction(function (txn) {
            return txn.executeSql('SELECT * FROM `RSVP` where id=:id', [id], function (tx, res) {
                const store = async (key, event) => {

                    await LocalStorage.storeData(key, event);
                }
                if (res.rows['_array'].length > 0) {
                    store('rsvp', res.rows['_array'][0]);
                }
            })
        });
    }
    static deleteRSVP = async (id) => {
        db.transaction(function (txn) {
            txn.executeSql('delete from RSVP where id =:id', [id], function (tx, res) {
                console.log(`Record ${id} was deleted`);
               
            });

        })
    }


    static updateData = async (id, first_name, last_name, email, country, speciaity, profession, token, isActivated) => {
        db.transaction(function (txn) {
            txn.executeSql('UPDATE Users set first_name=:first_name,last_name=:last_name,email=:email,country=:country,speciaity=:speciaity,profession=:profession,token=:token,isActivated=:isActivated where id=:id',
                [first_name, last_name, email, country, speciaity, profession, token, isActivated, id])
        })
    }
    static deleteData = async () => {
        db.transaction(function (txn) {
            txn.executeSql('delete from Users');
            txn.executeSql('delete from RSVP');
            txn.executeSql('delete from Events');

        })
    }
}