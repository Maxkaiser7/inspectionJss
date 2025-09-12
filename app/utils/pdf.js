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
    const uri = item?.photo || item?.uri || (typeof item === "string" ? item : null);
    if (uri) {
      const base64 = await uriToBase64(uri);
      if (base64) {
        tags.push(`
          <div class="image-block">
            <img src="data:image/jpeg;base64,${base64}" />
          </div>
        `);
      }
    }
  }
  return tags.join(" ");
}

// Rendu des points de départ
async function renderStartPoints(starts) {
  if (!starts || starts.length === 0) return "<p>Aucun point de départ</p>";

  let html = "<h2>🚀 Points de départ</h2>";

  for (const start of starts) {
    const base64 = start.photo ? await uriToBase64(start.photo) : null;
    let point = start.point === "Autre" ? start.customPoint : start.point;
    let detail = start.detail ? ` - ${start.detail}` : "";

    html += `
      <div class="card">
        ${base64 ? `<img src="data:image/jpeg;base64,${base64}" />` : ""}
        <p><b>Point :</b> ${point || "Non précisé"}${detail}</p>
      </div>
    `;
  }

  return html;
}

// Rendu des solutions
async function renderSolutions(solutions) {
  if (!solutions || solutions.length === 0) return "<p>Aucune solution proposée</p>";

  return solutions.map((s, index) => {
    const type = s?.type || "—";

    const champsHtml = `
      <ul>
        <li><b>Diamètre :</b> ${s.diametre || "—"}</li>
        <li><b>Devis :</b> ${s.devis || "Non"}</li>
        <li><b>Camion :</b> ${s.camion || "Non"}</li>
        <li><b>Panneaux OVP :</b> ${s.panneaux || "Non"}</li>

        <li><b>Point départ :</b> ${s.startPoint === "Autre" ? s.customStartPoint || "—" : s.startPoint}</li>
        <li><b>Pièce départ :</b> ${s.startPiece === "Autre" ? s.customStartPiece || "—" : s.startPiece}</li>
        <li><b>Étage départ :</b> ${s.startEtage === "Autre" ? s.customStartEtage || "—" : s.startEtage}</li>

        <li><b>Point arrivée :</b> ${s.endPoint === "Autre" ? s.customEndPoint || "—" : s.endPoint}</li>
        <li><b>Pièce arrivée :</b> ${s.endPiece === "Autre" ? s.customEndPiece || "—" : s.endPiece}</li>
        <li><b>Étage arrivée :</b> ${s.endEtage === "Autre" ? s.customEndEtage || "—" : s.endEtage}</li>

        ${s.metree ? `<li><b>Métrée :</b> ${s.metree}</li>` : ""}
        ${s.etatAcces ? `<li><b>État des accès :</b> ${s.etatAcces === "Autre" ? s.customEtatAcces || "—" : s.etatAcces}</li>` : ""}
        ${s.sprayOuManchette ? `<li><b>Spray ou Manchette :</b> ${s.sprayOuManchette}</li>` : ""}
        ${s.apparenteOuEnterree ? `<li><b>Apparente ou enterrée :</b> ${s.apparenteOuEnterree}</li>` : ""}
        ${s.siphon ? `<li><b>Siphon :</b> ${s.siphon}</li>` : ""}
        ${s.repiquage ? `<li><b>Connexion repiquage :</b> ${s.repiquage}</li>` : ""}
        ${s.tRegardMur ? `<li><b>T de regard/mur :</b> ${s.tRegardMur}</li>` : ""}
        ${s.deterrer ? `<li><b>Déterrer CDV :</b> ${s.deterrer}</li>` : ""}
        ${s.taque ? `<li><b>Taque :</b> ${s.taque}</li>` : ""}
        ${s.commentaire ? `<li><b>Commentaire :</b> ${s.commentaire}</li>` : ""}
      </ul>
    `;

    return `
      <div class="card">
        <h3>Solution ${index + 1} : ${type}</h3>
        ${champsHtml}
      </div>
    `;
  }).join("");
}

