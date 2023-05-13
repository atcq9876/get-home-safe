import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons";

const ChangePasswordModal = ({ userId, changePasswordModalVisible, setChangePasswordModalVisible }) => {
  const [newPassword, setNewPassword] = useState(null);
  const [retypedPassword, setRetypedPassword] = useState(null);
  const [error, setError] = useState(null);
  
  const handleModal = () => {
    setNewPassword(null);
    setRetypedPassword(null);
    setError(null);
    setChangePasswordModalVisible(!changePasswordModalVisible);
  }

  const passwordInputHandler = (enteredText) => {
    setNewPassword(enteredText);
  }

  const retypedPasswordInputHandler = (enteredText) => {
    setRetypedPassword(enteredText);
  }

  const checkPasswordsAreValid = () => {
    // checks for errors not handled in backend (maybe move first one to backend)
    if (newPassword === null) {
      setError('All fields must be filled');
      console.log(error);
      return true;
    } else if (newPassword !== retypedPassword) {
      setError('Passwords do not match');
      console.log(error);
      return true;
    }
  }

  const handleChangePassword = async () => {      
    if (checkPasswordsAreValid() === true) return;
    setError(null);

    let response = await fetch(`http://localhost:8080/api/user/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        password: newPassword,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })

      let data = await response.json()
      
      if(response.status === 200) {
        console.log(data.message);
        handleModal();
      } else {
        setError(data.error);
        console.log('Error:', error);
      }
  }

  return (
    <Modal>
      <View style={styles.changePasswordModal}>
        <Pressable style={styles.closeButton} onPress={handleModal}>
          <Ionicons name={'close'} size={36} color={'black'} />
        </Pressable>
        <View style={styles.modalMainContents}>
          {/* <Text style={styles.passwordLabel}>New password:</Text> */}
          <TextInput
            style={styles.textInput}
            placeholder="New password"
            secureTextEntry={true}
            onChangeText={passwordInputHandler}
            value={newPassword}
          />
          {/* <Text style={styles.passwordLabel}>Re-type password:</Text> */}
          <TextInput
            style={styles.textInput}
            placeholder="Confirm new password"
            secureTextEntry={true}
            onChangeText={retypedPasswordInputHandler}
            value={retypedPassword}
          />
          <View style={styles.confirmButtonContainer}>
            <Pressable style={styles.confirmButton} onPress={handleChangePassword}>
              <Text style={styles.confirmButtonText}>CHANGE PASSWORD</Text>
            </Pressable>
          </View>
          {error &&
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          }
        </View>
      </View>
    </Modal>
  );
}

export default ChangePasswordModal;

const styles = StyleSheet.create({
  changePasswordModal: {
    flex: 1,
    marginBottom: 100,
    marginTop: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    position: "relative"
  },
  closeButton: {
    flex: 0.1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingRight: 24,
    marginLeft: 'auto',
  },
  modalMainContents: {
    flex: 0.9,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#ebe6ef",
    color: "black",
    borderRadius: 8,
    width: "75%",
    margin: 18,
    padding: 16,
  },
  confirmButton: {
    width: "75%",
    marginTop: 18,
    marginHorizontal: 12,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    padding: 14,
    fontSize: 18,
    color: "white",
    fontWeight: "bold"
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
    errorContainer: {
    position: "absolute",
    width: "75%",
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    bottom: 50
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "red",
    alignSelf: "center",
  },
});
