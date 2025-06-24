/**
 * Sube un archivo de audio junto con los metadatos al backend
 */
export const uploadAudio = async (audioFile, metadata, token = null) => {
  // Validaciones básicas
  if (!audioFile) {
    throw new Error("El archivo de audio es requerido");
  }

  if (!audioFile.type.startsWith("audio/")) {
    throw new Error("Solo se permiten archivos de audio");
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
  formData.append("audio", audioFile);

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
    console.error("Error uploading audio:", error);
    throw error;
  }
};
