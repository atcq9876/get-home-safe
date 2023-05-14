import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Linking,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

const NotificationModal = ({ handleNotificationModal, selectedNotification }) => {  
  return (
    <Modal>
      <View style={styles.emergencyModal}>
        <Pressable style={styles.closeButton} onPress={handleNotificationModal}>
          <Ionicons name={'close'} size={36} color={'black'} />
        </Pressable>
        <View style={styles.modalMainContents}>
          <Text style={styles.modalText}>{selectedNotification.name} didn't make it home!</Text>
          <Text style={styles.lastLocationText}>Their last location:</Text>
          <View style={styles.mapContainer}>
            <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: selectedNotification.latitude,
                longitude: selectedNotification.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
            <Marker coordinate = {{latitude: selectedNotification.latitude,longitude: selectedNotification.longitude}}
              pinColor = {"purple"}
              title={`${selectedNotification.name}`}
            />
            </MapView>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL(`tel:${selectedNotification.phoneNumber}`)}
          >
            <Text style={styles.callButtonText}>Call {selectedNotification.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:999')}
          >
            <Text style={styles.callButtonText}>Call 999</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
 
export default NotificationModal;

const styles = StyleSheet.create({
  emergencyModal: {
    flex: 1,
    marginTop: 46,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    flex: 0.1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingRight: 20,
    marginLeft: 'auto',
  },
  modalMainContents: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 70,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginBottom: 20,
    alignSelf: 'center',
  },
  lastLocationText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginBottom: 8,
    // alignSelf: 'left',
  },
  mapContainer: {
    height: 500,
    width: 400,
    margin: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    marginTop: 15,
    marginBottom: 10,
    padding: 10,
    width: 400,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  callButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
