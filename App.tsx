import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { withSafeAreaInsets } from "react-native-safe-area-context";

interface InterPaises {
  codigo: string;
  pais: string;
}

const initialState: InterPaises = {
  codigo: "",
  pais: "",

};

export default function App() {
  const [paises, setPaises] = useState<InterPaises[]>([]);
  const [pais, setPais] = useState<InterPaises>(initialState);

  function handleRegister(): void {
    if (pais.codigo === "" || pais.pais === "") {
      Alert.alert("Todos os campos devem ser preenchidos");
      return;
    }

    const filterpaises = paises.filter((item) => {
      return pais.codigo === item.codigo
    })

    if (filterpaises.length > 0) {
      Alert.alert(" Já cadastrado")
      return; 
    }
    setPaises([...paises, pais]);
  }


  useEffect(() => {
    async function pushUsers() {
      const p = await AsyncStorage.getItem("@paises");

      if (p) setPaises(JSON.parse(p));
    }
    pushUsers();
  }, []);

  useEffect(() => {
    async function resgisterUsers() {
      await AsyncStorage.setItem("@paises", JSON.stringify(paises));
    }
    resgisterUsers();
    setPais(initialState);
  }, [paises]);

  function handleDelete(user: InterPaises): void {
    const delP = paises.filter((item) => {
      return item.codigo !== user.codigo;
    });
    setPaises(delP);
  }

  return (
    <>
      <View style={styles.container}>
        <View style={{width: '100%', height: 100, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 25,}}>Cadastro de Países</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Codigo"
            style={styles.input}
            onChangeText={(value) => {
              setPais({ ...pais, codigo: value });
              
            }}
            value={pais.codigo}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="País"
            style={styles.input}
            onChangeText={(value) => {
              setPais({ ...pais, pais: value });
            
            }}
            value={pais.pais}
          />
        
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              handleRegister();
            }}
          >
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          <FlatList
            data={paises}
            renderItem={({ item }) => (
              <TouchableOpacity
              onLongPress={() => {
                handleDelete(item);

              }}
              style={styles.card}
            >
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.codigo}</Text>
                <Text style={styles.text}>
                  {item.pais}
                </Text>
              </View>
              </TouchableOpacity>
            )}
            keyExtractor={({ codigo }) => codigo}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17161C",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  addBtn: {
    width: 250,
    height: 45,
    backgroundColor: "#0057c9",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 8,
    shadowOpacity: 0.9,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 3,
  },

  input: {
    color: "white",
    height: 40,
    margin: 12,
    padding: 10,
    borderColor: "white",
    width: 250,
    borderWidth: 2,
    borderRadius: 5,
  
  },

  list: {
    width: "100%",
    marginTop: 20
  },

  text: {
    marginHorizontal: 8,
    textAlign: "center",
    color: "white",
  },

  textContainer: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  card: {
    width: "100%",
    padding: 10,
    backgroundColor: "#57a0ff",
    borderRadius: 5,
    marginBottom: 5,
  }
});
