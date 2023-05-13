import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Timeout = ({ setViewTimeOut, setViewNotHomeSafe, handleHomeSafe }) => {
  const [timer, setTimer] = useState(60);
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  // maybe put in a useEffect hook when refactoring
  const retrieveUserInfo = async () => {
    const userName = await AsyncStorage.getItem('name');
    setName(userName);
    console.log('name: ', userName);
    const phone = await AsyncStorage.getItem('phoneNumber');
    setPhoneNumber(phone);
    console.log('phoneNumber: ', phoneNumber);
  }
  retrieveUserInfo();

  const sendNotification = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    // got to map through emergency contacts
    let response = await fetch(
      `http://localhost:8080/api/user/contacts/${userId}`
    );
    let data = await response.json();
    if (response.status === 200) {
      sendTimer0Notification(userId, data);
    }
  };

  const sendTimer0Notification = async (userId, data) => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    for (const contact of data.emergencyContacts) {
      await fetch("https://app.nativenotify.com/api/indie/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subID: `${contact.id}`,
          appId: 6193,
          appToken: "rWR1WMqaI8HcWYDUZQFStS",
          title: `${name} didn't get home safe...`,
          message: "Get in touch ASAP!!!",
        }),
      });
      await fetch(
        `http://localhost:8080/api/user/notifications/${contact.id}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notification: {
              title: `${name} didn't get home safe...`,
              message: `Tap here to see more info` ,
              timeSent: new Date(),
              name: name,
              phoneNumber: phoneNumber,
              longitude: currentLocation.coords.longitude,
              latitude: currentLocation.coords.latitude
            },
          }),
        }
      );
    }
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      // perform fetch request here
      clearInterval(interval);
    }
    if (timer === 0) {
      sendNotification();
      setViewTimeOut(false);
      setViewNotHomeSafe(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
     <View style={styles.modalContainer}> 
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setViewTimeOut(false)}
        >
        <Ionicons name="close" size={40} color={"black"} />
      </TouchableOpacity>
      <View style={styles.modalMainContents}>
      <Text style={styles.warningText}>Click below or your emergency contacts will be notified in:</Text>
      <Text style={styles.timerText}>{timer} seconds</Text>
      <TouchableOpacity
        style={styles.homeSafeButton}
        onPress={() => {
          setTimer(0)
          handleHomeSafe()
          setViewTimeOut(false)
        }}
      >
        <Text style={styles.buttonText}>Home Safe</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    color: "black",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 46,
  },
  closeButton: {
    flex: 0.1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingRight: 24,
    marginLeft: 'auto',
  },
  modalMainContents: {
    color: "black",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 90,
  
  },
  warningText: {
    fontSize: 22,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 12,
  },
  timerText: {
    fontSize: 22,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 16
  },
  homeSafeButton: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    fontSize: 20,
    color: 'green',
  },
})

export default Timeout
