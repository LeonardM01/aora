import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

export function useAppwrite(
  fn: () => Promise<Models.DocumentList<Models.Document>>,
) {
  const [data, setData] = useState<Models.Document[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function fetchData() {
    setIsLoading(true);
    fn()
      .then((res) => {
        setData(res.documents);
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        Alert.alert("Error", "Failed to fetch posts");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function refetch() {
    fetchData();
  }

  return { data, isLoading, refetch };
}

export default useAppwrite;
