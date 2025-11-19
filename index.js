require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://dmtrxkgcngebdqurydeg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Casim = require("./uploads/Casim_RESUME.pdf");
supabase.storage
  .from("avatars")
  .upload("public/avatar1.pdf", Casim, {
    cacheControl: "3600",
    upsert: false,
  })
  .then((data) => {
    console.log(data);
  });
