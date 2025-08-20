import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

// Convertir un URI en Base64
async function uriToBase64(uri) {
  if (!uri) return null;
  try {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (e) {
    console.log("Erreur conversion image:", e);
    return null;
  }
}

// Rendu d'une liste de photos
async function renderImages(items) {
  if (!items || items.length === 0) return "<p>Aucune photo</p>";

  const tags = [];
  for (const item of items) {
    // On supporte plusieurs formats : {photo}, {uri}, ou string directe
    const uri = item?.photo || item?.uri || (typeof item === "string" ? item : null);
    if (uri) {
      const base64 = await uriToBase64(uri);
      if (base64) {
        tags.push(
          `<img src="data:image/jpeg;base64,${base64}" width="200" style="margin:5px;border:1px solid #ccc"/>`
        );
      }
    }
  }
  return tags.join(" ");
}

export async function generatePdf(data) {
  const {
    clientName,
    address,
    phoneNumber,
    photoUri,
    buildingType,
    floor,
    methods,
    photoBlocks,
    cameraPathStart,
    cameraPathSteps,
    cameraPathEnd,
    date,
  } = data;

  // Labels plus lisibles pour le PDF
  const methodLabels = {
    controleVisuel: "Contrôle visuel",
    curageAvantEndoscopie: "Curage avant endoscopie",
    sonar: "Sonar",
    endoscopie: "Endoscopie par caméra",
    camionHydrocureur: "Camion hydrocureur",
    contreSens: "Contre sens de l’évacuation",
    tropInterference: "Trop d’interférences",
  };

  // Méthodes cochées transformées en HTML
  const methodsHtml =
    Object.entries(methods || {})
      .filter(([_, value]) => value === true)
      .map(([key]) => `<li>${methodLabels[key] || key}</li>`)
      .join("") || "<li>Aucune méthode sélectionnée</li>";

  // Photo façade
  let facadeImgTag = "<p>Aucune photo</p>";
  if (photoUri) {
    const base64 = await uriToBase64(photoUri);
    if (base64) {
      facadeImgTag = `<img src="data:image/jpeg;base64,${base64}" width="250" style="border:1px solid #ccc"/>`;
    }
  }

  // Autres photos
  const photoBlocksHtml = await renderImages(photoBlocks || []);

  const cameraStartHtml = await renderImages(
    cameraPathStart?.map(start => ({ photo: start.photo })) || []
  );

  const cameraStepsHtml = await renderImages(
    cameraPathSteps?.map(step => ({ photo: step.photo })) || []
  );

  const cameraEndHtml = await renderImages(
    cameraPathEnd ? [{ photo: cameraPathEnd.photo }] : []
  );

  // HTML complet
  const html = `
    <html>
      <head><meta charset="utf-8"/></head>
      <body style="font-family: Helvetica, Arial, sans-serif; padding: 20px;">
        <h1>Rapport d'inspection</h1>
        <p><b>Date:</b> ${date}</p>
        <p><b>Client:</b> ${clientName || "—"}</p>
        <p><b>Adresse:</b> ${address || "—"}</p>
        <p><b>Téléphone:</b> ${phoneNumber || "—"}</p>
        <p><b>Bâtiment:</b> ${buildingType || "—"}, Étage: ${floor || "—"}</p>

        <h2>Méthodes utilisées</h2>
        <ul>
          ${methodsHtml}
        </ul>

        <h2>Photo façade</h2>
        ${facadeImgTag}

        <h2>Bloc Photos</h2>
        ${photoBlocksHtml}

        <h2>Parcours caméra</h2>
        <h3>Début</h3>
        ${cameraStartHtml}
        <h3>Étapes</h3>
        ${cameraStepsHtml}
        <h3>Fin</h3>
        ${cameraEndHtml}
      </body>
    </html>
  `;

  // Génération du PDF
  const { uri } = await Print.printToFileAsync({ html });
  const pdfPath = FileSystem.documentDirectory + `inspection_${Date.now()}.pdf`;
  await FileSystem.copyAsync({ from: uri, to: pdfPath });

  return pdfPath;
}
