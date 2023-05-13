import React, { useState, useEffect } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  Modal,
  Text
} from 'react-native'
import * as Location from 'expo-location'
import Constant from 'expo-constants'
import Search from './mapComponents/Search'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SOS from './mapModals/sos'
import HomeSafe from './mapModals/homeSafe'
import TimeOut from './mapModals/timeOut'
import NotHomeSafe from "./mapModals/NotHomeSafe"
import Map from './mapComponents/map'
import MapButtons from './mapComponents/mapButtons'

const GOOGLE_MAPS_APIKEY = require('../../mapsApiKey');

const MapScreen = () => {
  const [destination, setDestination] = useState(null)
  const [location, setLocation] = useState(null)
  const [duration, setDuration] = useState(null)
  const [distance, setDistance] = useState(null)
  const [mapRegion, setMapRegion] = useState(null)
  const [started, setStarted] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [viewSOS, setViewSOS] = useState(false)
  const [viewHomeSafe, setViewHomeSafe] = useState(false)
  const [viewTimeOut, setViewTimeOut] = useState(false)
  const [viewNotHomeSafe, setViewNotHomeSafe] = useState(false)
  const [name, setName] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)

  const calculateDuration = async (time) => {
    const speed = await AsyncStorage.getItem('walkingSpeed')
    if (speed === 'normal') {
      setDuration(time)
    } else if (speed === 'slow') {
      setDuration(time * 1.1)
    } else {
      setDuration(time * 0.9)
    }
  }

  useEffect(() => {
    const getPermissions = async () => {
      // let { status } = await Location.requestForegroundPermissionsAsync()
      // if (status !== 'granted') {
      //   return
      // }
      const userName = await AsyncStorage.getItem('name')
      setName(userName)
      const phone = await AsyncStorage.getItem('phoneNumber')
      setPhoneNumber(phone)
      let currentLocationString = await AsyncStorage.getItem("currentLocation")
      let currentLocation = JSON.parse(currentLocationString)
      setLocation(currentLocation)
      const { width, height } = Dimensions.get('window')
      const ASPECT_RATIO = width / height
      const LATITUDE_DELTA = 0.02
      const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    }
    getPermissions()
  }, [])

  useEffect(() => {
    if (destination) {
      const { latitude, longitude } = location.coords
      const { lat, lng } = destination
      const minLat = Math.min(latitude, lat)
      const maxLat = Math.max(latitude, lat)
      const minLng = Math.min(longitude, lng)
      const maxLng = Math.max(longitude, lng)

      setMapRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: maxLat - minLat + 0.015,
        longitudeDelta: maxLng - minLng + 0.015,
      })
    }
  }, [destination])

  const startJourney = () => {
    setStarted(true)
    setIsRunning(true)
  }

  const sendSOSNotification = async (userId, data) => {
    let currentLocation = await Location.getCurrentPositionAsync({})
    console.log(currentLocation)
    for (const contact of data.emergencyContacts) {
      await fetch('https://app.nativenotify.com/api/indie/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subID: `${contact.id}`,
          appId: 6193,
          appToken: 'rWR1WMqaI8HcWYDUZQFStS',
          title: `${name} hit SOS!!!`,
          message: 'Get in touch ASAP!!!',
        }),
      })
      await fetch(
        `http://localhost:8080/api/user/notifications/${contact.id}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notification: {
              title: `${name} hit SOS!`,
              message: `Tap here to see more info`,
              timeSent: new Date(),
              name: name,
              phoneNumber: phoneNumber,
              longitude: currentLocation.coords.longitude,
              latitude: currentLocation.coords.latitude
            },
          }),
        },
      )
    }
  }

  const sendSafeNotification = async (userId, data) => {
    for (const contact of data.emergencyContacts) {
      await fetch('https://app.nativenotify.com/api/indie/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subID: `${contact.id}`,
          appId: 6193,
          appToken: 'rWR1WMqaI8HcWYDUZQFStS',
          title: `${name} got home safe`,
          message: 'All good',
        }),
      })
      await fetch(
        `http://localhost:8080/api/user/notifications/${contact.id}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notification: {
              title: `${name} got home safe!`,
              message: `No need to worry`,
              timeSent: new Date(),
            },
          }),
        },
      )
    }
  }

  const handleSOSbutton = async () => {
    const userId = await AsyncStorage.getItem('user_id')
    setDestination(null)
    let response = await fetch(
      `http://localhost:8080/api/user/contacts/${userId}`,
    )
    let data = await response.json()
    if (response.status === 200) {
      sendSOSNotification(userId, data)
      setStarted(false)
      setViewSOS(true)
    }
  }

  const handleHomeSafe = async () => {
    const userId = await AsyncStorage.getItem('user_id')
    setDestination(null)
    let response = await fetch(
      `http://localhost:8080/api/user/contacts/${userId}`,
    )
    let data = await response.json()
    if (response.status === 200) {
      sendSafeNotification(userId, data)
      setStarted(false)
      setViewHomeSafe(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Get Home Safe</Text>
      </View>
      <View style={styles.searchContainer}>
        <Search
          setDestination={setDestination}
          setIsRunning={setIsRunning}
          setStarted={setStarted}
        />
      </View>
      <Map
        mapRegion={mapRegion}
        location={location}
        destination={destination}
        GOOGLE_MAPS_APIKEY={GOOGLE_MAPS_APIKEY}
        calculateDuration={calculateDuration}
        setDistance={setDistance}
      />
      <View style={styles.bottomContainer}>
        <MapButtons
          distance={distance}
          duration={duration}
          handleSOSbutton={handleSOSbutton}
          started={started}
          setStarted={setStarted}
          destination={destination}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          setViewTimeOut={setViewTimeOut}
          setDestination={setDestination}
          startJourney={startJourney}
          handleHomeSafe={handleHomeSafe}
        />
      </View>
      <Modal visible={viewSOS}>
        <SOS setViewSOS={setViewSOS} />
      </Modal>
      <Modal visible={viewHomeSafe}>
        <HomeSafe setViewHomeSafe={setViewHomeSafe} />
      </Modal>
      <Modal visible={viewTimeOut}>
        <TimeOut
          setViewTimeOut={setViewTimeOut}
          handleHomeSafe={handleHomeSafe}
          setViewNotHomeSafe={setViewNotHomeSafe}
        />
      </Modal>
      <Modal visible={viewNotHomeSafe}>
        <NotHomeSafe
          setViewNotHomeSafe={setViewNotHomeSafe}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
    backgroundColor: 'white'
  },
  titleContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 40,
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderColor: '#dddddd',
  },
  titleText: {
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    margin: 16,
  },
  searchContainer: {
    height: Constant.statusBarHeight,
    width: '100%',
    zIndex: 1,
  },
  bottomContainer: {
    flex: 1,
  },
  bottomContainerChild: {
    flex: 1,
  }
})

export default MapScreen
