import * as dateFnsLocale from "date-fns/locale";
import * as dateFns from "date-fns";

export default class Format {
  static toCurrency(value: any, locale: string, currency: string) {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    });

    return formatter.format(Number(value));
  }

  static date(value: any, locale: string) {
    const loc = dateFnsLocale[locale || "enUS"];
    return dateFns.format(Date.parse(value), "P", { locale: loc });
    // const formatter = new Intl.DateTimeFormat(useSettings().settings.general.locale)
    // return formatter.format(Date.parse(value))
  }

  static longDate(value: any, locale: string) {
    const loc = dateFnsLocale[locale || "enUS"];
    return dateFns.format(Date.parse(value), "PPPP", { locale: loc });
  }

  static max100(val: string) {
    if (Number(val) > 100) val = "100";
    return val;
  }

  static invoiceOrOfferNumber(
    entity: { start: number; format: string; padZeros: number },
    add: number = 0,
  ) {
    let number = String(Number(entity.start) + add).padStart(
      entity.padZeros,
      "0",
    );

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
