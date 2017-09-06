use Mix.Config

config :source_academy, SourceAcademy.Endpoint,
  http: [port: 4001],
  server: false

config :source_academy, SourceAcademy.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "source_academy_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

  # Print only warnings and errors during test
config :logger, level: :warn
