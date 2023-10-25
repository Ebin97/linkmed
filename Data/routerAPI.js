const _prefix = "https://phplaravel-996751-3506342.cloudwaysapps.com/api/v1";
export default class {
    //Init Route
    static _initRoute = _prefix + "/init";

    // Guest Route
    static _loginRoute = _prefix + "/accounts/login";
    static _registerRoute = _prefix + "/accounts/register";
    static _updateRoute = _prefix + "/user/";
    static _deleteRoute = _prefix + "/user/";
    static _resetPasswordRoute = _prefix + "/accounts/resetPassword";
    static _forgotPasswordRoute = _prefix + "/accounts/forgotPassword";
    static _specialityRoute = _prefix + "/specialities";
    static _notificationRoute = _prefix + "/notification";


    // Auth Route
    static _homeRoute = _prefix + "/home";
    static _aboutRoute = _prefix + "/about";
    static _contactUsRoute = _prefix + "/contactUs";
    static _privacyRoute = _prefix + "/privacy";

    // Resources Route
    static _companyRoute = _prefix + "/company";
    static _eventByCode = _prefix + "/eventByCode";
    static _eventRoute = _prefix + "/events";
    static _eventActivityRoute = _prefix + "/eventActivity";
    static _eventAgendaRoute = _prefix + "/agendaByEvent";
    static _eventAttendedRoute = _prefix + "/event";
    static _eventSpeakerRoute = _prefix + "/speakersByEvent";
    static _eventFeedbackRoute = _prefix + "/eventFeedback";
    static _eventQuestionByUser = _prefix + "/questionByEvent";
    static _eventPollingRoute = _prefix + "/pollingEventLatest";
    static _eventGalleryRoute = _prefix + "/eventGallery";
    static _eventUploadGalleryRoute = _prefix + "/eventUploadGallery";
    static _eventFeedbackEvaluation = _prefix + "/eventFeedbackEvaluation";
    static _eventFeedbackEvaluationUserAnswer = _prefix + "/eventFeedbackEvaluationUserAnswer";

}