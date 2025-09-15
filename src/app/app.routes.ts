import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../app/features/main/main.component").then(
        (m) => m.MainComponent
      ),
    children: [],
  },
  {
    path: "**",
    loadComponent: () =>
      import("../app/features/not-found/not-found.component").then(
        (m) => m.NotFoundComponent
      ),
    title: "Not Found",
  },
];
