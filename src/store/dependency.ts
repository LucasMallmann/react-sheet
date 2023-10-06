import { atom } from "recoil";
import { Graph } from "@dagrejs/graphlib";

const graph = new Graph({
  directed: true,
});

export const dependencyGraphState = atom({
  key: "dependency-graph",
  default: graph,
});
