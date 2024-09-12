<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $procedure = <<<'EOD'
            CREATE OR REPLACE FUNCTION get_paginated_users(
                p_current_page INT DEFAULT 1,
                p_per_page INT DEFAULT 10,
                p_sort_by TEXT DEFAULT 'first_name:asc',
                p_search_key TEXT DEFAULT '',
                p_filters JSONB DEFAULT '[]'::jsonb,
                p_model_type TEXT DEFAULT 'App\Models\User'
            )
            RETURNS TABLE (
                current_page INT,
                per_page INT,
                total_users BIGINT,
                total_pages INT,
                "rows" JSONB
            ) 
            LANGUAGE plpgsql
            AS $$
            DECLARE
                sql_query TEXT;
                count_query TEXT;
                offset_value INT := (p_current_page - 1) * p_per_page;
                filter_row JSONB;
                filter_condition TEXT;
                dbcolumns TEXT[];
                dbcolumn TEXT;
                filter_value TEXT;
                total_count BIGINT;
                total_pages INT;
            BEGIN
                -- Build the base query
                sql_query := format('
                SELECT COALESCE(jsonb_agg(row_to_json(u)), ''[]''::jsonb) 
                FROM (
                    SELECT 
                        u.hris_id, 
                        u.user_id, 
                        u.first_name, 
                        u.middle_name, 
                        u.last_name, 
                        u.email, 
                        u."position", 
                        u.contact_no, 
                        u.pro_code, 
                        u.employment_status, 
                        u.office_id, 
                        u.account_status, 
                        u.avatar, 
                        u.email_verified_at, 
                        u.profile_photo_path, 
                        u.esignature_path, 
                        u.created_at, 
                        u.updated_at,
                        o.name AS office_name,
                        o.address AS office_address,
                        o.acronym AS office_acronym,
                        o.pro AS office_pro,
                        o.type AS office_type,
                        o.parent_id AS office_parent_id,
                        array_agg(r.name) AS roles
                    FROM users u
                    LEFT JOIN offices o ON u.office_id = o.id
                    LEFT JOIN model_has_roles mhr ON u.id = mhr.model_id AND mhr.model_type = %L
                    LEFT JOIN roles r ON mhr.role_id = r.id
                    WHERE 1=1', p_model_type);

                -- Build the count query
                count_query := format('
                SELECT COUNT(DISTINCT u.id)
                FROM users u
                LEFT JOIN offices o ON u.office_id = o.id
                LEFT JOIN model_has_roles mhr ON u.id = mhr.model_id AND mhr.model_type = %L
                LEFT JOIN roles r ON mhr.role_id = r.id
                WHERE 1=1', p_model_type);

                -- Add search_key condition
                IF p_search_key != '' THEN
                    sql_query := sql_query || ' AND (u.first_name ILIKE ' || quote_literal('%' || p_search_key || '%') || 
                                ' OR u.last_name ILIKE ' || quote_literal('%' || p_search_key || '%') || ')';
                    count_query := count_query || ' AND (u.first_name ILIKE ' || quote_literal('%' || p_search_key || '%') || 
                                ' OR u.last_name ILIKE ' || quote_literal('%' || p_search_key || '%') || ')';
                END IF;

                -- Add filters from the JSONB array
                IF jsonb_array_length(p_filters) > 0 THEN
                    FOR filter_row IN SELECT * FROM jsonb_array_elements(p_filters) LOOP
                        filter_condition := '';
                        -- Convert dbcolumn JSONB array to PostgreSQL array
                        SELECT array_agg(value) INTO dbcolumns
                        FROM jsonb_array_elements_text(filter_row->'dbColumn');

                        -- Get the filter value
                        filter_value := filter_row->>'value';

                        -- Construct filter conditions based on dbcolumns
                        FOREACH dbcolumn IN ARRAY dbcolumns LOOP
                            CASE dbcolumn
                                WHEN 'office_name' THEN
                                    filter_condition := filter_condition || 'o.name ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                                WHEN 'office_address' THEN
                                    filter_condition := filter_condition || 'o.address ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                                WHEN 'office_acronym' THEN
                                    filter_condition := filter_condition || 'o.acronym ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                                WHEN 'office_pro' THEN
                                    filter_condition := filter_condition || 'o.pro ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                                WHEN 'office_type' THEN
                                    filter_condition := filter_condition || 'o.type ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                                WHEN 'roles' THEN
                                    filter_condition := filter_condition || 'r.name ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                                ELSE
                                    filter_condition := filter_condition || 'u.' || quote_ident(dbcolumn) || ' ILIKE ' || quote_literal('%' || filter_value || '%') || ' OR ';
                            END CASE;
                        END LOOP;

                        -- Remove the trailing ' OR '
                        IF length(filter_condition) > 0 THEN
                            filter_condition := left(filter_condition, length(filter_condition) - 4);
                            sql_query := sql_query || ' AND (' || filter_condition || ')';
                            count_query := count_query || ' AND (' || filter_condition || ')';
                        END IF;
                    END LOOP;
                END IF;

                -- Add GROUP BY clause
                sql_query := sql_query || ' GROUP BY u.id, o.id';

                -- Handle sorting
                IF p_sort_by IS NOT NULL THEN
                    CASE 
                        WHEN split_part(p_sort_by, ':', 1) = ANY(ARRAY['office_name', 'office_address', 'office_acronym', 'office_pro', 'office_type']) THEN
                            sql_query := sql_query || ' ORDER BY o.' || quote_ident(split_part(split_part(p_sort_by, ':', 1), 'office_', 2)) || ' ' || split_part(p_sort_by, ':', 2);
                        WHEN split_part(p_sort_by, ':', 1) = 'roles' THEN
                            sql_query := sql_query || ' ORDER BY array_to_string(array_agg(r.name), '','') ' || split_part(p_sort_by, ':', 2);
                        ELSE
                            sql_query := sql_query || ' ORDER BY u.' || quote_ident(split_part(p_sort_by, ':', 1)) || ' ' || split_part(p_sort_by, ':', 2);
                    END CASE;
                ELSE
                    sql_query := sql_query || ' ORDER BY u.first_name ASC'; -- Default sorting
                END IF;

                -- Add pagination
                sql_query := sql_query || ' LIMIT ' || p_per_page || ' OFFSET ' || offset_value || ') as u';

                -- Execute count query
                EXECUTE count_query INTO total_count;
                
                -- Calculate total pages
                total_pages := CEIL(total_count::float / p_per_page);

                -- Final execution with proper parentheses for rows
                RETURN QUERY EXECUTE format('
                    SELECT 
                        %s::INT AS current_page, 
                        %s::INT AS per_page, 
                        %s::BIGINT AS total_users, 
                        %s::INT AS total_pages, 
                        (%s) AS rows',
                    p_current_page,
                    p_per_page,
                    total_count,
                    total_pages,
                    sql_query
                );
            END;
            $$;
        EOD;

        DB::unprepared($procedure);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS get_users");
    }
};
