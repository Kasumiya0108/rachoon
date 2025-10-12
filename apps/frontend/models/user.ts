import { Organization } from "~~/models/organization";
import _ from "lodash";
import type { IBase } from "@repo/common";
import { UserRole } from "@repo/common";
import { Helpers } from "@repo/common";
interface UserData {
  username: string;
  fullName: string;
  avatar: string;
}

class Token {
  id: string | null = null;
  name: string = "";
  token: string = "";
  expiresAt: null | Date = null;
  createdAt: Date = new Date();

  constructor(json?: any) {
    if (json) {
      Helpers.merge(this, json);
      if (json.expiresAt) {
        this.expiresAt = new Date(Date.parse(json.expiresAt.toString()));
      }
      if (json.createdAt) {
        this.createdAt = new Date(Date.parse(json.createdAt.toString()));
      }
    }
  }
}

class User implements IBase {
  id: string | null = null;
  role: UserRole = UserRole.VIEWER;
  password: string | null = null;
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
      Helpers.merge(this, json);
      this.organization = new Organization(json.organization);
      if (json.updatedAt && json.createdAt) {
        this.updatedAt = new Date(Date.parse(json.updatedAt.toString()));
        this.createdAt = new Date(Date.parse(json.createdAt.toString()));
      }
    }
  }
  public toJSON() {
    return { ...this };
  }

  public errors(): [] {
    return [];
  }
}

export { User, Token };
export type { UserData };
