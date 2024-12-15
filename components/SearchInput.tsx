import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useState } from "react";

import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface Props {
  initialQuery?: string;
}

const SearchInput = ({ initialQuery }: Props) => {
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery ?? "");

  const handleSearch = () => {
    if (!query)
      return Alert.alert(
        "Missing query",
        "Please enter something to search the database",
      );

    if (pathname.startsWith("/search")) router.setParams({ query });
    else router.push(`/search/${query}`);

    Keyboard.dismiss();
  };

  return (
    <View className="w-full flex-row h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center space-x-4">
      <TextInput
        className="flex-1 text-white font-pregular text-base w-full mt-0.5"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
