import axios from "axios";
import { useQuery } from "react-query";
import API_PATHS from "~/constants/apiPaths";

export function useUsers() {
  return useQuery("user", async () => {
    const res = await axios.get(API_PATHS.user);
    return res.data;
  });
}
