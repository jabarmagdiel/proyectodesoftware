# Jitsi — Setup local

## Setup inicial

```bash
# 1. Clonar el repo oficial dentro de tu proyecto
git clone https://github.com/jitsi/docker-jitsi-meet.git jitsi

# 2. Entrar a la carpeta y copiar el archivo de ejemplo
cd jitsi
cp env.example .env

# 3. Generar contraseñas automáticas (las mete en el .env)
bash gen-passwords.sh

# 4. Levantar los contenedores
docker compose up -d
```

## Configuración del .env de Jitsi

Luego de generar el `.env`, cambiar estos parámetros:

| Variable      | Valor                    |
| ------------- | ------------------------ |
| `PUBLIC_URL`  | `https://localhost:8443` |
| `ENABLE_AUTH` | `0`                      |

También cambiar en el `.env` del frontend:

| Variable            | Valor            |
| ------------------- | ---------------- |
| `VITE_JITSI_DOMAIN` | `localhost:8443` |

## Recrear contenedores

Cada vez que cambies el `.env` de Jitsi, un simple restart no alcanza. Hay que borrar la config generada:

```bash
docker compose down
rm -rf ~/.jitsi-meet-cfg
docker compose up -d
```

## Primer uso en el navegador (Chrome)

Jitsi usa HTTPS con certificado auto-firmado. Hay que aceptarlo una vez por cada recreación:

1. Ir a **`https://localhost:8443`** en Chrome
2. Click en **"Configuración avanzada"** → **"Acceder a localhost (sitio no seguro)"**
3. Volver a la app en `http://localhost:5173`
