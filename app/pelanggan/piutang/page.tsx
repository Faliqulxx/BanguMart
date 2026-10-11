import { redirect } from "next/navigation";

export default function PelangganPiutangRedirect() {
  redirect("/pelanggan?tab=piutang");
}
