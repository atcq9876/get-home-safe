import React, { useState, useEffect } from 'react'
import { ActivityIndicator, View, StyleSheet, Text, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerIndieID } from "native-notify";
import * as Location from 'expo-location'

const SplashScreen = ({ navigation }) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false)
      const userId = await AsyncStorage.getItem('user_id')
      if (userId) {
        await registerIndieID(`${userId}`, 6193, 'rWR1WMqaI8HcWYDUZQFStS')
        let response = await fetch('http://localhost:8080/api/user/' + userId)
        let data = await response.json();
        await AsyncStorage.setItem("walkingSpeed", data.walkingSpeed)
        await AsyncStorage.setItem("name", data.name);
        await AsyncStorage.setItem("phoneNumber", data.phoneNumber);
      }
      AsyncStorage.getItem('user_id').then((value) =>
        navigation.replace(value === null ? 'Auth' : 'NavbarContainer'),
      )
    }, 2000)
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return
      }
      let currentLocation = await Location.getCurrentPositionAsync({})
      await AsyncStorage.setItem("currentLocation", JSON.stringify(currentLocation))
    }
    getPermissions();
  }, [])

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/loadinggif.gif")}></Image>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    height: 200,
    width: 200
  }
})
