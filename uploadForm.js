/**
 * Sube un archivo de audio junto con los metadatos y opcionalmente una imagen del ticket al backend
 */
export const uploadAudio = async (
  audioFile,
  imageFile = null,
  metadata,
  token = null
) => {
  // Validaciones básicas
  if (!audioFile) {
    throw new Error("El archivo de audio es requerido");
  }

  if (!audioFile.type.startsWith("audio/")) {
    throw new Error("Solo se permiten archivos de audio");
  }

  // Validar imagen si se proporciona
  if (imageFile && !imageFile.type.startsWith("image/")) {
    throw new Error("Solo se permiten archivos de imagen para el ticket");
  }

  const formData = new FormData();

  // Agregar metadatos
  formData.append("nombre_cliente", metadata.nombre_cliente);
  formData.append("email_cliente", metadata.email_cliente);
  formData.append("nombre_comercio", metadata.nombre_comercio);
  formData.append("numero_ticket", metadata.numero_ticket);
  formData.append(
    "fecha_y_hora",
    metadata.fecha_y_hora || new Date().toISOString()
  );
  formData.append("geolocalizacion", JSON.stringify(metadata.geolocalizacion));
  formData.append("opinion_texto", metadata.opinion_texto || "");
  formData.append("audio", audioFile);

  // Agregar imagen del ticket si existe
  if (imageFile) {
    formData.append("imagen_ticket", imageFile);
  }

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch("http://localhost:8000/api/upload-audio", {
      method: "POST",
      body: formData,
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading audio and image:", error);
    throw error;
  }
};

/**
 * Sube solo una imagen del ticket (sin audio)
 */
export const uploadTicketImage = async (imageFile, metadata, token = null) => {
  // Validaciones básicas
  if (!imageFile) {
    throw new Error("La imagen del ticket es requerida");
  }

  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Solo se permiten archivos de imagen");
  }

  const formData = new FormData();

  // Agregar metadatos
  formData.append("nombre_cliente", metadata.nombre_cliente);
  formData.append("email_cliente", metadata.email_cliente);
  formData.append("nombre_comercio", metadata.nombre_comercio);
  formData.append("numero_ticket", metadata.numero_ticket);
  formData.append(
    "fecha_y_hora",
    metadata.fecha_y_hora || new Date().toISOString()
  );
  formData.append("geolocalizacion", JSON.stringify(metadata.geolocalizacion));
  formData.append("opinion_texto", metadata.opinion_texto || "");
  formData.append("imagen_ticket", imageFile);

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      "http://localhost:8000/api/upload-ticket-image",
      {
        method: "POST",
        body: formData,
        headers: headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading ticket image:", error);
    throw error;
  }
};
