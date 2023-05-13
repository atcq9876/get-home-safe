import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const retrieveToken = async () => {
      const value = await AsyncStorage.getItem("token");
      setToken(value);
    };
    retrieveToken();

    const retrieveUserId = async () => {
      const value = await AsyncStorage.getItem('user_id');
      setUserId(value);
    };
    retrieveUserId();

    const changedScreen = navigation.addListener("focus", () => {
      retrieveToken();
    });

  }, [token]);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setToken(null);
    setUserId(null);
    navigation.replace("Auth");
  }
 
  return (
    <View style={styles.globalContainer}>
      <Text style={styles.title}>Get Home Safe</Text>
      <View style={styles.homeButtonsContainer}>
        {!token && (
          <View style={styles.button}>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.inputLabel}>Log in</Text>
            </Pressable>
          </View>
        )}
        {!token && (
          <View style={styles.button}>
            <Pressable onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.inputLabel}>Sign up</Text>
            </Pressable>
          </View>
        )}
      </View>
      {token && (
        <View style={styles.button}>
          <Pressable onPress={handleLogout}>
            <Text style={styles.inputLabel}>Log out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#64C5F0",
  },
  title: {
    padding: 10,
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
  },
  inputLabel: {
    padding: 16,
    fontSize: 18,
    color: "#ffffff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e4d0ff",
    backgroundColor: "#ADDEF3",
    color: "#000000",
    borderRadius: 8,
    width: "75%",
    padding: 16,
  },
  homeButtonsContainer: {
    flexDirection: "row",
  },
  button: {
    width: 120,
    marginVertical: 24,
    marginHorizontal: 12,
    backgroundColor: "#348EC5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
