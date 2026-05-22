import { useState } from "react";
import { MainLayout } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui";
import { useCurrentUser, useLogout } from "@/features/auth";
import { UsuariosTable, UsuarioModal } from "@/features/usuarios";
import type { Usuario } from "@/features/usuarios";
import { UI, USUARIOS } from "@/config/constants";

export default function UsuariosPage() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>(undefined);

  const handleOpenCreate = () => {
    setSelectedUsuario(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(undefined);
  };

  const displayName = user?.username;

  return (
    <MainLayout userName={displayName} onLogout={logout}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-lg)",
        }}
      >
        <h1
          style={{
            fontSize: "var(--font-size-2xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text)",
          }}
        >
          {UI.USUARIOS_TITLE}
        </h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          {USUARIOS.BTN_NUEVO}
        </Button>
      </div>

      <UsuariosTable onEdit={handleEdit} />

      {isModalOpen && (
        <UsuarioModal onClose={handleCloseModal} usuario={selectedUsuario} />
      )}
    </MainLayout>
  );
}
