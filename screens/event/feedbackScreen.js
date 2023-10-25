import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OneSignal from 'react-native-onesignal';
import Layout from '../../components/common/layout';
import { Color, Dark } from '../../config/global';
import GeneralApiData from '../../Data/GeneralApiData';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

export default function FeedBackScreen(props) {
    const [loading, isLoading] = useState(true);
    const [submitLoading, isSubmitLoading] = useState(false);
    const [event, setEvent] = useState(null);
    const [eventFeedback, setEventFeedback] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [alert, setAlert] = useState({});

    const init = async () => {
        isLoading(true);
        let time = setTimeout(async () => {
            clearTimeout(time);
            if (event && event.id > 0) {
                const res = await GeneralApiData.EventFeedbackEvaluation(event ? event.id : 0);
                if (res && res.status_code == 200) {
                    setEventFeedback(res.data);
                    isLoading(false);
                    setAnswers()
                    rebuildAnswer(res.data);

                } else {
                    setEventFeedback([]);
                }
            } else {
                isLoading(false);
            }
        }, 2000);

    }
    useEffect(() => {
        setEvent(props.route.params.event);
        Colors = props.route.params.colors
        init()

    }, [event]);
    const rebuildAnswer = (data) => {
        // let data = eventFeedback;
        let tempAnswers = [];

        for (var i = 0; i < data.length; i++) {
            let answersList = data[i].answers;
            for (var j = 0; j < answersList.length; j++) {
                if (answersList[j].selected) {
                    tempAnswers.push({
                        'id': data[i].id,
                        'answer_id': answersList[j].id,
                        'selected': true
                    });
                }
            }
        }
        setAnswers(tempAnswers)

    }

    useEffect(() => {
        OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
            const { action, notification } = openedEvent;
            if (notification.additionalData != undefined) {
                let target = notification.additionalData;
                switch (target.type) {
                    case "event":
                        props?.navigation?.navigate("EventDetails", {
                            event: target.id
                        })
                        break;
                    default:
                        break;
                }
            }
        })

    }, [])
    const selectAnswers = async (id, answer_id) => {
        let exists = false;
        let temp = [];
        temp = (
            answers.map((item) => {
                if (item.id === id) {
                    exists = true;
                    return {
                        ...item,
                        answer_id: answer_id
                    }
                }
                return item;
            })
        );

        if (!exists) {
            setAnswers([...answers, {
                id: id,
                answer_id: answer_id
            }]);

        } else {

            setAnswers(temp);
        }

        setClicked(!clicked);

    }
    const checkSelected = (id, answer_id) => {
        let exist = false;
        answers && answers.map((item) => {
            if (item.id === id && item.answer_id === answer_id) {
                exist = true
            }
            return item;
        });
        return exist
    }
    const submit = async () => {
        setAlert({});
        isSubmitLoading(true);

        if (eventFeedback.length == answers.length) {
            let data = {
                'answers': answers,
                'event_id': event ? event.id : 0
            };
            const res = await GeneralApiData.EventFeedbackEvaluationUserAnswer(data);
            if (res && res.status_code == 200) {
                setAlert({
                    "message": "Thank you for your feedback",
                    "color": Colors.dark_blue_color,
                });
            } else {
                setAlert({
                    "message": "Please try again",
                    "color": Colors.red,
                });
            }
            isSubmitLoading(false);

        } else {
            isSubmitLoading(false);
            setAlert({
                "message": "Please answer all questions",
                "color": Colors.red,
            });
        }
    }
    const renderItems = (
        eventFeedback.map((item, key) => {
            return <View style={styles.questionContent} key={key}>
                <Text style={styles.question}>{item.title}</Text>
                <View style={styles.inline}>
                    {item.answers && item.answers.map((answer, key1) => {
                        return <TouchableOpacity activeOpacity={.9} onPress={() => {
                            selectAnswers(item.id, answer.id);
                        }} style={styles.col} key={key1}>
                            <View style={{
                                ...styles.item,
                                backgroundColor: checkSelected(item.id, answer.id) ? Colors.main_color : Colors.white,
                                borderColor: Colors.main_color

                            }}>
                                <Text style={{ ...styles.answer, color: checkSelected(item.id, answer.id) ? Colors.white : Colors.main_color }}>{answer.title}</Text>
                            </View>
                            <Text style={{ ...styles.hint, color: Colors.main_color }}>{answer.hint}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        })
    )

    return (
        <Layout back={true} headerColor={Colors.main_color}
            secondColor={Colors.main_color} onRefresh={init}
            refreshing={loading}
            naviagationAction={
                () => {
                    props?.navigation?.goBack()
                }
            }
        >
            {loading ? (<>
                <View style={styles.container}>
                    <ActivityIndicator size={"large"} />
                </View>
            </>) : (<>

                {eventFeedback.length > 0 ? <>
                    <View style={styles.center}>
                        <Text style={{ ...styles.feedbackTitle, color: Colors.main_color }}>EVALUATION FEEDBACK</Text>
                    </View>
                    <View style={styles.feedback}>
                        {renderItems}
                        <>

                            {alert.message ? <>
                                <View><Text style={{ ...styles.error, color: alert.color }}>{alert.message}</Text></View>
                            </> : null}
                            <View style={{ ...styles.center }}>
                                {submitLoading ? (<>
                                    <ActivityIndicator />
                                </>) : (<>
                                    <TouchableOpacity style={{ ...styles.button, ...styles.center, backgroundColor: Colors.main_color }} onPress={() => { submit() }} activeOpacity={.9}>
                                        <Text style={styles.white}>Send</Text>
                                    </TouchableOpacity>
                                </>)}

                            </View>
                        </>


                    </View>
                </>
                    :
                    <View style={styles.container}>
                        <View style={styles.center}>
                            <Text style={{
                                color: Colors.grey_color,
                                fontFamily: "OpenSans-Bold",
                                textAlign: 'center',
                                fontSize: 16,
                            }}>Feedback is not available now</Text>
                        </View>
                    </View>

                }
            </>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    center: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    feedback: {
        flex: 1,
        width: Dimensions.get('screen').width,
        paddingHorizontal: 20
    },
    feedbackTitle: {
        color: Colors.main_color,
        fontSize: aspectRatio > 1.6 ? 25 : 30,
        fontFamily: "OpenSans-Bold",
        textTransform: "uppercase",
        marginVertical: 7,
    },
    feedbackSubTitle: {
        color: Colors.main_color,
        fontSize: aspectRatio > 1.6 ? 13 : 18,
        fontFamily: "OpenSans-Bold",
        textTransform: "capitalize",
        marginVertical: 10,
    },
    questionContent: {
        marginVertical: 10,

    },
    question: {
        fontSize: aspectRatio > 1.6 ? 15 : 20,
        fontFamily: "OpenSans-ExtraBold",
        color: Colors.grey_color

    },
    inline: {
        flex: 1,
        flexDirection: 'row',
    },
    col: {
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        marginRight: 10,

    },
    item: {
        width: aspectRatio > 1.6 ? 50 : 90,
        height: aspectRatio > 1.6 ? 50 : 90,
        borderRadius: 100,
        borderColor: Colors.main_color,
        borderWidth: 4,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginVertical: 12,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    answer: {
        fontSize: aspectRatio > 1.6 ? 15 : 20,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",

    },
    hint: {
        fontSize: aspectRatio > 1.6 ? 10 : 16,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: "OpenSans-Bold",
        color: Colors.main_color,

    },
    button: {
        backgroundColor: Colors.main_color,
        width: 200,
        height: 50,
        borderRadius: 20,
        marginTop: 20
    },
    white: {
        color: Colors.white,
        fontFamily: "OpenSans-Bold",
        fontSize: aspectRatio > 1.6 ? 18 : 22,

    },
    error: {
        fontSize: aspectRatio > 1.6 ? 15 : 20,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: "OpenSans-Bold",


    },
});