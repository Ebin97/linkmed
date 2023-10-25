import LocalStorage from '../storage/LocalStorage';
import _Parser from './Parser';

const axios = require('axios').default;

export default class {
    static async get(url, data = null) {
        let user = await LocalStorage.getData('user');
        let token = ""
        if (user) {
            token = user.token;
        }
        let config = {
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            params: data
        };
        return await axios.get(url, config)
            .then(function (response) {
                // handle success
                return response.data;
            })
            .catch(function (error) {
                // handle error
                return null;
            })
    }
    static async post(url, formdata) {
        let user = await LocalStorage.getData('user');
        let token = ""
        if (user) {
            token = user.token;
        }

        let config = {
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
        };

        return await axios.post(url, formdata, config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {

                return error.response.data;
            });
    }
    static async put(url, formdata) {
        let user = await LocalStorage.getData('user');
        let token = ""
        if (user) {
            token = user.token;
        }
        let config = {
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
        };
        return await axios.put(url, formdata, config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error.response.data;
            });
    }
    static async delete(url) {
        let user = await LocalStorage.getData('user');
        let token = ""
        if (user) {
            token = user.token;
        }
        let config = {
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
        };
        return await axios.delete(url, config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error.response.data;
            });
    }
    static async multipart(url, formdata) {
        let user = await LocalStorage.getData('user');
        let token = ""
        if (user) {
            token = user.token;
        }
        let config = {
            responseType: "json",
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + token,
                Accept: "application/json"
            },
        };
        return await axios.post(url,
            formdata,
            config
        ).then(response => {
            return response;
        }).catch((error) => {
            console.log(error);
            return {
                status: 200
            }
        });
    }
}