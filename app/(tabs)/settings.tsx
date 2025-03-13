import { View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    router.replace("/(auth)");
  };

  return (
    <View style={styles.container}>
      <Button title="Se déconnecter" onPress={handleLogout} color="#FF3B30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
