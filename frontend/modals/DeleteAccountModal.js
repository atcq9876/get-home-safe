import * as React from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const DeleteAccountModal = ({
    userId,
    deleteAccountModalVisible,
    setDeleteAccountModalVisible,
    handleLogout
  }) => {

  const handleModal = () => {
    setDeleteAccountModalVisible(!deleteAccountModalVisible);
  }

  const handleDeleteAccount = async () => {
    handleLogout();

    let response = await fetch(`http://localhost:8080/api/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    })

      let data = await response.json()

      if(response.status === 200) {
        handleModal();
      } else {
        console.log('Delete unsuccessful');
      }
  }
  
  return (
    <Modal>
      <View style={styles.deleteAccountModal}>
        <Pressable style={styles.closeButton} onPress={handleModal}>
          <Ionicons name={'close'} size={36} color={'black'} />
        </Pressable>
        <View style={styles.modalMainContents}>
          <View style={styles.warningMessageContainer}>
            <Text style={styles.warningText}>
              Are you sure you want to delete your account?
            </Text>
          </View>
          <View style={styles.confirmButtonContainer}>
            <Pressable style={styles.yesButton} onPress={handleDeleteAccount}>
              <Text style={styles.yesButtonText}>YES</Text>
            </Pressable>
          </View>
          <View style={styles.confirmButtonContainer}>
            <Pressable style={styles.noButton} onPress={handleModal}>
              <Text style={styles.noButtonText}>NO</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
 
export default DeleteAccountModal;

const styles = StyleSheet.create({
  deleteAccountModal: {
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
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  warningMessageContainer: {
    height: 60,
    width: 250,
  },
  warningText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  yesButton: {
    height: 44,
    width: "75%",
    marginVertical: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF5151",
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesButtonText: {
    color: '#FF5151',
    fontSize: 16,
    fontWeight: '600',
  },
  noButton: {
    height: 44,
    width: "75%",
    marginVertical: 16,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: '600',
  },
});
