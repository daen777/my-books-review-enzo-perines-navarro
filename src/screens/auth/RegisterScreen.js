import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { registerUser } from "../../services/authService";

const RegisterScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onRegister = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password);
      Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Registro</Text>

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
        rules={{ required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } }}
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

      <Button title={loading ? "Registrando..." : "Registrar"} onPress={handleSubmit(onRegister)} disabled={loading} />
      <Button title="Ya tienes cuenta? Inicia sesión" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

export default RegisterScreen;
