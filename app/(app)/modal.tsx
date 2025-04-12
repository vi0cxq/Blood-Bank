import { Text, View } from "react-native";

export default function Modal() {
  return (
    <View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <Text className="text-center">Modal</Text>
      <Text className="text-center">This is a modal screen.</Text>
    </View>
  );
}
