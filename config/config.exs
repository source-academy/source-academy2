use Mix.Config

# General Application Configuration
config :source_academy,
  namespace: SourceAcademy,
  ecto_repos: [SourceAcademy.Repo]

# Endpoint
config :source_academy, SourceAcademy.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "GMXlMQRXuzMAc0Hv59jSNp1GYWmEBkRgsMbm4xX1NoYpmLQiqBZZb8UjcxO04ayl",
  render_errors: [view: SourceAcademyWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: SourceAcademy.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Ueberauth
config :ueberauth, Ueberauth,
  providers: [
    identity: {Ueberauth.Strategy.Identity, [
      callback_methods: ["POST"],
      param_nesting: "authorization"
    ]}
  ]

# Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Guardian
config :guardian, Guardian,
  issuer: "SourceAcademy",
  ttl: {30, :days},
  verify_issuer: true,
  serializer: SourceAcademy.GuardianSerializer,
  secret_key: "zw9PlP228KGFNba+bTaB1jwg3PKJOyPH5wvyZfyd5u6Qcb704HKDJpteip1hv0mI",
  hooks: GuardianDb,
  permissions: %{
    default: [
      :read_profile,
      :write_profile,
      :read_token,
      :revoke_token,
    ],
    admin: [
      :access
    ]
  }

# GuardianDB
config :guardian_db, GuardianDb,
  repo: SourceAcademy.Repo,
  sweep_interval: 60 # 60 minutes

# Arc
config :arc,
  storage: Arc.Storage.Local

import_config "#{Mix.env}.exs"
