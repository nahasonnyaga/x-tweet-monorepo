import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  let name = "Guest"; // default if none provided

  try {
    const body = await req.json();
    if (body.name) name = body.name;
    console.log("Received body:", body);
  } catch (err) {
    console.error("Error parsing JSON:", err);
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = { message: `Hello ${name}!` };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
