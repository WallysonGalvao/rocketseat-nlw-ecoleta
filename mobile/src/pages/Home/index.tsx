import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import api from "../../services/api";

interface IState {
  sigla: string;
}

interface ICity {
  nome: string;
}

interface IItem {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<IItem[]>([]);
  const [selectedUf, setSelectedUf] = useState();
  const [cities, setCities] = useState<IItem[]>([]);
  const [selectedCity, setSelectedCity] = useState();

  const IBGE_API_URL = "https://servicodados.ibge.gov.br/api/v1/";
  const IBGE_URL_PATH = "/localidades/estados";

  useEffect(() => {
    axios
      .get(`${IBGE_API_URL}${IBGE_URL_PATH}?orderBy=nome`)
      .then(({ data }) => {
        const ufs = data.map((uf: IState) => ({
          label: uf.sigla,
          value: uf.sigla.toLowerCase(),
        }));
        setUfs(ufs);
      });
  }, []);

  useEffect(() => {
    if (selectedUf) {
      const url = `${IBGE_API_URL}${IBGE_URL_PATH}/${selectedUf}/municipios?orderBy=nome`;
      axios.get(url).then(({ data }) => {
        const cities = data.map((city: ICity) => ({
          label: city.nome,
          value: city.nome.toLowerCase(),
        }));
        setCities(cities);
      });
    }
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{
              label: "Selecione uma UF",
            }}
            style={{ ...pickerSelectStyles }}
            onValueChange={(value) => setSelectedUf(value)}
            items={ufs}
          />

          <RNPickerSelect
            placeholder={{
              label: "Selecione uma cidade",
            }}
            style={{ ...pickerSelectStyles }}
            onValueChange={(value) => setSelectedCity(value)}
            items={cities}
          />

          <RectButton
            style={styles.button}
            onPress={() =>
              navigation.navigate("Points", {
                uf: selectedUf,
                city: selectedCity,
              })
            }
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
