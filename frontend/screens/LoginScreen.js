import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerIndieID } from "native-notify";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  const emailInputHandler = (enteredEmail) => {
    setEmail(enteredEmail.toLowerCase());
  }

  const passwordInputHandler = (enteredPassword) => {
    setPassword(enteredPassword);
  }

  const handleLogin = async () => {
    if (!email) {
      setError("All fields must be filled");
      return;
    }

    setError(null);

    let response = await fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.toLowerCase(), password: password }),
    });

    let data = await response.json();

    if (response.status === 200) {
      AsyncStorage.setItem("token", data.token);
      AsyncStorage.setItem("user_id", data.user_id);
      AsyncStorage.setItem("name", data.name);
      AsyncStorage.setItem("walkingSpeed", data.walkingSpeed);
      AsyncStorage.setItem("phoneNumber", data.phoneNumber);
      setEmail(null);
      setPassword(null);
      await registerIndieID(`${data.user_id}`, 6193, "rWR1WMqaI8HcWYDUZQFStS");
      navigation.replace("NavbarContainer");
    } else {
      setError(data.error);
      console.log("Error:", error);
    }
  };

  return (
    <View style={styles.globalContainer}>
      <Text style={styles.title}>LOGIN</Text>
      {/* <Text style={styles.loginButtonText}>Email address</Text> */}
      <TextInput
        style={styles.textInput}
        placeholder="Email address"
        onChangeText={emailInputHandler}
        value={email}
      />
      {/* <Text style={styles.loginButtonText}>Password</Text> */}
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={passwordInputHandler}
        value={password}
      />
      <View style={styles.loginButton}>
        <Pressable onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </Pressable>
        {/* <Button title="Log in" onPress={handleLogin} /> */}
      </View>
      <Text style={styles.orText}>OR</Text>
      <View style={styles.signupButton}>
        <Pressable onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupButtonText}>REGISTER</Text>
        </Pressable>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
    backgroundColor: "white",
    position: "relative"
  },
  title: {
    padding: 10,
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#ebe6ef",
    color: "black",
    borderRadius: 8,
    width: "75%",
    margin: 14,
    padding: 16,
  },
  homeButtonsContainer: {
    flexDirection: "row",
  },
  loginButton: {
    width: "75%",
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    padding: 14,
    fontSize: 18,
    color: "white",
    fontWeight: "bold"
  },
  orText: {
    marginVertical: 16
  },
  signupButton: {
    width: "75%",
    marginBottom: 12,
    marginHorizontal: 12,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    color: "black",
    fontSize: 16,
    padding: 14,
  },
  errorContainer: {
    position: "absolute",
    width: "75%",
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    bottom: 100
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "red",
    alignSelf: "center",
  },
});
