import { TemplateLayout, DocumentType, TemplateField } from "@/types/database";

export interface DocumentRenderData {
  student_name_en: string;
  student_name_ar: string;
  program_name_en: string;
  program_name_ar?: string;
  credential_number: string;
  student_id_number?: string;
  issue_date: string;
  expiry_date?: string | null;
  degree_level?: string;
  verification_url: string;
  qr_data_uri: string;
  student_avatar?: string | null;
  college_name_en?: string;
  college_name_ar?: string;
  [key: string]: any;
}

interface RenderPayload {
  layout: TemplateLayout;
  data: DocumentRenderData;
}

export function generateDocumentHtml(payload: RenderPayload): string {
  const { layout, data } = payload;
  const isCertificate = layout.template_kind === "certificate";
  const hasCustomBackground = Boolean(layout.background_image_url && layout.background_image_url.trim() !== "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isCertificate ? "Official Certificate" : "Official Student Card"} - ${data.credential_number}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: ${layout.width}px;
      height: ${layout.height}px;
      margin: 0;
      padding: 0;
      background-color: ${layout.background_color || (isCertificate ? "#FFFFFF" : "#020B5A")};
      ${
        hasCustomBackground
          ? `background-image: url('${layout.background_image_url}');
             background-size: 100% 100%;
             background-position: center;
             background-repeat: no-repeat;`
          : ""
      }
      color: #020B5A;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      position: relative;
      -webkit-font-smoothing: antialiased;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    /* Embedded Fonts */
    .font-serif {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .font-playfair {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .font-sans {
      font-family: 'Inter', system-ui, sans-serif;
    }
    .font-arabic {
      font-family: 'Cairo', system-ui, sans-serif;
      direction: rtl;
    }
    .font-mono {
      font-family: 'Courier New', Courier, monospace;
    }

    /* Certificate Decorative Borders (Only rendered for default blank templates) */
    .cert-outer-border {
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border: 3px solid #020B5A;
      pointer-events: none;
    }

    .cert-inner-border {
      position: absolute;
      top: 40px;
      left: 40px;
      right: 40px;
      bottom: 40px;
      border: 1px solid #C8A84E;
      pointer-events: none;
    }

    .cert-corner {
      position: absolute;
      width: 40px;
      height: 40px;
      border-color: #C8A84E;
      border-style: solid;
      pointer-events: none;
    }
    .corner-tl { top: 46px; left: 46px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 46px; right: 46px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 46px; left: 46px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 46px; right: 46px; border-width: 0 2px 2px 0; }

    /* Student Card Decorative Frame (Only rendered for default card templates) */
    .card-inner-border {
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 1px solid rgba(200, 168, 78, 0.4);
      border-radius: 8px;
      pointer-events: none;
    }

    /* Dynamic Absolute Fields */
    .field-container {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1.25;
      overflow: hidden;
      word-break: break-word;
    }
  </style>
</head>
<body>
  ${
    !hasCustomBackground
      ? isCertificate
        ? `
    <!-- DEFAULT CERTIFICATE BORDERS & SEALS -->
    <div class="cert-outer-border"></div>
    <div class="cert-inner-border"></div>
    <div class="cert-corner corner-tl"></div>
    <div class="cert-corner corner-tr"></div>
    <div class="cert-corner corner-bl"></div>
    <div class="cert-corner corner-br"></div>

    <!-- Official Top Seal -->
    <div style="position: absolute; top: 60px; left: 50%; transform: translateX(-50%); width: 70px; height: 70px;">
      <svg viewBox="0 0 200 200" width="70" height="70" fill="none">
        <circle cx="100" cy="100" r="94" stroke="#020B5A" stroke-width="2.5" />
        <circle cx="100" cy="100" r="90" stroke="#C8A84E" stroke-width="1" stroke-dasharray="3 2" />
        <circle cx="100" cy="100" r="70" stroke="#020B5A" stroke-width="1.5" />
        <polygon points="100,50 102,55 107,55 103,58 104,63 100,60 96,63 97,58 93,55 98,55" fill="#C8A84E" />
        <path d="M 75 105 C 85 98, 95 98, 100 102 C 105 98, 115 98, 125 105 L 125 125 C 115 118, 105 118, 100 122 C 95 118, 85 118, 75 125 Z" stroke="#020B5A" stroke-width="2" fill="none" />
      </svg>
    </div>

    <!-- Official Institutional Signatory Seals -->
    <div style="position: absolute; bottom: 85px; left: 160px; text-align: center; width: 220px;">
      <div style="border-bottom: 1px solid #020B5A; padding-bottom: 8px; margin-bottom: 6px; font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: #243A8F;">
        Dr. Arthur Pendelton
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #020B5A; text-transform: uppercase; letter-spacing: 0.1em;">
        Chancellor & President
      </div>
      <div style="font-size: 10px; color: #64748B;">Cambria International College</div>
    </div>

    <div style="position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%); text-align: center; width: 140px;">
      <div style="width: 80px; height: 80px; margin: 0 auto; border-radius: 50%; border: 2px double #C8A84E; display: flex; align-items: center; justify-content: center; background: rgba(200, 168, 78, 0.05);">
        <span style="font-size: 10px; font-weight: bold; color: #C8A84E; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
          REGISTRAR<br>OFFICIAL<br>SEAL
        </span>
      </div>
    </div>

    <div style="position: absolute; bottom: 85px; right: 280px; text-align: center; width: 220px;">
      <div style="border-bottom: 1px solid #020B5A; padding-bottom: 8px; margin-bottom: 6px; font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: #243A8F;">
        Eleanor Vance, Registrar
      </div>
      <div style="font-size: 11px; font-weight: 700; color: #020B5A; text-transform: uppercase; letter-spacing: 0.1em;">
        Academic Registrar
      </div>
      <div style="font-size: 10px; color: #64748B;">Office of Records & Verifications</div>
    </div>
        `
        : `
    <!-- DEFAULT STUDENT CARD FRAME -->
    <div class="card-inner-border"></div>
    <div style="position: absolute; top: 120px; left: 50%; transform: translateX(-50%); width: 120px; height: 150px; border: 2px solid #C8A84E; border-radius: 6px; background: rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C8A84E" stroke-width="1.5">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span style="font-size: 9px; color: #E2CCA0; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px;">
        OFFICIAL PHOTO
      </span>
    </div>
        `
      : ""
  }

  <!-- DYNAMIC OVERLAY FIELDS DEFINED IN TEMPLATE JSON -->
  ${layout.fields
    .map((field) => {
      let content = field.staticText || "";
      if (field.contentKey) {
        if (field.contentKey === "student_name_en") content = data.student_name_en || "";
        else if (field.contentKey === "student_name_ar") content = data.student_name_ar || "";
        else if (field.contentKey === "program_name_en") content = data.program_name_en || "";
        else if (field.contentKey === "program_name_ar") content = data.program_name_ar || data.program_name_en || "";
        else if (field.contentKey === "credential_number") content = data.credential_number || "";
        else if (field.contentKey === "student_id_number") content = data.student_id_number || "";
        else if (field.contentKey === "issue_date") content = data.issue_date || "";
        else if (field.contentKey === "expiry_date") content = data.expiry_date || "N/A";
        else if (field.contentKey === "degree_level") content = data.degree_level || "";
        else if (field.contentKey === "college_name_en") content = data.college_name_en || "CAMBRIA INTERNATIONAL COLLEGE";
        else if (field.contentKey === "college_name_ar") content = data.college_name_ar || "كلية كامبريا الدولية";
        else if (data[field.contentKey]) content = String(data[field.contentKey]);
      }

      // Format QR Code
      if (field.type === "qr") {
        return `
        <div
          class="field-container"
          style="
            left: ${field.x}px;
            top: ${field.y}px;
            width: ${field.w}px;
            height: ${field.h}px;
            align-items: center;
            justify-content: center;
            opacity: ${field.opacity ?? 1};
          "
        >
          <img
            src="${data.qr_data_uri}"
            alt="Cryptographic Verification QR"
            style="
              width: ${field.w}px;
              height: ${field.h}px;
              border-radius: ${field.borderRadius ?? 4}px;
              background: #FFFFFF;
              padding: 4px;
              object-fit: contain;
            "
          />
        </div>
        `;
      }

      // Format Images (Avatar, Official Seal, Custom Logo/Stamp)
      if (field.type === "image") {
        if (field.contentKey === "college_seal") {
          return `
          <div
            class="field-container"
            style="
              left: ${field.x}px;
              top: ${field.y}px;
              width: ${field.w}px;
              height: ${field.h}px;
              align-items: center;
              justify-content: center;
              opacity: ${field.opacity ?? 1};
            "
          >
            <svg viewBox="0 0 200 200" width="${field.w}" height="${field.h}" fill="none">
              <circle cx="100" cy="100" r="94" stroke="#020B5A" stroke-width="2.5" />
              <circle cx="100" cy="100" r="90" stroke="#C8A84E" stroke-width="1" stroke-dasharray="3 2" />
              <circle cx="100" cy="100" r="70" stroke="#020B5A" stroke-width="1.5" />
              <polygon points="100,50 102,55 107,55 103,58 104,63 100,60 96,63 97,58 93,55 98,55" fill="#C8A84E" />
              <path d="M 75 105 C 85 98, 95 98, 100 102 C 105 98, 115 98, 125 105 L 125 125 C 115 118, 105 118, 100 122 C 95 118, 85 118, 75 125 Z" stroke="#020B5A" stroke-width="2" fill="none" />
            </svg>
          </div>
          `;
        }

        if (field.contentKey === "student_photo" || field.contentKey === "student_avatar") {
          const avatarUrl = data.student_avatar || "/images/avatar-placeholder.png";
          return `
          <div
            class="field-container"
            style="
              left: ${field.x}px;
              top: ${field.y}px;
              width: ${field.w}px;
              height: ${field.h}px;
              border: 2px solid #C8A84E;
              border-radius: ${field.borderRadius ?? 6}px;
              overflow: hidden;
              background: rgba(255,255,255,0.1);
              opacity: ${field.opacity ?? 1};
            "
          >
            <img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Student Photo" />
          </div>
          `;
        }

        const imgSrc = field.staticText || "";
        if (imgSrc) {
          return `
          <div
            class="field-container"
            style="
              left: ${field.x}px;
              top: ${field.y}px;
              width: ${field.w}px;
              height: ${field.h}px;
              opacity: ${field.opacity ?? 1};
              border-radius: ${field.borderRadius ?? 0}px;
            "
          >
            <img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: contain;" alt="Field Image" />
          </div>
          `;
        }
      }

      // Format Text & Badges
      const isRtl = field.direction === "rtl";
      const fontClass =
        field.font === "Cormorant Garamond"
          ? "font-serif"
          : field.font === "Cairo"
          ? "font-arabic"
          : field.font === "Playfair Display"
          ? "font-playfair"
          : field.font === "Courier New"
          ? "font-mono"
          : "font-sans";

      return `
      <div
        class="field-container ${fontClass}"
        style="
          left: ${field.x}px;
          top: ${field.y}px;
          width: ${field.w}px;
          height: ${field.h}px;
          font-size: ${field.size || 16}px;
          font-weight: ${field.weight || 400};
          color: ${field.color || (isCertificate ? "#020B5A" : "#FFFFFF")};
          text-align: ${field.align || (isRtl ? "right" : "left")};
          ${isRtl ? "direction: rtl;" : ""}
          opacity: ${field.opacity ?? 1};
          border-radius: ${field.borderRadius ?? 0}px;
          ${field.letterSpacing ? `letter-spacing: ${field.letterSpacing};` : ""}
          ${field.lineHeight ? `line-height: ${field.lineHeight};` : ""}
        "
      >
        ${content}
      </div>
      `;
    })
    .join("\n")}
</body>
</html>`;
}
