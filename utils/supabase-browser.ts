import { Database } from '../types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// creating browser client
export const createClientB = () => createClientComponentClient<Database>();
