import { useEffect, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  FlatList,
  StatusBar,
  TextInput,
  Button,
} from 'react-native'
import Contact from '../components/contact'
import AutoCompleteSearchBox from '../components/emailSearchBox'

const ContactsScreen = () => {
  const [error, setError] = useState(null)
  const [contacts, setContacts] = useState(null)
  const [updated, setUpdated] = useState(null)
  const [userId, setUserId] = useState(null)
  useEffect(() => {
    const retrieveUserId = async () => {
      const value = await AsyncStorage.getItem('user_id');
      setUserId(value);
    };
    retrieveUserId();
  },[])
  useEffect(() => {
      let response = fetch('http://localhost:8080/api/user/contacts/' + userId, {
    }).then(response => response.json() )
    .then(async data => {
    setUpdated(false)
    setContacts(data.emergencyContacts)
    })
  },[updated])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Emergency contacts</Text>
      </View>
      <View style={styles.searchBar}>
        <AutoCompleteSearchBox userId={userId} setUpdated={setUpdated}/>
        {/* <TextInput
          style={styles.textInput}
          placeholder="Search by email..."
          // onChangeText={contactInputHandler}
          // value={contactEmail}
        /> */}
      </View>
      <View style={styles.contactsList}>
        <SafeAreaView style={styles.contactsListContainer}>
          {contacts && <FlatList
            data={contacts}
            renderItem={({ item }) => <Contact userId={userId} item={item} setUpdated={setUpdated}/>}
            keyExtractor={(item) => item.id}
          />}
        </SafeAreaView>
      </View>
    </View>
  )
}

export default ContactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    // marginTop: StatusBar.currentHeight || 0,
  },
  titleContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: 'white',
    marginBottom: 20
  },
  titleText: {
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    margin: 16,
  },
  searchBar: {
    padding: 10,
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    width: 500,
    alignItems: 'center',
  },
  contactsList: {
    zIndex: -1,
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 5,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
  },
  contactsListContainer: {
    flex: 1,
  }
})
