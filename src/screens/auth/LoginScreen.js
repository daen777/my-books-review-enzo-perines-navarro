import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { loginUser } from "../../services/authService";

const LoginScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onLogin = async (data) => {
    setLoading(true);
    try {
      await loginUser(data.email, data.password);
      Alert.alert("Inicio de sesión exitoso", "Bienvenido!");
      navigation.navigate("Library"); // Redirigir a la biblioteca
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Iniciar Sesión</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: "El email es obligatorio" }}
        render={({ field: { onChange, value } }) => (
          <TextInput 
            placeholder="Email"
            onChangeText={onChange}
            value={value}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
        )}
      />
      {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: "La contraseña es obligatoria" }}
        render={({ field: { onChange, value } }) => (
          <TextInput 
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={onChange}
            value={value}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
        )}
      />
      {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}

      <Button title={loading ? "Ingresando..." : "Iniciar Sesión"} onPress={handleSubmit(onLogin)} disabled={loading} />
      <Button title="No tienes cuenta? Regístrate" onPress={() => navigation.navigate("Register")} />
    </View>
  );
};

export default LoginScreen;
