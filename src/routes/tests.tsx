import { RouteSectionProps } from "@solidjs/router";

export default function Layout(props: RouteSectionProps) {
  return (
    <>
      <p> test layout</p>
      {props.children}
    </>
  );
}
