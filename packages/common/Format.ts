import { DateTime } from "luxon";

export default class Format {
  static toCurrency(value: any, locale: string, currency: string) {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    });

    return formatter.format(Number(value));
  }

  static date(value: any, locale: string) {
    console.log(value);
    return DateTime.fromObject(value)
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_SHORT); // const formatter = new Intl.DateTimeFormat(locale);
    // return formatter.format(Date.parse(value));
  }

  static longDate(value: any, locale: string) {
    return DateTime.fromObject(value)
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_FULL);
  }

  static max100(val: string) {
    if (Number(val) > 100) val = "100";
    return val;
  }

  static number(entity: { format: string; padZeros: number }, add: number = 0) {
    let number = String(1 + add).padStart(entity.padZeros, "0");

    number = entity.format.replace("{number}", number);
    const d = number.match(/\{date:[a-zA-Z_\-\.]+\}/);
    if (d) {
      const format = d[0].replace("{date:", "").replace("}", "");
      try {
        const date = dateFns.format(new Date(), format);
        number = number.replace(d[0], date);
      } catch (e) {
        number = number.replace(d[0], "INVALID-DATEFORMAT");
      }
    }
    return number;
  }
}