export async function generatePdf(data) {
  const {
    clientName,
    address,
    phoneNumber,
    photoUri,
    buildingType,
    floor,
    methods = {},
    photoBlocks,
    cameraPathStart,
    cameraPathSteps,
    cameraPathEnd,
    sonarPhotos,
    date,
  } = data;

  const methodLabels = {
    controleVisuel: "Contrôle visuel",
    curageAvantEndoscopie: "Curage avant endoscopie",
    sonar: "Sonar",
    endoscopie: "Endoscopie par caméra",
    camionHydrocureur: "Camion hydrocureur",
    contreSens: "Contre sens de l’évacuation",
    tropInterference: "Trop d’interférences",
  };

  const defaultMethods = {
    controleVisuel: true,
    curageAvantEndoscopie: true,
    sonar: true,
    endoscopie: true,
  };

  const okMethodsHtml = Object.entries(defaultMethods)
    .filter(([key]) => !methods.hasOwnProperty(key) || methods[key] === true)
    .map(([key, _]) => `<li>${methodLabels[key]} : OK</li>`)
    .join("");

  const problemMethodsHtml = Object.entries(methodLabels)
    .filter(([key]) => methods[key] === false)
    .map(([_, label]) => `<li>${label} : Problème détecté</li>`)
    .join("");

  const allMethodsHtml = [okMethodsHtml, problemMethodsHtml].filter(Boolean).join("");

  let facadeImgTag = "<p>Aucune photo</p>";
  if (photoUri) {
    const base64 = await uriToBase64(photoUri);
    if (base64) {
      facadeImgTag = `<div class="image-block"><img src="data:image/jpeg;base64,${base64}" /></div>`;
    }
  }

  const photoBlocksHtml = await renderImages(photoBlocks || []);
  const startPointsHtml = await renderStartPoints(cameraPathStart || []);
  const solutionsHtml = await renderSolutions(data.solutions);

  let cameraStepsHtml = "<p>Aucune étape caméra</p>";
  if (cameraPathSteps && cameraPathSteps.length > 0) {
    const parts = [];
    for (const step of cameraPathSteps) {
      const base64 = await uriToBase64(step.photo);
      if (base64) {
        const pieceText = step.piece === "Autre" ? step.customPiece || "—" : step.piece || "—";
        const problemsText = (step.problems && step.problems.length > 0)
          ? step.problems.join(", ") + (step.customProblem ? " (" + step.customProblem + ")" : "")
          : "—";
  
        parts.push(`
          <div class="card">
            <img src="data:image/jpeg;base64,${base64}" />
            <p><b>Pièce :</b> ${pieceText}</p>
            <p><b>Étage :</b> ${step.etage || "—"}</p>
            <p><b>Problèmes :</b> ${problemsText}</p>
          </div>
        `);
      }
    }
    cameraStepsHtml = parts.join("");
  }

  let cameraEndHtml = "<p>Aucun point d'arrivée</p>";
  if (cameraPathEnd && cameraPathEnd.photo) {
    const base64 = await uriToBase64(cameraPathEnd.photo);
    if (base64) {
      cameraEndHtml = `
        <div class="card">
          <img src="data:image/jpeg;base64,${base64}" />
          <p><b>Point :</b> ${cameraPathEnd.point || "—"}</p>
          <p><b>Détail :</b> ${cameraPathEnd.detail || "—"}</p>
          <p><b>Impossible d’aller plus loin :</b> ${cameraPathEnd.impossible ? "✅ Oui" : "❌ Non"}</p>
        </div>
      `;
    }
  }

  let sonarHtml = "<p>Aucune photo sonar</p>";
  if (sonarPhotos && sonarPhotos.length > 0) {
    const parts = [];
    for (const item of sonarPhotos) {
      const base64 = await uriToBase64(item.photo);
      if (base64) {
        const usageText = item.usage === "Autre" ? item.usageAutre || "—" : item.usage || "—";
        parts.push(`
          <div class="card">
            <img src="data:image/jpeg;base64,${base64}" />
            <p><b>Pièce :</b> ${item.piece === "Autre" ? item.autre || "—" : item.piece || "—"}</p>
            <p><b>Étage :</b> ${item.etage || "—"}</p>
            <p><b>Usage :</b> ${usageText}</p>
          </div>
        `);
      }
    }
    sonarHtml = parts.join("");
  }

  const html = `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: Helvetica, Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { color: #333; }
          .card {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .image-block {
            text-align: center;
            margin: 15px 0;
            page-break-inside: avoid;
          }
          img {
            max-width: 400px;
            height: auto;
            border-radius: 6px;
            border: 1px solid #ccc;
            margin: 10px 0;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <h1>Rapport d'inspection</h1>
        <p><b>Date:</b> ${date}</p>
        <p><b>Client:</b> ${clientName || "—"}</p>
        <p><b>Adresse:</b> ${address || "—"}</p>
        <p><b>Téléphone:</b> ${phoneNumber || "—"}</p>
        <p><b>Bâtiment:</b> ${buildingType || "—"}, Étage: ${floor || "—"}</p>

        <h2>Méthodes utilisées</h2>
        <ul>${allMethodsHtml}</ul>

        <h2>Photo façade</h2>
        ${facadeImgTag}

        <h2>Bloc Photos</h2>
        ${photoBlocksHtml}

        ${startPointsHtml}

        <h2>Parcours caméra</h2>
        <h3>Étapes</h3>
        ${cameraStepsHtml}
        <h3>Fin</h3>
        ${cameraEndHtml}

        <h2>Photos Sonar</h2>
        ${sonarHtml}

        <h2>Solutions</h2>
        ${solutionsHtml}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  const pdfPath = FileSystem.documentDirectory + `inspection_${Date.now()}.pdf`;
  await FileSystem.copyAsync({ from: uri, to: pdfPath });

  return pdfPath;
}
