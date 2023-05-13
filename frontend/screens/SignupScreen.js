import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerIndieID } from "native-notify";

function SignupScreen({ navigation }) {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [retypedPassword, setRetypedPassword] = useState(null);
  const [error, setError] = useState(null);

  const nameInputHandler = (enteredName) => {
    setName(enteredName);
  };

  const emailInputHandler = (enteredEmail) => {
    setEmail(enteredEmail.toLowerCase());
  };

  const phoneNumberInputHandler = (enteredPhoneNumber) => {
    setPhoneNumber(enteredPhoneNumber);
  };

  const passwordInputHandler = (enteredPassword) => {
    setPassword(enteredPassword);
  };

  const retypedPasswordInputHandler = (reenteredPassword) => {
    setRetypedPassword(reenteredPassword);
  };

  const checkForInputErrors = () => {
    if (password !== retypedPassword) {
      setError("Passwords do not match");
      console.log(error);
      return;
      return true;
    } else if (!email) {
      setError("All fields must be filled");
      console.log(error);
      return true;
    }
  };

  const handleSignup = async () => {
    if (checkForInputErrors() === true) return;

    setError(null);

    let response = await fetch("http://localhost:8080/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email.toLowerCase(),
        phoneNumber: phoneNumber,
        password: password,
      }),
    });

    let data = await response.json();

    if (response.status === 200) {
      AsyncStorage.setItem("token", data.token);
      AsyncStorage.setItem("user_id", data.user_id);
      AsyncStorage.setItem("name", data.name);
      AsyncStorage.setItem("walkingSpeed", data.walkingSpeed);
      AsyncStorage.setItem("phoneNumber", data.phoneNumber);
      setName(null);
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
      <Text style={styles.title}>SIGNUP</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Full name"
        onChangeText={nameInputHandler}
        value={name}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Email address"
        onChangeText={emailInputHandler}
        value={email}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Mobile number"
        onChangeText={phoneNumberInputHandler}
        value={phoneNumber}
      />
      <TextInput
        style={styles.textInput}
        secureTextEntry={true}
        placeholder="Password"
        onChangeText={passwordInputHandler}
        value={password}
      />
      <TextInput
        style={styles.textInput}
        secureTextEntry={true}
        placeholder="Confirm password"
        onChangeText={retypedPasswordInputHandler}
        value={retypedPassword}
      />
      <View style={styles.signupButton}>
        <Pressable onPress={handleSignup}>
          <Text style={styles.signupButtonText}>SIGNUP</Text>
        </Pressable>
        {/* <Button title="Sign up" onPress={handleSignup} /> */}
      </View>
      <Text style={styles.orText}>OR</Text>
      <View style={styles.loginButton}>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
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

export default SignupScreen;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    padding: 10,
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },
  inputLabel: {
    padding: 16,
    fontSize: 18,
    color: "#ffffff",
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
  signupButton: {
    width: "75%",
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    padding: 14,
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 16,
  },
  loginButtonText: {
    color: "#ffffff",
  },
  errorContainer: {
    width: "75%",
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    bottom: 10,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "red",
    alignSelf: "center",
  },
  loginButton: {
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
  loginButtonText: {
    color: "black",
    fontSize: 16,
    padding: 14,
  },
});
