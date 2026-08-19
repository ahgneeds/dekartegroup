import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-setup-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const setupKey = Deno.env.get("ADMIN_SETUP_KEY");
    const providedKey = req.headers.get("x-admin-setup-key");
    if (!setupKey || providedKey !== setupKey) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Forbidden",
          setupKeyConfigured: !!setupKey,
          keyMatch: setupKey === providedKey,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminEmail || !adminPassword) {
      return new Response(
        JSON.stringify({ ok: false, error: "ADMIN_EMAIL / ADMIN_PASSWORD secrets are missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "Server environment is incomplete" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: users, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) throw listError;

    const exists = users.users.some(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase(),
    );
    if (exists) {
      return new Response(
        JSON.stringify({ ok: true, created: false, message: "Admin already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: created, error: createError } =
      await adminClient.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: "admin" },
      });
    if (createError) throw createError;

    return new Response(
      JSON.stringify({ ok: true, created: true, userId: created.user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
