import { Client, type ClientType } from "~~/models/client";
import { Document, DocumentStatus, Recurring, type TaxOption } from "~~/models/document";
import Helpers from "@repo/common/Helpers";

import * as dateFns from "date-fns";
import _ from "lodash";
import type { Template } from "~/models/template";
import Base from "./_base";
import { reactive } from "vue";

class DocumentStore extends Base<Document> {
  clients = ref<Client[]>([]);
  templates = ref<Template[]>([]);
  mustSave = ref(-1);
  offer = ref(new Document());
  reminderInvoice = ref(new Document());
  recurring = ref(new Recurring());

  offerToInvoiceOption = ref("full");
  offerToInvoiceValue = ref(1);
  offerToInvoiceValueType = ref("percent");

  parentList = this.list;

  isOfferToConvert = () => this.isNew() && useRoute().query.offer;
  isInvoice = () => this.singularType() === "invoice";
  isOffer = () => this.singularType() === "offer";
  isReminder = () => this.singularType() === "reminder";
  isDisabled = () => false;

  setTemplate = (id: string) => {
    this.item.value.templateId = id;
  };

  setClient = (client: ClientType) => {
    this.item.value.clientId = client.id;
    this.item.value.client = client;
    if (client.data.conditions.discount.value > 0) {
      (client.data.conditions.discount.value,
        client.data.conditions.discount.valueType,
        this.item.value.addDiscountCharge({
          id: Date.now().toString(),
          title: "Client discount",
          type: "discount",
          value: client.data.conditions.discount.value,
          valueType: client.data.conditions.discount.valueType,
          amount: 0,
        }));
    }
    if (this.item.value.data.positions[0].price === null && this.item.value.data.positions[0].quantity === null) {
      this.item.value.removePosition(0);
    }
    this.item.value.rebuild();
  };

  listForClient = (id: string) => {
    this.filter("clientId", "=", id);
    this.list();
  };

  setStatus = (d: Document) => {
    if (d.invoices.length > 0) {
      useToast("Cannot change status", "Offer is already invoiced.", "warning");
      return;
    }
    const status =
      d.status === DocumentStatus.Pending ? (d.type === "invoice" ? DocumentStatus.Paid : DocumentStatus.Accepted) : DocumentStatus.Pending;
    d.setStatus(status);
    useApi().documents(this.singularType()).setStatus(d.id, status);
  };

  list = async () => {
    this.getAllFunc = useApi().documents(this.singularType()).getAll;
    this.parentList();
  };

  save = async () => {
    // super.save();
    const ioo = await useApi().documents(this.singularType()).saveOrUpdate(this.item.value, !this.isNew());
    if (this.isNew()) {
      useRouter().replace(`/${this.type()}/${ioo.id}`);
    }
    this.mustSave.value = 0;
  };

  preview = async () => {
    return (await useRender(this.item.value, true)) as string[];
  };

  download = async (io?: Document) => {
    const dio = io || this.item.value;
    const data = (await useRender(dio)) as string;
    let a = document.createElement("a");
    a.href = data;
    a.download = dio!.number + ".pdf";
    a.click();
  };

  updated = () => {
    this.item.value.rebuild();
    this.mustSave.value++;
  };

  duplicate = async (id: string) => {
    this.loading.value = true;
    const duplicate = await useApi().documents(this.singularType()).duplicate(id);
    useRouter().push(`/${this.type()}/${duplicate.id}`);
    this.loading.value = false;
  };

  handleReminder = async () => {
    this.reminderInvoice.value = await useApi()
      .documents("invoice")
      .get(useRoute().query.invoice as string);
    this.item.value.data.positions[0] = {
      net: this.reminderInvoice.value.data.total,
      tax: 0,
      text: "",
      unit: "",
      price: this.reminderInvoice.value.data.total,
      title: this.reminderInvoice.value.number,
      total: this.reminderInvoice.value.data.total,
      quantity: 1,
      totalPercentage: 100,
    };
    if (useSettings().settings.reminders.fees.length > 0) {
      for (const fee of useSettings().settings.reminders.fees) {
        this.item.value.data.discountsCharges.push(fee);
      }
    } else {
      this.item.value.data.discountsCharges.push({
        title: "Reminder fee",
        value: 5,
        type: "charge",
        valueType: "fixed",
        amount: 0,
      });
    }
    this.item.value.clientId = this.reminderInvoice.value.clientId;
    this.item.value.client = this.reminderInvoice.value.client;
    this.item.value.invoiceId = this.reminderInvoice.value.id;
    this.item.value.data.taxOption = {};
    this.item.value.calculate();
  };

  handleNew = async () => {
    this.recurring.value = new Recurring();
    this.item.value.number = await useApi().number(this.singularType()).get();
    this.item.value.data.dueDate = dateFns.add(this.item.value.data.date, {
      days: useProfile().me.organization.settings[this.type()].dueDays,
    });
    this.item.value.data.taxOption = useSettings().settings.taxes.options.filter((o) => o.default)[0];

    if (this.type() === "reminders") {
      this.handleReminder();
    }
    if (this.offer.value) await this.handleOfferToInvoice();
  };

  form = async () => {
    this.loading.value = true;
    this.clients.value = (await useApi().clients().getAll()).rows;
    this.templates.value = (await useApi().templates().getAll()).rows;
    const id = useRoute().params["id"] as string;

    this.item.value = new Document();
    this.item.value.type = this.singularType();
    if (this.isNew()) {
      await this.handleNew();
    } else {
      this.item.value = Helpers.merge<Document>(this.item.value, await useApi().documents(this.singularType()).get(id));
      if (this.item.value.recurringInvoice) {
        this.recurring.value = this.item.value.recurringInvoice;
      } else {
        this.recurring.value = new Recurring();
      }
    }

    this.item.value.rebuild();
    this.mustSave.value = -1;
    this.loading.value = false;
  };

  setTaxOption = (Option: TaxOption) => {
    this.item.value.data.taxOption = Option;
    this.updated();
  };

  delete = async (id?: string) => {
    useApp().confirm(async () => {
      await useApi()
        .documents("invoice-or-offer")
        .delete(id || this.item.value.id);
      if (id) {
        this.items.value = this.items.value.filter((i) => i.id !== id);
      } else {
        useRouter().replace(`/${this.type()}/`);
      }
    }, `Are you sure you want to delete ${this.singularType()} ${this.item.value.number}?`);
  };

  calculateOfferToInvoice = () => {
    const option = this.offerToInvoiceOption.value;
    const value = Number(this.offerToInvoiceValue.value);
    const valueType = this.offerToInvoiceValueType.value;
    this.item.value.calculateInvoiceToConvertPositions({ ...this.offer.value }, option, value, valueType);
  };

  handleOfferToInvoice = async () => {
    if (useRoute().query.offer) {
      _.mergeWith(
        this.offer.value,
        await useApi()
          .documents("offer")
          .get(useRoute().query.offer as string),
      );
      this.offer.value.rebuild();
      this.item.value.client = this.offer.value.client;
      this.item.value.clientId = this.offer.value.clientId;
      this.item.value.offerId = this.offer.value.id;
      this.calculateOfferToInvoice();
    } else {
      _.mergeWith(this.offer.value, new Document());
    }
  };
}

export default defineStore("document", () => new DocumentStore(ref(new Document()), useApi().documents("invoice").getAll));
