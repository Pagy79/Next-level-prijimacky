/**
 * Daily practice reminder e-mail (purple / cosmic style).
 * From: info@fachmanka.cz via Resend.
 */

export function buildDailyReminderEmail({ nickname, appUrl }) {
  const name = (nickname || "parťáku").trim() || "parťáku";
  const url = (appUrl || "").replace(/\/$/, "") || "https://next-level-prijimacky.vercel.app";
  const subject = "Dnes ještě procvič češtinu a posuň raketu dál! 🚀";

  const text = [
    `Ahoj ${name},`,
    "",
    "Radar je tichý — dnes jsi ještě neprocvičoval/a češtinu.",
    "Krátká mise teď posune raketu dál a udrží tvoji sérii naživu.",
    "",
    `Otevři appku: ${url}`,
    "",
    "Tvůj parťák na češtinu",
    "Trénink češtiny · info@fachmanka.cz",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#09041a;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#09041a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:linear-gradient(165deg,#1e1038 0%,#2a1458 42%,#12082b 100%);border:1px solid rgba(167,139,250,0.45);border-radius:22px;overflow:hidden;box-shadow:0 0 40px rgba(124,58,237,0.25);">
          <tr>
            <td style="padding:28px 28px 10px 28px;text-align:center;">
              <div style="font-size:30px;line-height:1;">🚀</div>
              <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c4b5fd;font-weight:700;">
                Trénink češtiny
              </p>
              <h1 style="margin:12px 0 0;font-size:22px;line-height:1.35;color:#f5f3ff;font-weight:800;">
                Dnes ještě procvič češtinu<br/>a posuň raketu dál!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 28px 8px 28px;color:#ddd6fe;font-size:15px;line-height:1.65;">
              <p style="margin:0 0 12px;">Ahoj <strong style="color:#fff;">${escapeHtml(name)}</strong>,</p>
              <p style="margin:0 0 12px;">
                Do 18:00 jsi ještě nespustil/a žádný test ani procvičování.
                Pár minut teď stačí, aby ti denní mise neuletěla.
              </p>
              <p style="margin:0 0 22px;color:#c4b5fd;font-size:13px;">
                Vesmír čeká. Raketa taky. ✨
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:4px 28px 30px 28px;">
              <a href="${url}"
                 style="display:inline-block;background:linear-gradient(90deg,#7c3aed,#4f46e5);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 30px;border-radius:999px;box-shadow:0 10px 28px rgba(124,58,237,0.45);">
                Otevřít appku
              </a>
              <p style="margin:18px 0 0;font-size:11px;line-height:1.5;color:#7c6a9e;">
                Připomínku dostáváš, protože máš zapnuté denní připomínky v nastavení.
                Vypnout můžeš kdykoli v appce.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#5b4b78;">
          info@fachmanka.cz · Tvůj parťák na češtinu
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
