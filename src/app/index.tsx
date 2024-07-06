import { ScrollView, Text } from "react-native";
// import { ReactNativeExample } from "../components/ReactNativeExample";
import { appStyles } from "../styles";

export default function App() {
  return (
    <ScrollView style={appStyles.container}>
      <Text style={appStyles.h1}>React Native Example</Text>
      {/* <ReactNativeExample /> */}
    </ScrollView>
  );
}
