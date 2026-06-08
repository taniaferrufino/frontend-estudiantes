# Despliegue en Google Cloud con Docker

Esta guía despliega el frontend en Google Cloud usando una imagen Docker y Cloud Run.

## Requisitos

- Tener instalado Docker.
- Tener instalado gcloud y una cuenta con permisos sobre tu proyecto de Google Cloud.
- Tener habilitadas las APIs de Artifact Registry y Cloud Run.
- Conocer la URL pública o interna del backend, porque este frontend usa GATEWAY_URL.

## 1. Variables de entorno

Este proyecto consume el backend desde:

- GATEWAY_URL
- NEXT_PUBLIC_GATEWAY_URL

En local están apuntando a http://localhost:3000. Antes de desplegar, cambia esos valores por la URL real del backend.

## 2. Construir la imagen localmente

Desde la raíz del repositorio:

```bash
docker build -t frontend-academy .
```

## 3. Probar la imagen en local

Ejemplo si tu backend corre en tu máquina:

```bash
docker run --rm -p 3005:3005 \
  -e GATEWAY_URL=http://host.docker.internal:3000 \
  -e NEXT_PUBLIC_GATEWAY_URL=http://host.docker.internal:3000 \
  frontend-academy
```

Abre http://localhost:3005.

## 4. Subir la imagen a Artifact Registry

1. Define tus valores:

```bash
export PROJECT_ID=tu-proyecto
export REGION=us-central1
export REPOSITORY=frontend-repo
export IMAGE_NAME=frontend-academy
```

2. Crea el repositorio de Artifact Registry si todavía no existe:

```bash
gcloud artifacts repositories create $REPOSITORY \
  --repository-format=docker \
  --location=$REGION \
  --description="Imagen Docker del frontend"
```

3. Configura Docker para autenticarse con Google Cloud:

```bash
gcloud auth configure-docker $REGION-docker.pkg.dev
```

4. Etiqueta y sube la imagen:

```bash
docker tag frontend-academy $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest
```

## 5. Desplegar en Cloud Run

Cloud Run debe escuchar el mismo puerto que expone este contenedor: 3005.

```bash
gcloud run deploy frontend-academy \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3005 \
  --set-env-vars GATEWAY_URL=https://tu-backend,NEXT_PUBLIC_GATEWAY_URL=https://tu-backend
```

Al terminar, gcloud te devuelve la URL pública del servicio.

## 6. Flujo de actualización

Cada vez que hagas cambios:

```bash
docker build -t frontend-academy .
docker tag frontend-academy $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest
gcloud run deploy frontend-academy \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3005 \
  --set-env-vars GATEWAY_URL=https://tu-backend,NEXT_PUBLIC_GATEWAY_URL=https://tu-backend
```

## Nota importante

Si el backend también vive en Google Cloud, usa su URL real en GATEWAY_URL. Si cambias el backend de URL, recuerda redeployar el frontend con las nuevas variables.