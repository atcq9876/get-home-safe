import { StyleSheet, Text, View, Pressable } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
const Contact = ({ item, setUpdated, userId }) => {
  const handleDelete = (email) => {
    fetch(`http://localhost:8080/api/user/contact`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        emergencyContactEmail: email,
        field: 'delete',
      }),
    }).then((response) => {
      setUpdated(true)
    })
  }
  return (
    <View style={styles.contactContainer}>
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
      <View>
        <Pressable style={styles.closeButton} onPress={() => handleDelete(item.email)}>
          <Ionicons name={'close'} size={36} color={'#aaaaaa'} />
        </Pressable>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  contactContainer: {
    padding: 10,
    bordeColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    margin: 10,
    width: 320,
    flexDirection: 'row',
  },
  contactDetails: {
    flex: 5,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  contactEmail: {
    marginTop: 4,
  },
  closeButton: {
    // flex: 0.1,
    justifyContent: 'flex-start',
    marginLeft: 'auto',
    paddingTop: 5,
    paddingRight: 5,
  },
})
export default Contact