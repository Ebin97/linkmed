import AsyncStorage from '@react-native-async-storage/async-storage';

export default class {
    static storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    static getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log(e)
            return null;
        }
    }
    static checkExist = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? true : false;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    static removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    static trancateData = async () => {
        try {
            await AsyncStorage.clear()
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}