export default class {
    static async _Json(res) {
        try {
            return res;
        } catch (e) {
            console.log(e)
            return null
        }
    }
}