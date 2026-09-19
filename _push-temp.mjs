import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "node:fs";

const dir = process.cwd();
const token = process.env.GH_PUSH_TOKEN;
if (!token) throw new Error("GH_PUSH_TOKEN not set");

const res = await git.push({
  fs,
  http,
  dir,
  remote: "origin",
  ref: "master",
  onAuth: () => ({ username: token }),
});

console.log(JSON.stringify(res, null, 2));
