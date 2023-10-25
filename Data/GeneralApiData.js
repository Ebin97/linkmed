import AxiosApi from "./AxiosApi";
import routerAPI from "./routerAPI";

export default class {
    static async InitApp() {

    }



    //-----------
    //Privacy Function
    //--------------------
    static async PrivacyFunction() {
        return await AxiosApi.get(routerAPI._privacyRoute);
    }
    //-----------
    //Specialities Function
    //--------------------
    static async SprcialityFunction() {
        return await AxiosApi.get(routerAPI._specialityRoute);
    }
    //////////////Registration Routes//////////////
    //-----------
    //Login Function
    //--------------------
    static async LoginFunction(data) {
        return await AxiosApi.post(routerAPI._loginRoute, data);
    }
    //-----------
    //Register Function
    //--------------------
    static async RegisterFunction(data) {
        return AxiosApi.post(routerAPI._registerRoute, data);
    }

    static async ForgetPassword(data) {
        return AxiosApi.post(routerAPI._forgotPasswordRoute, data);
    }
    //-----------
    //Update Information Function
    //--------------------
    static async UpdateUserInfoFunction(data, id) {
        return AxiosApi.put(routerAPI._updateRoute + id, data);
    }

    //-----------
    //Update Information Function
    //--------------------
    static async DeleteUserInfoFunction(id) {
        return AxiosApi.delete(routerAPI._updateRoute + id);
    }
    //-----------
    //Notification Function
    //--------------------
    static async Notification(data) {
        return AxiosApi.get(routerAPI._notificationRoute, data);
    }
    //-----------
    //Notification Function
    //--------------------
    static async DeleteNotification(id) {
        return AxiosApi.delete(routerAPI._notificationRoute + "/" + id);
    }



    //-----------
    //Events list Function
    //--------------------
    static async EventList(data) {
        return AxiosApi.get(routerAPI._eventRoute, data);
    }
    //-----------
    //Event by code Function
    //--------------------
    static async EventByCode(event_code) {
        return AxiosApi.get(routerAPI._eventByCode + "/" + event_code);
    }
    //-----------
    //Event Details Function
    //--------------------
    static async EventDetails(id) {
        return AxiosApi.get(routerAPI._eventRoute + "/" + id);
    }
    //-----------
    //Event Faculty Function
    //--------------------
    static async EventSpeakerList(id) {
        return AxiosApi.get(routerAPI._eventSpeakerRoute + "/" + id);
    }
    //-----------
    //Event Agenda Function
    //--------------------
    static async EventAgendaList(data, id) {
        return AxiosApi.get(routerAPI._eventAgendaRoute + "/" + id, data);
    }
    //-----------
    //Event Question Function
    //--------------------
    static async EventQuestionByUser(data, id) {
        return AxiosApi.get(routerAPI._eventQuestionByUser + "/" + id, data);
    }
    //-----------
    //Send Question Function
    //--------------------
    static async PostEventQuestionByUser(data) {
        return AxiosApi.post(routerAPI._eventQuestionByUser, data);
    }
    //-----------
    //Event Polling Question Function
    //--------------------
    static async EventPolling(id) {
        return AxiosApi.get(routerAPI._eventPollingRoute + "/" + id);
    }
    //-----------
    //Event Feedback Evaluation Function
    //--------------------
    static async EventFeedbackEvaluation(id) {
        return AxiosApi.get(routerAPI._eventFeedbackEvaluation + "/" + id);
    }
    //-----------
    //Post Event Feedback Evaluation Answers Function
    //--------------------
    static async EventFeedbackEvaluationUserAnswer(data) {
        return AxiosApi.post(routerAPI._eventFeedbackEvaluationUserAnswer, data);
    }
    //-----------
    //Upload List of Images Function
    //--------------------
    static async EventUploadLiveGallery(id, data) {
        return AxiosApi.multipart(routerAPI._eventUploadGalleryRoute + "/" + id, data);
    }
    //-----------
    //Get List of Images Function
    //--------------------
    static async EventLoadGallery(id, data) {

        return AxiosApi.get(routerAPI._eventGalleryRoute + "/" + id, data);
    }

    static async EventAttended(id, data) {
        return AxiosApi.post(routerAPI._eventAttendedRoute + "/" + id + "/attended", data);

    }
    static async UpdateRSVP(id, data) {
        return AxiosApi.post(routerAPI._eventAttendedRoute + "/" + id + "/RSVP", data);

    }

}