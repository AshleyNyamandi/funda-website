
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '';

if (!supabaseUrl) {
	// message to help debugging when the env var is missing at runtime
	throw new Error(
		'VITE_SUPABASE_URL is required but was not found.\n' +
			'Make sure you have a `.env` file at the project root (next to package.json)\n' +
			"and that the variable is named VITE_SUPABASE_URL. Restart the dev server after changes."
	);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
        