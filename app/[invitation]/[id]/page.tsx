"use client";

import { use } from "react";

type Params = Promise<{ invitation: string; id: string }>;

export default function CatchAllPage(props: { params: Params }) {
  const params = use(props.params);

  if (params.id) {
    location.href = "/meeting/" + params.id;
    return <></>;
  }

  location.href = "/";
  return <></>;
}
