import React from 'react'
import { Dimensions, StyleSheet, TextInput, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

const GOOGLE_MAPS_APIKEY = require('../../../mapsApiKey');

const GooglePlacesInput = ({setDestination, setStarted, setIsRunning}) => {

  return (
    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        GooglePlacesDetailsQuery={{ fields: "geometry" }}
        fetchDetails={true} // you need this to fetch the details object onPress
        placeholder="Search"
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en", // language of the results
        }}
        onPress={(data, details = null) => {
          setDestination(details?.geometry?.location)
          setStarted(false)
          setIsRunning(false)
        }}
        onFail={(error) => console.error(error)} />
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    // borderRadius: 8,
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
  },
})

export default GooglePlacesInput

////this is a component not a screen



