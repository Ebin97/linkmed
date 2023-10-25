import { useNavigation } from '@react-navigation/native';
import React, { Component, useEffect, useRef, useState } from 'react';
import {TextInput, View, Text, StyleSheet, Button, Image, Dimensions, TouchableOpacity, Appearance, StatusBar, ScrollView } from 'react-native';
import ProgressBarLoading from '../../components/common/ProgressBar';
import { Color, Dark } from '../../config/global';
import validation from '../../config/validation';
import GeneralApiData from '../../Data/GeneralApiData';
import DBConnect from '../../storage/DBConnect';
import LocalStorage from '../../storage/LocalStorage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;
export default LoginScreen = (props) => {
  const navigation = useNavigation();
  const _scrollRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, isLoading] = useState(false);


  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (email.trim() != "" && password != "" && validation.valid(email)) {
      //Reset Variable
      setEmailError("");
      setPasswordError("");
      setError("");
      isLoading(true);

      //prepare data
      let data = {
        email: email,
        password: password
      };
      //call API
      let res = await GeneralApiData.LoginFunction(data);
      //hide loading
      isLoading(false);
      //processing response
      if (res && res.status_code == 200) {
        let data = res.data;
        if (data.isScanner) {
          await DBConnect.insertData(data.id, data.first_name, data.last_name, data.email, "", "", "", data.token, true, true, data.created_at);
        } else {
          await DBConnect.insertData(data.id, data.first_name, data.last_name, data.email, data.country, data.speciality, data.profession, data.token, data.is_activated, false, data.created_at);
        }
        await DBConnect.getByEmail(data.email);
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })


      } else {
        console.log(res)
        setError("Error in request, please check the credentials");
      }
    } else {
      isLoading(false);
      if (email.trim() == "" || validation.valid(email)) {
        setEmailError("Email address is incorrect");
      } else {
        setPasswordError("Please type your password");
      }
    }
  }
  useEffect(() => {
    if (colorScheme === 'dark') {
      Colors = Dark
    }
  }, []);
  return (
    <>

      <StatusBar translucent barStyle={"dark-content"} backgroundColor={Colors.main_color} />
      {loading ? (<>
        <ProgressBarLoading />
      </>) : (<>
        <KeyboardAwareScrollView>

          <ScrollView style={styles.scroll} ref={_scrollRef}>
            <View style={styles.content}>
              <View style={{ ...styles.center, ...styles.logoContent }}>
                <Image style={styles.logo} resizeMode="contain" source={require('../../assets/img/logo_dark.png')} />
              </View>
              {error != "" ? (<>
                <View style={styles.errorContent}>
                  <Text style={styles.error}>{error}</Text>
                </View>
              </>) : (<></>)}
              {emailError != "" ? (<>
                <View style={styles.errorContent}>
                  <Text style={styles.error}>{emailError}</Text>
                </View>
              </>) : (<></>)}


              <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                <View style={{ ...styles.bordered }}>
                  <View style={styles.iconContent}>
                    <Image style={{
                      ...styles.icon,
                      tintColor: Colors.main_color
                    }} resizeMode="contain" source={require('../../assets/img/user.png')} />
                  </View>
                  <TextInput style={styles.input}
                    onChangeText={setEmail}
                    cursorColor={Colors.white}
                    value={email}
                    placeholderTextColor={Colors.main_color}
                    onFocus={() => {
                      _scrollRef.current.scrollTo({ x: 0, y: 500 })
                    }}
                    placeholder="Email Address"
                    keyboardType="email-address" />
                </View>
              </View>
              {passwordError != "" ? (<>
                <View style={styles.errorContent}>
                  <Text style={styles.error}>{passwordError}</Text>
                </View>
              </>) : (<></>)}
              <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                <View style={{ ...styles.bordered }}>
                  <View style={styles.iconContent}>
                    <Image style={{
                      ...styles.icon,
                      tintColor: Colors.main_color
                    }} resizeMode="contain" source={require('../../assets/img/lock.png')} />
                  </View>
                  <TextInput style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    placeholderTextColor={Colors.main_color}
                    onFocus={() => {
                      _scrollRef.current.scrollTo({ x: 0, y: 500 })
                    }}
                    placeholder="Password" />
                </View>
              </View>
              <View style={{ ...styles.itemMargin, ...styles.linkContent }}>
                <TouchableOpacity
                  onPress={() => {

                    navigation.navigate("ForgetPassword", {})
                  }}
                >
                  <Text style={{ ...styles.linkTitle }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemMargin}>
                <TouchableOpacity style={styles.button}
                  activeOpacity={.8}
                  onPress={onSubmit}
                >
                  <Text style={{ ...styles.center, ...styles.buttonText }}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.register}>
                <Text style={styles.registerTitle}>
                  Don`t have an account yet?
                </Text>
                <TouchableOpacity activeOpacity={.9} onPress={() => {
                  navigation.navigate("Register", {})
                }}>
                  <Text style={{ ...styles.registerTitle, ...styles.bold }}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.medconLogo}>
                <View>
                  <Text style={styles.footerTitle}>Powered by</Text>
                </View>
                <Image
                  source={require('../../assets/img/medcon_dark.png')}
                  resizeMode='contain'
                  style={{
                    ...styles.logoCompany,
                  }}
                />
              </View>
            </View>


          </ScrollView>
        </KeyboardAwareScrollView>


      </>)}



    </>

  );

}
const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    width: width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  logoContent: {
  },

  logo: {
    width: 150,
  },
  center: {
    textAlign: 'center'
  },
  end: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  itemMargin: {
    marginVertical: 5,
  },
  bordered: {
    borderColor: Colors.main_color,
    borderWidth: 2,
    borderRadius: 50,
    height: 60,
    width: width * .8,
    textAlign: 'center',
    color: Color.main_color,
    flexDirection: 'row',
  },
  iconContent: {
    width: Dimensions.get('screen').width * .2,
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 25,
    height: 25,
  },
  inputContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  input: {

    width: width * .55,
    fontSize: aspectRatio > 1.6 ? 16 : 20,
    color: Colors.main_color,
    fontFamily: "OpenSans-Regular",

  },
  button: {
    borderColor: Colors.main_color,
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    height: 60,
    backgroundColor: Colors.main_color,
    width: Dimensions.get('screen').width * .8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: aspectRatio > 1.6 ? 18 : 20,
    color: Colors.white,
    fontFamily: "OpenSans-Bold",
  },
  linkContent: {
    width: Dimensions.get('screen').width,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 50,
  },
  linkTitle: {
    color: Colors.main_color,
    fontSize: aspectRatio > 1.6 ? 13 : 18,
    fontFamily: "OpenSans-Regular",
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end'
  },
  register: {
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 20

  },
  registerTitle: {
    fontSize: aspectRatio > 1.6 ? 18 : 22,
    fontFamily: "OpenSans-Regular",
    paddingHorizontal: 2,
    color: Colors.main_color

  },
  bold: {
    fontFamily: "OpenSans-Bold",
  },
  errorContent: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  error: {
    color: Colors.red,
    fontSize: 15,
    fontFamily: "OpenSans-Italic",
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: aspectRatio > 1.6 ? 12 : 18,
    color: Colors.main_color,
    marginTop: 20
  },
  logoCompany: {
    width: Dimensions.get('screen').width,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: aspectRatio > 1.6 ? 25 : 40,
    marginTop: 8
  },
  medconLogo: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
  },
});
