import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        router.replace("/(tabs)");
      }
    };
    checkToken();
  }, [])

  async function generateSalt() {
    return Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
  }

  async function hashPassword(password: string, salt: string) {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + salt
    );
  }

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, password, salt")
      .eq("username", username)
      .single();
  
    if (error || !data) {
      Alert.alert("Erreur", "Pseudo ou mot de passe incorrect.");
      return;
    }
    
    // Recréer le hash avec le sel stocké
    const hashedInputPassword = await hashPassword(password, data.salt);

    if (hashedInputPassword !== data.password) {
      Alert.alert("Erreur", "Pseudo ou mot de passe incorrect.");
      return;
    }

    // Générer un token unique (UUID ou hash)
    const sessionToken = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data.id + Date.now().toString()
    );

    // Stocker le token localement
    await AsyncStorage.setItem("userToken", sessionToken);
  
    Alert.alert("Succès", "Connexion réussie !");
    router.replace("/(tabs)");
  };

  const handleSignUp = async () => {
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);
  
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password: hashedPassword, salt }]);
  
    if (error) {
      Alert.alert("Erreur", "Erreur lors de l'inscription.");
      return;
    }
  
    Alert.alert("Succès", "Inscription réussie. Vous pouvez maintenant vous connecter.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        // secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Se connecter"
        onPress={handleLogin}
      />

      <Button
        title="S'inscrire"
        onPress={handleSignUp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
