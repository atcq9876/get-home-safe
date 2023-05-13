import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ChangePasswordModal from '../modals/ChangePasswordModal'
import DeleteAccountModal from '../modals/DeleteAccountModal'

function SettingsScreen({ navigation }) {
  const [userId, setUserId] = useState(null)
  const [speed, setSpeed] = useState(null)

  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(
    false,
  )
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(
    false,
  )

  const retrieveUserId = async () => {
    const value = await AsyncStorage.getItem('user_id')
    setUserId(value)
    console.log('userId: ', value)
  }
  retrieveUserId()

  const handleChangePasswordModal = () => {
    setChangePasswordModalVisible(!changePasswordModalVisible)
  }

  const handleDeleteAccountModal = () => {
    setDeleteAccountModalVisible(!deleteAccountModalVisible)
  }

  const handleLogout = () => {
    AsyncStorage.clear()
    navigation.navigate('SplashScreen')
  }

  const handleSpeedChange = async (speed) => {      
    await AsyncStorage.setItem("walkingSpeed", speed);
    let response = await fetch(`http://localhost:8080/api/user/walkingSpeed/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        walkingSpeed: speed,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      let data = await response.json()
      if(response.status === 200) {
        console.log(data);
      } else {
        setError(data.error);
        console.log('Error:', error);
      }
  }

  useEffect(() => {
    const getCurrentWalkingSpeed = async () => {
      let userId = await AsyncStorage.getItem("user_id");
      let response = await fetch('http://localhost:8080/api/user/' + userId)
      let data = await response.json()
      setSpeed(data.walkingSpeed)
    }
    getCurrentWalkingSpeed();
  }, [])

  return (
    <View style={styles.globalContainer}>
      {changePasswordModalVisible && (
        <ChangePasswordModal
          userId={userId}
          changePasswordModalVisible={changePasswordModalVisible}
          setChangePasswordModalVisible={setChangePasswordModalVisible}
        />
      )}
      {deleteAccountModalVisible && (
        <DeleteAccountModal
          userId={userId}
          deleteAccountModalVisible={deleteAccountModalVisible}
          setDeleteAccountModalVisible={setDeleteAccountModalVisible}
          handleLogout={handleLogout}
        />
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Settings</Text>
      </View>
      {/* <View style={styles.logoContainer}> */}
        {/* Add logo instead of text below once finalised */}
        {/* <Text style={styles.logoText}>Get Home Safe</Text> */}
      {/* </View> */}
      <View style={styles.aboutUsContainer}>
        {/* <Text style={styles.aboutUsTitle}>About the app</Text>
        <Text style={styles.aboutUsText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Congue
          mauris rhoncus aenean vel elit scelerisque mauris. Risus nec feugiat
          in fermentum posuere urna. Id nibh tortor id aliquet lectus proin.
          Nisl purus in mollis nunc sed id. Id nibh tortor id aliquet lectus proin.
          Id nibh tortor id aliquet lectus proin. Id nibh tortor id aliquet lectus proin.
          Id nibh tortor id.
        </Text> */}
        <Image style={styles.aboutUsContainer} source={require("./logo.png")}></Image>
      </View>
      <View style={styles.container}>
        {speed && (
          <View>
            <Text style={styles.text}>WALKING SPEED:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={
                  speed === 'slow' ? styles.activeButton : styles.inactiveButton
                }
                onPress={() => {
                  setSpeed('slow')
                  handleSpeedChange('slow')
                }}
              >
                <Text
                  style={
                    speed === 'slow' ? styles.activeText : styles.inactiveText
                  }
                >
                  SLOW
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  speed === 'normal'
                    ? styles.activeButton
                    : styles.inactiveButton
                }
                onPress={() => {
                  setSpeed('normal')
                  handleSpeedChange('normal')
              }}
              >
                <Text
                  style={
                    speed === 'normal' ? styles.activeText : styles.inactiveText
                  }
                >
                  NORMAL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  speed === 'fast' ? styles.activeButton : styles.inactiveButton
                }
                onPress={() => {
                  setSpeed('fast')
                  handleSpeedChange('fast')
                }}
              >
                <Text
                  style={
                    speed === 'fast' ? styles.activeText : styles.inactiveText
                  }
                >
                  FAST
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Pressable style={styles.button} onPress={handleChangePasswordModal}>
        <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOG OUT</Text>
      </Pressable>
      <Pressable onPress={handleDeleteAccountModal}>
        <Text style={styles.deleteAccountText}>Delete Account</Text>
      </Pressable>
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  titleContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: 'white',
  },
  titleText: {
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    margin: 16,
  },
  logoContainer: {},
  logoText: {
    fontSize: 38,
    fontWeight: '600',
    color: 'black',
  },
  aboutUsContainer: {
    height: 250,
    width: 300,
    // padding: 20,
    // borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  aboutUsTitle: {
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 14,
  },
  aboutUsText: {
    fontSize: 16,
  },
  button: {
    width: 300,
    height: 44,
    backgroundColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteAccountText: {
    color: 'salmon',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 5,
    alignSelf: "center",
    fontWeight: "bold"
  },
  buttonContainer: {
    flexDirection: 'row',
    width: "75%"
  },
  activeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    marginHorizontal: 8,
    width: 89
  },
  inactiveButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'black',
    borderRadius: 8,
    marginHorizontal: 8,
    width: 89
  },
  activeText: {
    color: 'black',
    textAlign: "center"
  },
  inactiveText: {
    color: 'white',
    fontWeight: "600",
    textAlign: "center"
  },
})
