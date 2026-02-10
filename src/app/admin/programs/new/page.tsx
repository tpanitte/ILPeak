// src/app/admin/programs/new/page.tsx

import { CreateProgramWizard } from "@/features/ILPrograms/create-wizard";

export const metadata = {
  title: "Create New ILP Program | Admin",
};

export default function Page() {
  return <CreateProgramWizard />;
}
