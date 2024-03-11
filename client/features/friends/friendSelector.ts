import { Friend } from "@/interfaces/Friend"; 
import { RootState } from "../store";

export const friendList = (state: RootState): Friend[] => state.friend.friends;
