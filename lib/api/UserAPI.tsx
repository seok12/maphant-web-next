import { UserData } from "../type/userType";
import {
  dataResponse,
  GetAPI,
  PostAPI,
  DeleteAPI,
  statusResponse,
} from "./fetchAPI";

type LoginResponse = {
  pubKey: string;
  privKey: string;
} & statusResponse;

class UserAPI {
  static login(email: string, password: string) {
    return PostAPI<LoginResponse>("/user/login", {
      email,
      password,
    });
  }
  static getMyProfile() {
    return GetAPI<dataResponse<UserData>>("/user/");
  }

  static passwordConfirm(password: string) {
    return PostAPI<statusResponse>("/user/changeinfo/identification", {
      password,
    });
  }

  static updateUserNickname(nickname: string) {
    return PostAPI<statusResponse>("/user/changeinfo/nickname", {
      nickname,
    });
  }

  static updateUserPassWordModify(
    newPassword: string,
    newPasswordCheck: string
  ) {
    return PostAPI<statusResponse>("/user/changeinfo/password", {
      newPassword,
      newPasswordCheck,
    });
  }

  static DeleteCatagory(category: string, major: string) {
    return DeleteAPI<statusResponse>("/user/changeinfo/categorymajor", {
      category,
      major,
    });
  }

  static addCategory(email: string, category: string, major: String) {
    return PostAPI<statusResponse>("/user/changeinfo/categorymajor", {
      email,
      category,
      major,
    });
  }

  static UserDelete() {
    return DeleteAPI<statusResponse>("/user");
  }
}

export default UserAPI;
