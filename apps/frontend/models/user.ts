import { Organization } from "~~/models/organization";
import _ from "lodash";
import type { IBase } from "@repo/common/Base";
import { UserRole } from "@repo/common/User";
interface UserData {
  username: string;
  fullName: string;
  avatar: string;
}

type UserType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  data: UserData;
  password: string;
  minutes: number;
  role: UserRole;
};

class User implements UserType, IBase {
  id: string = null;
  role: UserRole = UserRole.VIEWER;
  password: string = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  email: string = "";
  net: number = 0;
  data: UserData = {
    username: "",
    fullName: "",
    avatar: "",
  };
  duration?: string;
  initials = () => {
    const s = this.data.fullName.split(" ");
    return s.length > 1
      ? s[0].charAt(0).toUpperCase() + s[1].charAt(0).toUpperCase()
      : s[0].charAt(0).toUpperCase() + s[0].charAt(1).toUpperCase();
  };
  organization: Organization = new Organization();

  constructor(json?: any) {
    if (json) {
      _.merge(this, json);
      this.organization = new Organization(this.organization);
    }
  }
  public toJSON() {
    return { ...this };
  }

  public errors(): [] {
    return [];
  }
}

export { User };
export type { UserData, UserType };
