import { useState } from "react";
import { Button, Input } from "@/shared/components/ui";
import { UI } from "@/config/constants";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, isError, error } = useLogin();

  const errorMessage = isError
    ? ((error?.response?.data?.detail ?? error?.response?.data?.message) || UI.LOGIN_ERROR_DEFAULT)
    : undefined;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ username, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
    >
      <Input
        label={UI.LOGIN_USERNAME_LABEL}
        type="text"
        name="username"
        placeholder={UI.LOGIN_USERNAME_PLACEHOLDER}
        value={username}
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        label={UI.LOGIN_PASSWORD_LABEL}
        type="password"
        name="password"
        placeholder={UI.LOGIN_PASSWORD_PLACEHOLDER}
        value={password}
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && (
        <p
          role="alert"
          style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-danger)" }}
        >
          {errorMessage}
        </p>
      )}
      <Button type="submit" loading={isPending}>
        {UI.LOGIN_BUTTON}
      </Button>
    </form>
  );
}
