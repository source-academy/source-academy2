use Mix.Config

config :source_academy, :environment, :prod

config :source_academy, SourceAcademy.Endpoint,
  load_from_system_env: true,
  server: true,
  root: ".",
  version: Mix.Project.config[:version],
  cache_static_manifest: "priv/static/cache_manifest.json"

# Do not print debug messages in production
config :logger, level: :info

config :tzdata, :data_dir, "/etc/elixir_tzdata_data"
config :tzdata, :autoupdate, :disabled

import_config "prod.secret.exs"
