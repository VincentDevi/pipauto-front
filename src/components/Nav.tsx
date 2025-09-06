export default function Nav() {
  return (
    <ul class="h-full flex flex-col gap-4 border-r-2">
      <li class="text-center border-b-4 py-4">
        <a href="/">Pipauto</a>{" "}
      </li>
      <li class="">
        <a href="/clients">clients</a>
      </li>
      <li class="">
        <a href="/cars">cars</a>
      </li>
      <li class="">
        <a href="/interventions">interventions</a>
      </li>
    </ul>
  );
}
