import { Document } from "~~/models/document";
import _ from "lodash";

class Dashboard {
  invoices = {
    net: 0,
    total: 0,
    pending: [] as Document[],
  };
  offers = {
    net: 0,
    total: 0,
    pending: [] as Document[],
  };

  constructor(json?: any) {
    if (json) {
      _.merge(this, json);
      this.invoices.pending = this.invoices.pending.map(
        (i) => new Document(i),
      );
      this.offers.pending = this.offers.pending.map(
        (i) => new Document(i),
      );
    }
  }

  public toJSON() {
    return { ...this };
  }
}

export { Dashboard };
