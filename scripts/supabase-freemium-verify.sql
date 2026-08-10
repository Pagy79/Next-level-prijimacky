-- 1) Ověření — mělo by vrátit 2–3 řádky. Když 0, funkce neexistují.
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('start_practice_test', 'start_big_test', 'guard_profile_columns')
ORDER BY routine_name;
