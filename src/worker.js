const MAX_BODY_BYTES = 250_000;

const FORM_TYPES = {
  grupa: "Grupa",
  muzikis: "Mūziķis",
  partneris: "Partneris",
};

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function formatSubmission(formData) {
  const fields = [];
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || !value.trim()) continue;
    fields.push(`${key}:\n${value.trim()}`);
  }
  return fields.join("\n\n");
}

async function sendSubmission(request, env) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES)
    return json({ error: "Submission is too large" }, 413);

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: "Invalid form submission" }, 400);
  }

  const type = formData.get("pieteikuma-tips");
  if (typeof type !== "string" || !(type in FORM_TYPES)) {
    return json({ error: "Invalid submission type" }, 400);
  }

  const text = formatSubmission(formData);
  if (!text || text.length > 200_000) {
    return json({ error: "Invalid submission" }, 400);
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_TO) {
    console.error(JSON.stringify({ event: "submission_not_configured" }));
    return json({ error: "Email delivery is not configured" }, 503);
  }

  const email = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.RESEND_TO],
      subject: `Studeja anketa — ${FORM_TYPES[type]}`,
      text,
      html: `<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${escapeHtml(text)}</pre>`,
    }),
  });

  if (!email.ok) {
    console.error(
      JSON.stringify({ event: "email_delivery_failed", status: email.status }),
    );
    return json({ error: "Email delivery failed" }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/anketa") return sendSubmission(request, env);

    const asset = await env.ASSETS.fetch(request);
    const headers = new Headers(asset.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    return new Response(asset.body, {
      status: asset.status,
      statusText: asset.statusText,
      headers,
    });
  },
};
