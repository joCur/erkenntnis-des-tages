import "https://esm.sh/@supabase/supabase-js@2";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // This is needed to invoke the function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { query } = await req.json();
  console.log("query", query);

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data, error } = await supabaseClient.from("poll_tags").select(
      "value",
    );
    if (error) throw error;
    console.log("tags", data);

    const tagsArray: string[] = data.map(tag => `'${tag.value}'`);
    const tagsString: string = tagsArray.join(", ");

    const chatGptResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "model": "gpt-3.5-turbo",
            "messages": [
              {
                "role": "system",
                "content":
                  `Es existieren ausschließlich folgende Kategorien: ${tagsString}. Du musst dich für exakt eine der existierenden Kategorien entscheiden. Bitte gib nur die Kategorie aus und keinen weiteren Text. Bitte weise folgende Icon-Kombination einer dieser Kategorien zu.`,
              },
              {
                "role": "user",
                "content": query,
              },
            ],
            "temperature": 0,
          },
        ),
      },
    );

    const chat = await chatGptResponse.json();
    console.log("chat-response", chat);
    if (chat.errors) throw new Error(chat.errors[0].message);

    return new Response(
      JSON.stringify({ answer: chat.choices[0].message.content }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});