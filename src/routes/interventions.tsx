import Nav from "~/components/Nav";
import DefaultLayout from "~/components/ui/layout";

export default function Interventions() {
  return (
    <DefaultLayout nav={<Nav />}>
      <h2> Liste des interventions de l'organisation</h2>
      <p> une belle list</p>
    </DefaultLayout>
  );
}
