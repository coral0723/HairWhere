import { HairCategory } from "./HairCategory";
import { HairInfo } from "./HairInfo";
import { PostImage } from "./PostImage";
import { User } from "./User";

export interface Post {
  user: User;
  id: number;
  userName: string;
  photoImagePath: string[];
  // like: string[];
  likeCount:number;
  hairName: string;
  text: string;
  gender: string;
  created: Date;
  hairSalon: string;
  hairSalonAddress: string;
  hairLength: string;
  hairColor:string;
}