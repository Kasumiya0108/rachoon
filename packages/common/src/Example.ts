import { Client } from "./Client";
import { DCType, Document, DocumentType, ValueType } from "./Document";

class Example {
  static get() {
    const client = new Client();
    client.name = "Example client";
    client.data = {
      info: {
        vat: "XX-12345",
        addition: "",
      },
      contactPerson: {
        fullName: "Someone Somebody",
        email: "foo@example.com",
      },
      address: {
        street: "example",
        zip: "1234",
        city: "Somewhere",
        country: "Somewhere",
      },
      conditions: {
        rate: 60,
        discount: { value: 0, valueType: "" },
        earlyPayment: {
          days: 0,
          discount: 0,
        },
        invoiceDueDays: 0,
      },
    };
    const invoice = new Document();
    invoice.type = DocumentType.Invoice;
    invoice.data.positions = [
      {
        id: Date.now(),
        taxPrice: 0,
        discount: 0,
        net: 0,
        netNoDiscount: 0,
        total: 0,
        totalPercentage: 0,
        focused: false,
        title: "Lorem ipsum dolor sit amet",
        text: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>",
        quantity: 5,
        price: 300,
        tax: 20,
        unit: "hrs",
      },
      {
        id: Date.now(),
        taxPrice: 0,
        discount: 0,
        net: 0,
        netNoDiscount: 0,
        total: 0,
        totalPercentage: 0,
        focused: false,
        title: "Lorem ipsum dolor sit amet",
        text: "<p>Lorem ipsum dolor sit amet, consectetuer</p>",
        quantity: 10,
        price: 10000,
        tax: 20,
        unit: "hrs",
      },
    ];
    invoice.data.taxOption = {
      title: "Apply taxes",
      applicable: true,
      default: true,
    };
    invoice.data.discountsCharges = [
      {
        title: "Some discount",
        value: 5,
        type: DCType.Discount,
        valueType: ValueType.Percent,
        amount: 10,
      },
    ];

    invoice.client = client;
    invoice.calculate();

    const offer = new Document();
    offer.type = DocumentType.Offer;
    offer.data.positions = [
      {
        id: Date.now(),
        taxPrice: 0,
        discount: 0,
        net: 0,
        netNoDiscount: 0,
        total: 0,
        totalPercentage: 0,
        focused: false,
        title: "Lorem ipsum dolor sit amet",
        text: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>",
        quantity: 5,
        price: 300,
        tax: 20,
        unit: "hrs",
      },
      {
        id: Date.now(),
        taxPrice: 0,
        discount: 0,
        net: 0,
        netNoDiscount: 0,
        total: 0,
        totalPercentage: 0,
        focused: false,
        title: "Lorem ipsum dolor sit amet",
        text: "<p>Lorem ipsum dolor sit amet, consectetuer</p>",
        quantity: 10,
        price: 10000,
        tax: 20,
        unit: "hrs",
      },
    ];
    offer.data.taxOption = {
      title: "Apply taxes",
      applicable: true,
      default: true,
    };
    offer.data.discountsCharges = [
      {
        title: "Some discount",
        value: 5,
        type: DCType.Discount,
        valueType: ValueType.Percent,
        amount: 10,
      },
    ];

    offer.client = client;
    offer.calculate();

    return { client, invoice, offer };
  }
}

export { Example };
