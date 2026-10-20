-- Somente ambiente local, com credenciais públicas de desenvolvimento.
CREATE ROLE varejo_app LOGIN PASSWORD 'local_app_change_me' NOSUPERUSER NOBYPASSRLS;
GRANT CONNECT ON DATABASE varejo360 TO varejo_app;
GRANT USAGE ON SCHEMA public TO varejo_app;
