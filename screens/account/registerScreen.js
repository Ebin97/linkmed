import Clipboard from '@react-native-clipboard/clipboard';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, ScrollView, Appearance, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import ProgressBarLoading from '../../components/common/ProgressBar';
import { Color, Dark } from '../../config/global';
import data from "../../Data/countries.json"
import GeneralApiData from '../../Data/GeneralApiData';
import validation from '../../config/validation';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;
export default function RegisterScreen() {
  const navigation = useNavigation();

  const [countries, setCountries] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [verify, setVerify] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [speciality, setSpeciaity] = useState("");
  const _scrollRef = useRef();

  const [loading, isLoading] = useState(false);
  const [fristNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [specialityError, setSpecialityError] = useState("");
  const [confrimPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [termError, setTermError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    speciality_id: "",
    country: "",
    term: false
  });
  useEffect(() => {
    let res = generateData(data);
    setCountries(res);
  }, [data]);
  useEffect(() => {
    init();
  }, []);
  // To Generate picker options 

  // To Generate picker options 

  const generateData = (data) => {
    const newData = Object.keys(data).reduce((result, currentKey) => {
      if (typeof data[currentKey] === 'string' || data[currentKey] instanceof String) {
        result.push({
          label: data[currentKey],
          value: data[currentKey]
        });
      } else {
        const nested = generateData(data[currentKey]);
        result.push(...nested);
      }
      return result;
    }, []);
    return newData;
  }
  // To Handle all inputs changing 

  const handleOnChangeText = async (content, key) => {
    // if (content === '' ) return;
    setInfo({
      ...info,
      [key]: content
    });
    if (key != "term" || key != "country") {
      const copiedContent = await Clipboard.getString();
      if (copiedContent) {
        const isPasted = content.includes(copiedContent);
        if (isPasted) {
          setInfo({
            ...info,
            [key]: content
          });
        }
      }
    }
  }
  // Init Function for get all specialities 

  const init = async () => {
    isLoading(true);

    const res = await GeneralApiData.SprcialityFunction();
    isLoading(false);
    if (res && res.status_code == 200) {
      let data = [];
      res.data.forEach(item => {

        data.push({
          value: item.id,
          label: item.title
        });
      });
      setSpecialities(data);
    } else {
      setSpecialities([]);
    }
  }
  // 
  // Submit Function for registration
  const onSubmit = async () => {
    //show loading
    isLoading(true);
    if (valid()) {
      let data = {
        first_name: info.first_name,
        email: info.email,
        last_name: info.last_name,
        country: info.country,
        speciality_id: speciality.value,
        password: info.password,
        confirm_password: info.confirm_password,
        term: info.term
      };
      console.log(data);
      //call API
      let res = await GeneralApiData.RegisterFunction(data);
      //processing response
      if (res.status_code == 200) {
        setVerify(true);
        setInfo({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirm_password: "",
          speciality_id: "",
          country: "",
          term: false
        });
      } else {
        setError(res.message);
      }
    }
    //hide loading
    isLoading(false);
  }
  const valid = () => {
    if (info.first_name == ""
    ) {
      setLastNameError("Please type correct First Name");
      return false;
    } else {
      setFirstNameError("");
    }
    if (info.last_name == ""
    ) {
      setLastNameError("Please type correct Last Name");
      return false;
    } else {
      setLastNameError("");
    }
    if (info.email == "" || !validation.valid(info.email)
    ) {
      setEmailError("Please type correct email address");
      return false;
    } else {
      setEmailError("");
    }
    if (info.country == ""
    ) {
      setCountryError("Please choose your country");
      return false;
    } else {
      setCountryError("");
    }
    if (speciality == ""
    ) {
      setSpecialityError("Please choose your speciality");
      return false;
    } else {
      setSpecialityError("");
    }
    if (info.password == "" || info.confirm_password != info.password
    ) {
      setPasswordError("Password and confirm password does not match");
      return false;
    } else {
      setPasswordError("");
    }
    return true;

  }

  return (
    <>
      <StatusBar translucent barStyle={"light-content"} backgroundColor={Colors.main_color} />
      {loading ? (
        <>
          <ProgressBarLoading />
        </>) : (<>
          {verify ? (<>
            <View style={{ ...styles.verifyContent, ...styles.center }}>
              <View style={{ ...styles.center, ...styles.verify, }}>
                <Text style={{ ...styles.title, padding: 20, textAlign: 'center', color: Colors.main_color }}>Thank you for your registration, Please check your email to verify your account</Text>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={.9} onPress={() => {
                    navigation.navigate("Login", {})
                  }}>
                  <Text style={{ ...styles.buttonText, ...styles.bold }}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>) : (<>
            <View style={styles.container}>
              <View style={{ ...styles.center, ...styles.content }}>
                <KeyboardAwareScrollView>

                  <ScrollView ref={_scrollRef} contentContainerStyle={styles.scroll}>
                    <View style={{ ...styles.header, ...styles.center }}>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/back.png')}
                          resizeMode='contain'
                          style={{
                            ...styles.backIcon
                          }} />
                      </TouchableOpacity>
                      <Text style={styles.signupTitle}>Sign Up</Text>
                    </View>

                    <View>

                      {error != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{error}</Text>
                        </View>
                      </>) : (<></>)}
                      <View>
                        <Text style={styles.title}>Personal Details</Text>
                      </View>
                      {/* First Name */}
                      {fristNameError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{fristNameError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                        <TextInput style={styles.input}
                          onChangeText={(first_name) => { handleOnChangeText(first_name, 'first_name') }}
                          placeholderTextColor={Colors.white}
                          cursorColor={Colors.white}
                          value={info.first_name}
                          placeholder="First Name"
                        />
                      </View>

                      {/* Last Name */}
                      {lastNameError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{lastNameError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                        <TextInput style={styles.input}
                          onChangeText={(last_name) => { handleOnChangeText(last_name, 'last_name') }}
                          placeholderTextColor={Colors.white}
                          cursorColor={Colors.white}
                          value={info.last_name}
                          placeholder="Last Name"
                        />
                      </View>

                      {/* Email Address */}
                      {emailError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{emailError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>

                        <TextInput style={styles.input}
                          onChangeText={(email) => { handleOnChangeText(email, 'email') }}
                          placeholderTextColor={Colors.white}
                          cursorColor={Colors.white}
                          value={info.email}
                          placeholder="Email Address"
                          keyboardType="email-address" />
                      </View>
                      {/* Country */}
                      {countryError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{countryError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>

                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          iconColor={Colors.white}
                          itemTextStyle={{color:"black"}}
                          data={countries}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={!isFocus ? 'Country' : '...'}
                          searchPlaceholder="Search..."
                          search={true}
                          value={info.country}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            handleOnChangeText(item.value, 'country')
                            setIsFocus(false);
                          }}

                        />
                      </View>
                      <View>
                        <Text style={styles.title}>Professional Details</Text>
                      </View>
                      {/* Speciality Address */}
                      {specialityError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{specialityError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>

                        <Dropdown
                          style={[styles.dropdown]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          itemTextStyle={{color:"black"}}

                          iconColor={Colors.white}
                          data={specialities}
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={!isFocus ? 'Speciality' : '...'}
                          searchPlaceholder="Search..."
                          search={true}
                          value={speciality}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            setSpeciaity(item)
                            setIsFocus(false);
                          }}
                        />
                      </View>
                      <View>
                        <Text style={styles.title}>Password</Text>
                      </View>
                      {/* Password */}
                      {passwordError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{passwordError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                        <TextInput style={styles.input}
                          onChangeText={(password) => { handleOnChangeText(password, 'password') }}
                          placeholderTextColor={Colors.white}
                          cursorColor={Colors.white}
                          value={info.password}
                          placeholder="Password"
                          secureTextEntry={true} />

                      </View>
                      {/* Password */}
                      {confrimPasswordError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{confrimPasswordError}</Text>
                        </View>
                      </>) : (<></>)}
                      <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                        <TextInput style={styles.input}
                          onChangeText={(confirm_password) => { handleOnChangeText(confirm_password, 'confirm_password') }}
                          placeholderTextColor={Colors.white}
                          cursorColor={Colors.white}
                          value={info.confirm_password}
                          placeholder="Confirm Password"
                          secureTextEntry={true} />
                      </View>
                      {/* Terms */}
                      {termError != "" ? (<>
                        <View style={styles.errorContent}>
                          <Text style={styles.error}>{termError}</Text>
                        </View>
                      </>) : (<></>)}

                      <View style={{ ...styles.itemMargin, ...styles.inputContent, marginTop: 20 }}>
                        <View style={styles.checkbox}>
                          <BouncyCheckbox
                            size={25}
                            fillColor={Colors.main_color}
                            unfillColor="#FFFFFF"
                            text="I agree to the Terms of Service and Privacy Policy"
                            iconStyle={{ borderColor: Colors.white }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 0, }}
                            textStyle={{ fontFamily: "OpenSans-Bold", color: Colors.white, fontSize: aspectRatio > 1.6 ? 15 : 18 }}
                            onPress={(isChecked) => { handleOnChangeText(isChecked, 'term') }}
                          />
                        </View>
                      </View>


                      <View style={{ ...styles.itemMargin, ...styles.center }}>
                        <TouchableOpacity style={styles.button}
                          activeOpacity={.8}
                          onPress={onSubmit}
                        >
                          <Text style={{ ...styles.buttonText }}>
                            Register
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </KeyboardAwareScrollView>
              </View>

            </View>
          </>)}
        </>)}

    </>);

}
const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
    flexDirection: 'column',
    position: 'relative',
    alignContent: 'center',

  },
  content: {
    flexDirection: 'column',
    height: Dimensions.get('screen').height * .95,
    backgroundColor: Colors.main_color,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 4,
    shadowColor: Colors.black,

  },
  errorContent: {
    alignContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: Colors.red,
    fontFamily: "OpenSans-BoldItalic",

  },
  center: {
    alignContent: 'center',
    alignItems: 'center',

  },
  header: {
    width: Dimensions.get('screen').width,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    height: 100,
  },
  inputContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  itemMargin: {
    marginVertical: 5,
  },
  backIcon: {

    width: 30,
    height: 30,
  },
  input: {
    width: Dimensions.get('screen').width * .8,
    fontSize: aspectRatio > 1.6 ? 16 : 20,
    color: Colors.white,
    fontFamily: "OpenSans-Regular",
    borderWidth: 3,
    borderColor: Colors.white,
    borderRadius: 50,
    height: aspectRatio > 1.6 ? 50 : 70,
    paddingHorizontal: 20
  },
  bordered: {
    borderColor: Colors.white,
    borderWidth: 3,
    borderRadius: 50,
    height: aspectRatio > 1.6 ? 50 : 70,
  },
  signupTitle: {
    flex: .9,
    fontSize: 30,
    color: Colors.white,
    textTransform: "uppercase",
    fontFamily: "OpenSans-Bold",
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    width: Dimensions.get('screen').width * .8,
    color: Colors.white,
    fontSize: aspectRatio > 1.6 ? 20 : 24,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    fontFamily: "OpenSans-Bold",
    textTransform: 'capitalize'

  },
  checkbox: {
    width: Dimensions.get('screen').width * .8,
    color: Colors.white,
    fontFamily: "OpenSans-Regular",
    marginBottom:20

  },
  button: {
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    height: 60,
    backgroundColor: Colors.white,
    width: Dimensions.get('screen').width * .8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: aspectRatio > 1.6 ? 18 : 22,
    color: Colors.main_color,
    fontFamily: "OpenSans-Bold",
  },
  verifyContent: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: Colors.main_color,

  },
  verify: {
    width: Dimensions.get('screen').width * .8,
    height: 400,
    marginVertical: Dimensions.get('screen').height * .3,
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.black,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'column'
  },
  loginTitle: {
    fontSize: aspectRatio > 1.6 ? 20 : 24,
    fontFamily: "OpenSans-Regular",
    paddingHorizontal: 2,
    color: Colors.white,
    marginTop: 20

  },
  bold: {
    fontFamily: "OpenSans-Bold",
  },

  button: {
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    height: 60,
    backgroundColor: Colors.main_color,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: aspectRatio > 1.6 ? 18 : 22,
    color: Colors.white,
    fontFamily: "OpenSans-Bold",
  },
  dropdown: {
    height: aspectRatio > 1.6 ? 50 : 70,
    width: Dimensions.get('screen').width * .8,
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 20,
    // color: Colors.white
  },
  placeholderStyle: {
    fontSize: aspectRatio > 1.6 ? 16 : 20,
    color: Colors.white

  },
  selectedTextStyle: {
    fontSize: aspectRatio > 1.6 ? 16 : 20,
    color: Colors.white
  },
  iconStyle: {
    width: 20,
    height: 20,


  },
  inputSearchStyle: {
    height: 40,
    fontSize: aspectRatio > 1.6 ? 16 : 20,
    color: Colors.black
  },

});