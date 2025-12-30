import { NextRequest, NextResponse } from "next/server";
import { tokenExists } from "./lib/helpers";

const middleware = async (req: NextRequest) => {
  const validTokenExists = await tokenExists();
  if (req.nextUrl.pathname === "/login" && validTokenExists) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (req.nextUrl.pathname === "/" && !validTokenExists) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

export default middleware;
