import { ParentProps, JSX } from "solid-js";

interface DefaultLayoutProps extends ParentProps {
  nav: JSX.Element;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  return (
    <div class="h-screen w-screen flex">
      <nav class="h-full w-48 flex flex-col">{props.nav}</nav>
      <main class="h-full w-[calc(100%-192px)] ">{props.children}</main>
    </div>
  );
}
