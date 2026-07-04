import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-forwarded-for",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse form data
    const formData = await req.formData();

    const techId = formData.get("techId") as string;
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const description = formData.get("description") as string;
    const selfRoast = formData.get("selfRoast") as string;
    const recaptchaToken = formData.get("recaptchaToken") as string;

    // Basic validation
    if (!techId || !name || !description || !selfRoast) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify reCAPTCHA token if provided
    if (recaptchaToken) {
      const recaptchaSecretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");

      if (recaptchaSecretKey) {
        const verificationResponse = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              secret: recaptchaSecretKey,
              response: recaptchaToken,
            }).toString(),
          }
        );

        const verificationResult = await verificationResponse.json();

        // Check if verification was successful
        if (!verificationResult.success || verificationResult.score < 0.5) {
          return new Response(
            JSON.stringify({ error: "Bot activity detected. Please try again." }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Process screenshot if provided
    let screenshotUrl: string | null = null;
    const screenshotEntry = formData.get("screenshot");

    if (screenshotEntry && screenshotEntry instanceof File) {
      try {
        const file = screenshotEntry;
        const filename = file.name || "upload.jpg";
        const contentType = file.type || "image/jpeg";

        // Validate file type
        if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
          return new Response(
            JSON.stringify({
              error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Generate a random filename with proper extension
        const fileExt = filename.split(".").pop() || "jpg";
        const randomFilename = `${crypto.randomUUID()}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("project-screenshots")
          .upload(randomFilename, file, {
            cacheControl: "3600",
            upsert: true,
            contentType,
          });

        if (uploadError) {
          return new Response(
            JSON.stringify({
              error: `Failed to upload screenshot: ${uploadError.message}`,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("project-screenshots")
          .getPublicUrl(randomFilename);

        screenshotUrl = publicUrlData.publicUrl;
      } catch (uploadException) {
        return new Response(
          JSON.stringify({
            error: `Screenshot upload failed: ${
              uploadException instanceof Error ? uploadException.message : "Unknown error"
            }`,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Insert submission into database
    const { error } = await supabase
      .from("tech_projects")
      .insert({
        tech_id: techId,
        name,
        url: url || null,
        github_url: githubUrl || null,
        description,
        self_roast: selfRoast,
        screenshot_url: screenshotUrl,
        is_approved: false,
      })
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to submit project" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Project submitted successfully and will be reviewed by our team.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Something went wrong. Just like your favorite framework." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
