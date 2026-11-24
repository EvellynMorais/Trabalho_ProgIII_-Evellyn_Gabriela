require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const chave = process.env.SUPABASE_SECRET_KEY;

if (!url || !chave) {
    throw new Error('Configure SUPABASE_URL e SUPABASE_SECRET_KEY no .env');
}

module.exports = createClient(url, chave);