export default defineNuxtRouteMiddleware((to, from) => {
  if (!useAuth().key() && !["/login", "/signup"].includes(to.path)) {
    return navigateTo("login");
  }

  if (useAuth().key() && ["/login", "/signup"].includes(to.path)) {
    return navigateTo("");
  }

  if (
    useAuth().key() &&
    useProfile().me.email !== "" &&
    !to.path.includes("/settings") &&
    !to.path.includes("/logout") &&
    !to.path.includes("/profile") &&
    useProfile().me.organization.data.address.street === "" &&
    useProfile().me.organization.data.address.zip === "" &&
    useProfile().me.organization.data.address.city === "" &&
    useProfile().me.organization.data.address.country === ""
  ) {
    const { $toast } = useNuxtApp();

    $toast(
      `<div class="text-sm"><div><strong>Hey, ${useProfile().me.data.username}</strong></div><div>Please setup your organiztion settings first before proceeding</div></div>`,
      {
        theme: "auto",
        type: "error",
        position: "bottom-right",
        dangerouslyHTMLString: true,
      },
    );

    return navigateTo("/settings");
  }
});
