import { ReportsView, NotFoundView } from "@/views";

const routes = [
  {
    path: "/",
    name: "reports",
    component: ReportsView,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
];


export default routes;
