import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "@/supabase";
import { Alert } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password) // need hachage via bcrypt
      .single();

    if (error || !data) {
      Alert.alert("Erreur", "Pseudo ou mot de passe incorrect.");
      return;
    }

    router.replace("/(tabs)");
  };

  const handleSignUp = async () => {
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password }]);

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
        secureTextEntry
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
