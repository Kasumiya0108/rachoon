import _ from "lodash";
interface IBase {
  errors: () => string[];
}
class Base<T> {
  public constructor(json?: T) {
    if (json) {
      _.merge(this, json);
    }
  }
  public toJSON() {
    return { ...this };
  }
}

export { Base, type IBase };
