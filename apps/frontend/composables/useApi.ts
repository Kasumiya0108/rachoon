import { Dashboard } from "~~/models/dashboard";
import { Client, type ClientType } from "~~/models/client";
import { InvoiceOrOffer, type InvoiceOrOfferType } from "~~/models/invoiceOrOffer";
import { type OrganizationType } from "~~/models/organization";
import { User, type UserType } from "~~/models/user";
import { Template, type TemplateType } from "~/models/template";

export default function useApi() {
  return {
    clients: (endpoint: string = "/api/clients") => {
      return {
        get: async (id: string): Promise<Client> => new Client(await useHttp.get(`${endpoint}/${id}`)),
        getAll: async (): Promise<Client[]> => ((await useHttp.get(`${endpoint}`)) as []).map((d) => new Client(d)),
        count: async (): Promise<number> => Number(await useHttp.get(`${endpoint}/?count=true`)),
        delete: async (id: string) => await useHttp.del(`${endpoint}/${id}`),
        saveOrUpdate: async (client: ClientType, update: boolean = false) => {
          const notif = {
            title: client.number,
            text: "Client saved successfully",
            type: "success",
          };
          if (update) {
            return await useHttp.put(`${endpoint}/${client.id}`, client, notif);
          } else {
            return (await useHttp.post(`${endpoint}`, client, notif)) as ClientType;
          }
        },
      };
    },

    number: (type: string, endpoint: string = "/api/number") => {
      return {
        get: async (): Promise<string> => await useHttp.get(`${endpoint}/${type}`),
      };
    },

    templates: (endpoint: string = "/api/templates") => {
      return {
        get: async (id: string): Promise<TemplateType> => (await useHttp.get(`${endpoint}/${id}`)) as TemplateType,
        duplicate: async (id: string): Promise<TemplateType> => (await useHttp.get(`${endpoint}/duplicate/${id}`)) as TemplateType,
        getDefault: async (): Promise<Template> => new Template(await useHttp.get(`${endpoint}/default`)),
        getAll: async (): Promise<Template[]> => ((await useHttp.get(`${endpoint}`)) as []).map((d) => new Template(d)),
        delete: async (id: string) => await useHttp.del(`${endpoint}/${id}`),
        saveOrUpdate: async (template: TemplateType, update: boolean = false) => {
          const notif = {
            title: template.title,
            text: "Template saved successfully",
            type: "success",
          };
          if (update) {
            return await useHttp.put(`${endpoint}/${template.id}`, template, notif);
          } else {
            return (await useHttp.post(`${endpoint}`, template, notif)) as TemplateType;
          }
        },
      };
    },

    users: (endpoint: string = "/api/users") => {
      return {
        get: async (id: string): Promise<UserType> => (await useHttp.get(`${endpoint}/${id}`)) as UserType,
        getAll: async (): Promise<User[]> => ((await useHttp.get(`${endpoint}`)) as []).map((d) => new User(d)),
        delete: async (id: string) => await useHttp.del(`${endpoint}/${id}`),
        saveOrUpdate: async (user: UserType, update: boolean = false) => {
          const notif = {
            title: user.data.fullName,
            text: "User saved successfully",
            type: "success",
          };
          if (update) {
            return await useHttp.put(`${endpoint}/${user.id}`, user, notif);
          } else {
            return (await useHttp.post(`${endpoint}`, user, notif)) as UserType;
          }
        },
      };
    },

    invoicesOrOffers: (type: string, endpoint: string = "/api/invoicesoroffers") => {
      return {
        saveOrUpdate: async (invoiceOrOffer: InvoiceOrOfferType, update: boolean = false): Promise<InvoiceOrOfferType> => {
          if (update) {
            await useHttp.put(`${endpoint}/${invoiceOrOffer.id}`, invoiceOrOffer, {
              title: `${type} ${invoiceOrOffer.number}`,
              text: "Successfully updated",
            });
            return invoiceOrOffer;
          } else {
            return (await useHttp.post(`${endpoint}?type=${type}`, invoiceOrOffer, {
              title: invoiceOrOffer.number,
              text: `${type} saved successfully`,
              type: "success",
            })) as InvoiceOrOfferType;
          }
        },
        getAll: async (): Promise<InvoiceOrOffer[]> =>
          ((await useHttp.get(`${endpoint}?type=${type}`)) as []).map((d) => new InvoiceOrOffer(d)),
        get: async (id: string): Promise<InvoiceOrOffer> => new InvoiceOrOffer(await useHttp.get(`${endpoint}/${id}`)),
        duplicate: async (id: string): Promise<InvoiceOrOffer> => await useHttp.get(`${endpoint}/duplicate/${id}`),
        delete: async (id: string) => await useHttp.del(`${endpoint}/${id}`),
        count: async (): Promise<number> => Number(await useHttp.get(`${endpoint}/?count=true&type=${type}`)),
        setStatus: async (id: string, status: string) =>
          await useHttp.put(
            `/api/invoicesoroffers/status/${id}`,
            { status: status },
            {
              title: "Status changed",
              text: "Successfully marked as " + status,
            },
          ),
      };
    },
    organization: (endpoint: string = "/api/organizations") => {
      return {
        getCurrent: async () => await useHttp.get("/"),
        save: async (organization: OrganizationType) =>
          await useHttp.post(endpoint, organization, {
            title: "Settings",
            text: "Successfully saved",
            type: "success",
          }),
      };
    },
    profile: (endpoint: string = "/api/profile") => {
      return {
        get: async () => new User(await useHttp.get(endpoint)),
        save: async (user: UserType) =>
          useHttp.post(endpoint, user, {
            title: "Save profile",
            text: "Profile saved successfully",
          }),
        savePassword: async (password: string) =>
          useHttp.post(
            `${endpoint}?pwOnly=true`,
            { password: password },
            {
              title: "Save password",
              text: "Password saved successfully",
              type: "success",
            },
          ),
      };
    },
    dashboard: () => {
      return {
        get: async () => new Dashboard(await useHttp.get("/api/dashboard")),
      };
    },
    render: async (html: string, preview: boolean = false): Promise<string[] | string> => {
      const res = (await useHttp.post(`/api/render${preview ? "?preview=true" : ""}`, {
        html: html,
      })) as string[];

      if (preview) return res;

      return res[0];
    },
  };
}
