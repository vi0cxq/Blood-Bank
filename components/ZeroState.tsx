import { colors } from "@/constants/colors";
import { SearchX } from "lucide-react-native";
import React from "react";
import { View, Text } from "react-native";
import { H3 } from "./ui/typography";
import { Button } from "./ui/button";

type ZeroStateProps = {
  resetFn?: () => void;
};

const ZeroState = ({ resetFn }: ZeroStateProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <SearchX color={colors.light.destructive} size={38} />
      <H3 className="mt-4">No Results Found</H3>
      <Text className="text-center">
        Try adjusting your filters or clearing them to see more options.
      </Text>
      {resetFn && (
        <Button
          variant={"destructive"}
          className="mt-4"
          onPress={() => {
            resetFn?.();
          }}
        >
          <Text>Reset Filter</Text>
        </Button>
      )}
    </View>
  );
};

export default ZeroState;
